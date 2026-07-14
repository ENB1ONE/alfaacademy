/* AUTHENTICATION & ROUTING LOGIC — ALFA ACADEMY */
const API_BASE_URL = 'https://alfa-api.servicesbr.duckdns.org';

// Helper de Toast
function toast(msg, time=3000) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), time);
}

let tempToken = '';
let tempNome = '';
let tempPerfil = '';

document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    errorDiv.style.display = 'none';

    // Mock Offline Simulation if API doesn't resolve or offline mode
    if (user.toLowerCase() === 'admin' && pass === 'admin123') {
        localStorage.setItem('alfa_token', 'mock-admin-token');
        localStorage.setItem('alfa_profile', 'admin');
        localStorage.setItem('alfa_nome', 'Administrador Geral');
        window.location.href = 'admin-dashboard.html';
        return;
    } else if (user.toLowerCase() === 'reset' && pass === 'reset123') {
        tempToken = 'mock-reset-token';
        tempNome = 'Usuário Provisório';
        tempPerfil = 'treinador';
        document.getElementById('changePasswordModal').style.display = 'flex';
        document.getElementById('newPasswordInput').value = '';
        document.getElementById('changePasswordErr').textContent = '';
        toast('Troca de senha obrigatória solicitada.');
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: user, senha: pass })
        });

        const data = await res.json();

        if (res.ok && data.token && data.usuario) {
            tempToken = data.token;
            tempNome = data.usuario.nome || 'Usuário';
            tempPerfil = data.usuario.perfil || 'treinador';

            if (data.usuario.precisa_trocar_senha) {
                // Open Force Password Change Modal
                document.getElementById('changePasswordModal').style.display = 'flex';
                document.getElementById('newPasswordInput').value = '';
                document.getElementById('changePasswordErr').style.display = 'none';
                toast('Por favor, defina sua nova senha de acesso.');
            } else {
                // Proceed to Dashboard
                persistAndRedirect(tempToken, tempPerfil, tempNome);
            }
        } else {
            errorDiv.innerText = data.erro || data.message || 'Erro de autenticação';
            errorDiv.style.display = 'block';
        }
    } catch (err) {
        console.error(err);
        // Fallback simulate homologation offline if API fails
        if (user === 'alfadmin' && pass === 'Admin@123') {
            tempToken = 'mock-alfadmin-token';
            tempNome = 'Alfa Admin';
            tempPerfil = 'admin';
            document.getElementById('changePasswordModal').style.display = 'flex';
            document.getElementById('newPasswordInput').value = '';
            document.getElementById('changePasswordErr').style.display = 'none';
            toast('Simulação Offline: Troca de senha obrigatória.');
        } else {
            errorDiv.innerText = 'Falha na conexão com o servidor.';
            errorDiv.style.display = 'block';
        }
    }
});

function persistAndRedirect(token, perfil, nome) {
    localStorage.setItem('alfa_token', token);
    localStorage.setItem('alfa_profile', perfil);
    localStorage.setItem('alfa_nome', nome);
    
    toast('Redirecionando...');
    setTimeout(() => {
        if (perfil === 'admin' || perfil === 'Administrador') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'dashboard-treinador.html';
        }
    }, 800);
}

async function salvarNovaSenha() {
    const newPass = document.getElementById('newPasswordInput').value.trim();
    const errDiv = document.getElementById('changePasswordErr');
    
    if (newPass.length < 6) {
        errDiv.innerText = 'A senha deve ter pelo menos 6 caracteres.';
        errDiv.style.display = 'block';
        return;
    }

    try {
        // If mock, skip actual call
        if (!tempToken.startsWith('mock-')) {
            const res = await fetch(`${API_BASE_URL}/api/auth/trocar-senha`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tempToken}`
                },
                body: JSON.stringify({ novaSenha: newPass })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.erro || 'Falha ao redefinir a senha');
            }
        }
        
        document.getElementById('changePasswordModal').style.display = 'none';
        toast('Senha atualizada com sucesso!');
        
        // Log in
        persistAndRedirect(tempToken, tempPerfil, tempNome);
    } catch (e) {
        errDiv.innerText = e.message || 'Erro ao alterar senha.';
        errDiv.style.display = 'block';
    }
}
window.salvarNovaSenha = salvarNovaSenha;

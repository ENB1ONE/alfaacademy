import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Credenciais inválidas.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: "linear-gradient(rgba(10,10,12,0.85), rgba(10,10,12,0.6)), url('/alfaacademy/assets/img/alfa_mosaic_bg.png') center/cover no-repeat"
    }}>
      <div className="card" style={{ maxWidth: 400, width: '100%', backdropFilter: 'blur(12px)', background: 'rgba(18,18,20,0.65)' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--ouro)', marginBottom: 20 }}>ALFA ACADEMY</h2>
        {error && <div style={{ color: '#ef4444', marginBottom: 10, textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>Usuário</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          <label>Senha</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="btn" style={{ width: '100%', marginTop: 10 }}>Entrar</button>
        </form>
      </div>
    </div>
  );
}

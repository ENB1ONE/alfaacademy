with open("crm/src/api.js", "r", encoding="utf-8") as f:
    text = f.read()

interceptor = """
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear token and force logout on expiration or invalid token
      localStorage.removeItem('alfa_token');
      localStorage.removeItem('alfa_perfil');
      localStorage.removeItem('alfa_nome');
      window.location.href = '/alfaacademy/admin/#/login';
    }
    return Promise.reject(error);
  }
);

export default api;
"""

text = text.replace("export default api;", interceptor)

with open("crm/src/api.js", "w", encoding="utf-8") as f:
    f.write(text)

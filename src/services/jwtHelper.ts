// src/services/jwtHelper.ts
export function logJwtAndRoles() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('JWT não encontrado.');
    return;
  }
  console.log('JWT:', token);
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    // Adapta para role (string), roles (array) ou authorities (array)
    let roles = [];
    if (decoded.roles) roles = decoded.roles;
    else if (decoded.authorities) roles = decoded.authorities;
    else if (decoded.role) roles = [decoded.role];
    console.log('Roles extraídas do JWT:', roles);
  } catch (e) {
    console.log('Erro ao decodificar JWT:', e);
  }
}

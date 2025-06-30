// src/services/jwtHelper.ts

/**
 * Verifica se o usuário atual tem role de ADMIN
 */
export function isAdmin(): boolean {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Verifica diferentes formatos de roles no JWT
    if (payload.authorities && Array.isArray(payload.authorities)) {
      return payload.authorities.includes('ADMIN') || payload.authorities.includes('ROLE_ADMIN');
    }
    if (payload.roles && Array.isArray(payload.roles)) {
      return payload.roles.includes('ADMIN') || payload.roles.includes('ROLE_ADMIN');
    }
    if (payload.role) {
      return payload.role === 'ADMIN' || payload.role === 'ROLE_ADMIN';
    }
    
    return false;
  } catch (e) {
    console.error('Erro ao verificar permissões:', e);
    return false;
  }
}

/**
 * Extrai e loga informações do JWT
 */
export function logJwtAndRoles(): void {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('JWT não encontrado.');
    return;
  }
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('JWT Payload:', payload);
    
    let roles: string[] = [];
    if (payload.roles) roles = payload.roles;
    else if (payload.authorities) roles = payload.authorities;
    else if (payload.role) roles = [payload.role];
    
    console.log('Roles encontradas:', roles);
  } catch (e) {
    console.error('Erro ao decodificar JWT:', e);
  }
}

/**
 * Verifica se há um usuário autenticado
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem('token');
  return !!token;
}

/**
 * Obtém o nome de usuário do token JWT
 */
export function getUsername(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || payload.username || null;
  } catch (e) {
    console.error('Erro ao obter username:', e);
    return null;
  }
}

/**
 * Verifica se o usuário atual é o mesmo do perfil
 */
export function isCurrentUser(username: string): boolean {
  return getUsername() === username;
}

/**
 * Obtém o token JWT para requisições autenticadas
 */
export function getAuthHeader(): { Authorization: string } | undefined {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

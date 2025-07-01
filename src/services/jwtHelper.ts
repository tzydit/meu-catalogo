
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

export function logJwtAndRoles(): void {
  const token = localStorage.getItem('token');
  if (!token) {
    return;
  }
  
  try {
    JSON.parse(atob(token.split('.')[1]));
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

export function isCurrentUser(username: string): boolean {
  return getUsername() === username;
}

export function getAuthHeader(): { Authorization: string } | undefined {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

<template>
  <header class="main-header">
    <router-link to="/" class="site-title">Meu Catálogo de Filmes</router-link>
    <nav class="header-nav">
      <div v-if="isAdmin" class="admin-menu">
        <button class="nav-link admin-btn" @click="toggleAdminMenu">
          Administração <span class="dropdown-arrow">▾</span>
        </button>
        <div v-show="showAdminMenu" class="admin-dropdown">
          <router-link to="/gerenciar-filmes" class="dropdown-item">
            <span class="item-icon">📋</span> Gerenciar Filmes
          </router-link>
          <router-link to="/criar-filme" class="dropdown-item">
            <span class="item-icon">➕</span> Adicionar Filme
          </router-link>
        </div>
      </div>
      <router-link v-if="!isLogged" to="/login" class="nav-link">Login</router-link>
      <button v-else class="nav-link profile-btn" @click="goToProfile">
        Perfil
      </button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLogged = ref(!!localStorage.getItem('token'));
const isAdmin = ref(false);
const showAdminMenu = ref(false);

function isUserAdmin() {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Debug - JWT payload:', payload);
    
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

function goToProfile() {
  router.push('/perfil');
}

function toggleAdminMenu() {
  showAdminMenu.value = !showAdminMenu.value;
}

// Fecha o menu ao clicar fora
function handleClickOutside(event: MouseEvent) {
  const adminMenu = document.querySelector('.admin-menu');
  if (adminMenu && !adminMenu.contains(event.target as Node)) {
    showAdminMenu.value = false;
  }
}

function syncAuth() {
  isLogged.value = !!localStorage.getItem('token');
  isAdmin.value = isUserAdmin();
}

onMounted(() => {
  syncAuth();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

window.addEventListener('storage', syncAuth);
router.afterEach(() => { 
  syncAuth();
  showAdminMenu.value = false;
});
</script>

<style scoped>
.main-header {
  width: 100vw;
  background: var(--color-card);
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 2.5rem 1.1rem 1.5rem;
  box-shadow: 0 2px 16px #0001;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  border-bottom: 1.5px solid var(--color-border);
  margin: 0;
  transition: background var(--transition), color var(--transition);
  backdrop-filter: blur(6px);
}
.site-title {
  color: var(--color-primary);
  font-size: 1.7rem;
  font-weight: 900;
  letter-spacing: 1.2px;
  text-decoration: none;
  transition: color var(--transition);
  padding: 0.2rem 0.7rem;
  border-radius: 0.6rem;
}
.site-title:hover {
  background: var(--color-primary);
  color: #fff;
}
.header-nav {
  display: flex;
  align-items: center;
  gap: 1.3rem;
  margin-right: 2.5rem; /* Adiciona espaçamento à direita para afastar do canto */
}
.nav-link, .profile-btn {
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 1.08rem;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  padding: 0.6rem 1.2rem;
  border-radius: 0.7rem;
  transition: background var(--transition), color var(--transition);
}
.nav-link:hover, .profile-btn:hover {
  background: var(--color-primary);
  color: #fff;
}
.admin-menu {
  position: relative;
}

.admin-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-primary);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 0.7rem;
  transition: all 0.3s ease;
}

.admin-btn:hover {
  background: var(--color-primary-dark);
}

.dropdown-arrow {
  font-size: 0.8em;
  transition: transform 0.3s ease;
}

.admin-menu.active .dropdown-arrow {
  transform: rotate(180deg);
}

.admin-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 200px;
  background: var(--color-card);
  border: 1.5px solid var(--color-border);
  border-radius: 0.8rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  overflow: hidden;
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.2rem;
  color: var(--color-text);
  text-decoration: none;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: var(--color-bg-alt);
}

.item-icon {
  font-size: 1.2em;
  opacity: 0.8;
}
@media (max-width: 700px) {
  .main-header {
    padding: 0.7rem 0.7rem 0.7rem 0.7rem;
  }
  .site-title {
    font-size: 1.1rem;
    padding: 0.1rem 0.3rem;
  }
  .nav-link, .profile-btn {
    font-size: 0.98rem;
    padding: 0.5rem 0.7rem;
  }
  .header-nav {
    margin-right: 0.3rem;
  }
}
</style>

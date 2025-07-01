<template>
  <header class="main-header">
    <router-link to="/" class="site-title">Meu Catálogo de Filmes</router-link>
    <button class="hamburger-btn" @click="toggleMobileMenu" :aria-expanded="showMobileMenu" aria-label="Abrir menu" :class="{ 'is-active': showMobileMenu }">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <transition name="slide-menu">
      <nav v-if="showMobileMenu" class="mobile-nav">
        <div class="mobile-nav-content">
          <div v-if="isAdmin" class="admin-menu">
            <button class="nav-link admin-btn" @click="toggleAdminMenu">
              Administração <span class="dropdown-arrow">▾</span>
            </button>
            <div v-show="showAdminMenu" class="admin-dropdown mobile-admin-dropdown">
              <router-link to="/gerenciar-filmes" class="dropdown-item" @click="closeMobileMenu">
                <span class="item-icon">📋</span> Gerenciar Filmes
              </router-link>
              <router-link to="/criar-filme" class="dropdown-item" @click="closeMobileMenu">
                <span class="item-icon">➕</span> Adicionar Filme
              </router-link>
            </div>
          </div>
          <router-link v-if="!isLogged" to="/login" class="nav-link" @click="closeMobileMenu">Login</router-link>
          <button v-else class="nav-link profile-btn" @click="goToProfile">Perfil</button>
        </div>
      </nav>
    </transition>
    <nav class="header-nav desktop-nav">
      <div v-if="isAdmin" class="admin-menu">
        <button class="nav-link admin-btn" @click="toggleAdminMenu">
          Administração <span class="dropdown-arrow">▾</span>
        </button>
        <div v-show="showAdminMenu" class="admin-dropdown desktop-admin-dropdown">
          <router-link to="/gerenciar-filmes" class="dropdown-item">
            <span class="item-icon">📋</span> Gerenciar Filmes
          </router-link>
          <router-link to="/criar-filme" class="dropdown-item">
            <span class="item-icon">➕</span> Adicionar Filme
          </router-link>
        </div>
      </div>
      <router-link v-if="!isLogged" to="/login" class="nav-link">Login</router-link>
      <button v-else class="nav-link profile-btn" @click="goToProfile">Perfil</button>
    </nav>
    <div v-if="showMobileMenu" class="mobile-overlay" @click="closeMobileMenu"></div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLogged = ref(!!localStorage.getItem('token'));
const isAdmin = ref(false);
const showAdminMenu = ref(false);
const showMobileMenu = ref(false);

function isUserAdmin() {
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

function goToProfile() {
  router.push('/perfil');
  closeMobileMenu();
}

function toggleAdminMenu() {
  showAdminMenu.value = !showAdminMenu.value;
}

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value;
  if (!showMobileMenu.value) {
    showAdminMenu.value = false;
  }
  // Previne scroll quando menu mobile está aberto
  document.body.style.overflow = showMobileMenu.value ? 'hidden' : '';
}

function closeMobileMenu() {
  showMobileMenu.value = false;
  showAdminMenu.value = false;
  document.body.style.overflow = '';
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
  document.body.style.overflow = '';
});

window.addEventListener('storage', syncAuth);
router.afterEach(() => { 
  syncAuth();
  showAdminMenu.value = false;
  closeMobileMenu();
});
</script>

<style scoped>
.main-header {
  width: 100%;
  background: var(--color-card);
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  box-shadow: var(--color-shadow);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  border-bottom: 1.5px solid var(--color-border);
  transition: all var(--transition);
  backdrop-filter: blur(6px);
  min-height: 70px;
  height: 70px;
}

.site-title {
  color: var(--color-primary);
  font-size: clamp(1.2rem, 4vw, 1.7rem);
  font-weight: 900;
  letter-spacing: 0.5px;
  text-decoration: none;
  transition: all var(--transition);
  padding: 0.2rem 0.7rem;
  border-radius: 0.6rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
  min-width: 0;
}

.site-title:hover {
  background: var(--color-primary);
  color: #fff;
}

/* Menu Hamburguer */
.hamburger-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 38px;
  height: 38px;
  background: none !important;
  border: none !important;
  cursor: pointer;
  z-index: 201;
  margin-left: auto;
  margin-right: 8px;
  flex-shrink: 0;
  padding: 0 !important;
  border-radius: 0 !important;
  font-size: inherit !important;
  position: relative;
  box-shadow: none !important;
}

.hamburger-btn span {
  display: block;
  width: 26px;
  height: 3px;
  background: var(--color-primary);
  margin: 4px 0;
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(.4,0,.2,1);
  opacity: 1;
  visibility: visible;
  position: relative;
}

.hamburger-btn.is-active span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger-btn.is-active span:nth-child(2) {
  opacity: 0;
}

.hamburger-btn.is-active span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-right: 0.8rem; /* Margem para evitar que saia da tela */
}

.mobile-nav {
  position: fixed;
  top: 0;
  right: 0;
  width: 85vw;
  max-width: 340px;
  height: 100vh;
  background: var(--color-card);
  box-shadow: -2px 0 16px #0002;
  z-index: 200;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  padding: 4rem 1.5rem 1.5rem 1.5rem;
  border-left: 1.5px solid var(--color-border);
}

.mobile-nav-content {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-top: 1rem;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.45);
  z-index: 150;
  transition: background 0.3s;
}

.nav-link, 
.profile-btn {
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 1.08rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius);
  transition: all var(--transition);
  width: 100%;
  text-align: left;
}

/* CSS específico para navegação desktop */
.desktop-nav .nav-link,
.desktop-nav .profile-btn {
  width: auto;
  padding: 0.5rem 0.8rem; /* Padding menor para desktop */
  text-align: center;
  white-space: nowrap;
}

.nav-link:hover, 
.profile-btn:hover {
  background: var(--color-primary);
  color: #fff;
}

.admin-menu {
  position: relative;
}

.desktop-nav .admin-menu {
  position: relative;
}

.desktop-nav .admin-btn {
  min-width: 150px;
  justify-content: center;
}

.admin-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-primary);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius);
  transition: all var(--transition);
  width: 100%;
  justify-content: flex-start;
}

.admin-btn:hover {
  background: var(--color-primary-dark);
}

.dropdown-arrow {
  font-size: 0.8em;
  transition: transform var(--transition);
}

.admin-menu.active .dropdown-arrow {
  transform: rotate(180deg);
}

.admin-dropdown {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  margin-top: 0.5rem;
  overflow: hidden;
  z-index: 1000;
}

/* Estilos padrão para dropdown desktop */
.desktop-admin-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 220px;
  background: var(--color-card);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1001;
}

/* Estilos padrão para dropdown mobile */
.mobile-admin-dropdown {
  position: static;
  width: 100%;
  background: var(--color-bg-alt);
  box-shadow: none;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.2rem;
  color: var(--color-text);
  text-decoration: none;
  transition: all var(--transition);
}

.dropdown-item:hover {
  background: var(--color-primary);
  color: white;
}

.item-icon {
  font-size: 1.2em;
  opacity: 0.8;
}

/* Esconde menu desktop em mobile e mostra hamburger */
@media (max-width: 600px) {
  .desktop-nav {
    display: none !important;
  }

  .main-header .hamburger-btn {
    display: flex !important;
    margin-right: 20px !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  
  .main-header .hamburger-btn span {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  
  /* Dropdown mobile mantém posição estática */
  .mobile-admin-dropdown {
    position: static !important;
    width: 100% !important;
    background: var(--color-bg-alt) !important;
    box-shadow: none !important;
    margin-top: 0.5rem;
  }

  .site-title {
    max-width: calc(100% - 60px) !important; /* Reserva espaço para o hamburger */
  }
  
  .main-header .hamburger-btn {
    margin-right: 8px !important;
  }
}

/* Esconde menu desktop em mobile e mostra hamburger */
@media (max-width: 600px) {
  .desktop-nav {
    display: none !important;
  }

  .main-header .hamburger-btn {
    display: flex !important;
    margin-right: 20px !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  
  .main-header .hamburger-btn span {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  
  /* Dropdown mobile mantém posição estática */
  .mobile-admin-dropdown {
    position: static !important;
    width: 100% !important;
    background: var(--color-bg-alt) !important;
    box-shadow: none !important;
    margin-top: 0.5rem;
  }

  .site-title {
    max-width: calc(100% - 60px) !important; /* Reserva espaço para o hamburger */
  }
  
  .main-header .hamburger-btn {
    margin-right: 8px !important;
  }
}

/* Mostra menu desktop e esconde hamburger em telas grandes */
@media (min-width: 601px) {
  .desktop-nav {
    display: flex !important;
  }

  .hamburger-btn {
    display: none !important;
  }
  
  /* Dropdown desktop é absoluto */
  .desktop-admin-dropdown {
    position: absolute !important;
    top: 100% !important;
    left: 0 !important;
    width: 220px !important;
    background: var(--color-card) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
  }
}

/* Ajustes para telas muito pequenas */
@media (max-width: 400px) {
  .site-title {
    font-size: 1rem;
    max-width: calc(100vw - 80px); /* Deixa espaço para o hamburger */
    padding: 0.2rem 0.4rem;
  }

  .main-header {
    padding: 0.6rem 0.5rem;
  }

  .hamburger-btn {
    margin-right: 4px !important;
    width: 32px !important;
    height: 32px !important;
  }
  
  .hamburger-btn span {
    width: 22px !important;
    height: 2.5px !important;
  }

  .mobile-nav {
    width: 100vw;
    max-width: none;
    padding: 3.5rem 0.5rem 1rem 0.5rem;
  }
}

.slide-menu-enter-active, .slide-menu-leave-active {
  transition: transform 0.3s cubic-bezier(.4,0,.2,1), opacity 0.3s cubic-bezier(.4,0,.2,1);
}

.slide-menu-enter-from, .slide-menu-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-menu-enter-to, .slide-menu-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>

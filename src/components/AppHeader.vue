<template>
  <header class="main-header">
    <router-link to="/" class="site-title">Meu Catálogo de Filmes</router-link>
    <nav class="header-nav">
      <router-link v-if="isAdmin" to="/gerenciar-filmes" class="nav-link">Gerenciar</router-link>
      <router-link v-if="!isLogged" to="/login" class="nav-link">Login</router-link>
      <button v-else class="nav-link profile-btn" @click="goToProfile">
        Perfil
      </button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLogged = ref(!!localStorage.getItem('token'));
const isAdmin = ref(false);

function getUserRole() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role) return payload.role === 'ADMIN';
    if (payload.roles && Array.isArray(payload.roles)) return payload.roles.includes('ADMIN');
    return false;
  } catch {
    return false;
  }
}

function goToProfile() {
  router.push('/perfil');
}

function syncAuth() {
  isLogged.value = !!localStorage.getItem('token');
  isAdmin.value = getUserRole();
}

onMounted(() => {
  syncAuth();
});

window.addEventListener('storage', syncAuth);
router.afterEach(() => { syncAuth(); });
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

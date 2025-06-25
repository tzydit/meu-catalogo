<template>
  <header class="main-header">
    <router-link to="/" class="site-title">Meu Catálogo de Filmes</router-link>
    <nav class="header-nav">
      <router-link v-if="!isLogged" to="/login" class="nav-link">Login</router-link>
      <button v-else class="nav-link profile-btn" @click="goToProfile">
        Perfil
      </button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const isLogged = ref(!!localStorage.getItem('token'));

function goToProfile() {
  router.push('/perfil');
}

function syncAuth() {
  isLogged.value = !!localStorage.getItem('token');
}

window.addEventListener('storage', syncAuth);

// Atualiza ao navegar entre rotas
onMounted(() => {
  syncAuth();
});

// Atualiza ao voltar para a rota
router.afterEach(() => {
  syncAuth();
});
</script>

<style scoped>
.main-header {
  width: 100vw;
  background: #181818;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 2.2rem 0.7rem 1.2rem;
  box-shadow: 0 2px 12px #000a;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  border-bottom: 1px solid #232323;
  margin: 0;
}
.site-title {
  color: #fff;
  font-size: 1.7rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 1px;
  transition: color 0.2s;
}
.site-title:hover {
  color: var(--color-primary);
}
.header-nav {
  display: flex;
  align-items: center;
  gap: 1.3rem;
}
.nav-link {
  color: #fff;
  text-decoration: none;
  font-size: 1.08rem;
  padding: 0.5rem 1.3rem;
  border-radius: 8px;
  background: #232323;
  transition: background 0.2s, color 0.2s;
  border: none;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 1px 6px #0007;
}
.nav-link:hover, .profile-btn:hover {
  background: var(--color-bg-alt);
  color: var(--color-primary);
}
.profile-btn {
  font-weight: 700;
  letter-spacing: 0.5px;
}
@media (max-width: 700px) {
  .main-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 0.7rem 1rem;
    gap: 0.7rem;
  }
  .header-nav {
    gap: 0.7rem;
  }
  .site-title {
    font-size: 1.2rem;
  }
}
</style>

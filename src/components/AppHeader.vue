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
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLogged = computed(() => !!localStorage.getItem('token'));

function goToProfile() {
  // Redireciona para uma página de perfil (implemente a rota se desejar)
  router.push('/perfil');
}
</script>

<style scoped>
.main-header {
  width: 100%;
  background: #232323;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px #000a;
  position: sticky;
  top: 0;
  z-index: 10;
}
.site-title {
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 1px;
}
.header-nav {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.nav-link {
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  padding: 0.4rem 1.2rem;
  border-radius: 0.5rem;
  background: #181818;
  transition: background 0.2s;
  border: none;
  cursor: pointer;
}
.nav-link:hover {
  background: #333;
}
.profile-btn {
  font-weight: 600;
}
</style>

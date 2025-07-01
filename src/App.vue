<script setup lang="ts">
import { onMounted } from 'vue';
import { logJwtAndRoles } from './services/jwtHelper';
import AppHeader from './components/AppHeader.vue'

onMounted(() => {
  logJwtAndRoles();
});
</script>

<template>
  <AppHeader />
  <router-view />
</template>

<style>
body {
  margin: 0;
  padding: 0;
}

#app {
  width: 100%;
}

@media (max-width: 400px) {
  #app {
    padding: 0;
    margin: 0;
    max-width: 100%;
  }
}
</style>

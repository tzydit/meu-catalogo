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

<style scoped>
body {
  background: #181818;
  color: #fff;
  font-family: 'Inter', Arial, sans-serif;
}
</style>

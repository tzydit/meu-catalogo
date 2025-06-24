<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
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

<template>
  <div class="centered-container">
    <div class="welcome-box">
      <h1>Bem-vindo</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
// Nenhuma lógica necessária
</script>

<style scoped>
.centered-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #181818;
}
.welcome-box {
  background: #232323;
  padding: 2.5rem 3rem;
  border-radius: 1rem;
  box-shadow: 0 2px 16px #000a;
  text-align: center;
}
h1 {
  color: #fff;
  font-weight: 600;
  font-size: 2.2rem;
}
</style>

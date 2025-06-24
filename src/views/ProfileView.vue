<template>
  <div class="profile-view">
    <h1>Perfil do Usuário</h1>
    <p>Bem-vindo ao seu perfil!</p>
    <button @click="logout">Sair</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  localStorage.removeItem('token')
  window.dispatchEvent(new Event('auth-change'))
  router.push('/login')
}
</script>

<style scoped>
.profile-view {
  max-width: 500px;
  margin: 3.5rem auto 2rem auto;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  background: linear-gradient(120deg, #232526 0%, #414345 100%);
  color: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  text-align: center;
  animation: fadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
h1 {
  font-size: 2.1rem;
  font-weight: 700;
  margin-bottom: 0.7rem;
  letter-spacing: 1px;
}
p {
  font-size: 1.15rem;
  margin-bottom: 2rem;
  opacity: 0.92;
}
button {
  margin-top: 1.5rem;
  padding: 0.7rem 2.2rem;
  background: linear-gradient(90deg, #e74c3c 60%, #ff7675 100%);
  color: #fff;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 1px;
  box-shadow: 0 1px 4px #0002;
  transition: background 0.2s, transform 0.1s;
}
button:hover {
  background: linear-gradient(90deg, #c0392b 60%, #ff7675 100%);
  transform: translateY(-2px) scale(1.03);
}
</style>

<template>
  <div class="centered-container">
    <form @submit.prevent="handleRegister" class="form-box">
      <h2>Cadastro</h2>
      <input v-model="username" type="text" placeholder="Nome de usuário" required />
      <input v-model="password" type="password" placeholder="Senha" required />
      <button type="submit">Cadastrar</button>
      <p v-if="error" class="error-message">{{ error }}</p>
      <router-link to="/login" class="login-link">Já tem conta? Entrar</router-link>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import api from '../api/axios';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const handleRegister = async () => {
  error.value = '';
  try {
    await api.post('/auth/register', {
      username: username.value,
      password: password.value,
    });
    router.push('/login');
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erro ao cadastrar.';
  }
};
</script>

<style scoped>
.centered-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
}
.form-box {
  background: #232323;
  padding: 2rem 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 16px #000a;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 320px;
}
input {
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: none;
  background: #292929;
  color: #fff;
  font-size: 1rem;
}
button {
  background: linear-gradient(90deg, #000 60%, #e74c3c 100%);
  color: #fff;
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
button:hover {
  background: linear-gradient(90deg, #222 60%, #c0392b 100%);
}
.error-message {
  color: #ff4d4f;
  font-size: 0.95rem;
  margin-top: -0.5rem;
  text-align: center;
}
.login-link {
  color: #e74c3c;
  text-align: center;
  margin-top: 0.5rem;
  text-decoration: underline;
  font-size: 0.98rem;
  cursor: pointer;
}
.login-link:hover {
  color: #fff;
}
</style>

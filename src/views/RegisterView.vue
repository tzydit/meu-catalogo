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
  background: var(--color-card);
  color: var(--color-text);
  border-radius: var(--radius);
  box-shadow: var(--color-shadow);
  padding: 2.5rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border: 1.5px solid var(--color-border);
  min-width: 320px;
}
h2 {
  color: var(--color-primary);
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 1.2rem;
  text-align: center;
}
input {
  background: var(--color-bg-alt);
  color: var(--color-text);
  border-radius: 0.7rem;
  border: 1.5px solid var(--color-border);
  font-size: 1rem;
  transition: border 0.2s;
  padding: 0.9rem 1.1rem;
}
input:focus {
  border: 1.5px solid var(--color-primary);
}
button[type='submit'], button {
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 0.7rem;
  padding: 1rem 1.2rem;
  font-size: 1.13rem;
  cursor: pointer;
  font-weight: 800;
  letter-spacing: 1.1px;
  transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
  margin-top: 0.5rem;
  box-shadow: 0 2px 12px #0002;
}
button[type='submit']:hover, button:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 18px #0003;
}
.error-message, .error {
  color: #e74c3c;
  font-weight: 700;
  text-align: center;
  margin-top: 0.5rem;
  font-size: 1.08rem;
}
.success {
  color: #43ea7c;
  font-weight: 700;
  text-align: center;
  margin-top: 0.5rem;
  font-size: 1.08rem;
}
.login-link {
  color: var(--color-primary);
  text-align: center;
  margin-top: 0.5rem;
  text-decoration: underline;
  font-size: 0.98rem;
  cursor: pointer;
  transition: color 0.2s;
}
.login-link:hover {
  color: var(--color-primary-dark);
}
@media (max-width: 600px) {
  .form-box {
    padding: 1.2rem 0.5rem;
    border-radius: 1rem;
    min-width: 0;
  }
}
</style>

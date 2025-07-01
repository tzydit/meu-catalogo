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
  min-height: calc(100vh - 75px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  padding: 1rem;
  padding-top: 100px; /* Maior espaço para não sobrepor o header */
  box-sizing: border-box;
}

.form-box {
  background: var(--color-card);
  color: var(--color-text);
  border-radius: var(--radius);
  box-shadow: var(--color-shadow);
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border: 1.5px solid var(--color-border);
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
}

h2 {
  color: var(--color-primary);
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 1.2rem;
  text-align: center;
}

input {
  width: 100%;
  background: var(--color-bg-alt);
  color: var(--color-text);
  border-radius: 0.7rem;
  border: 1.5px solid var(--color-border);
  font-size: 1rem;
  transition: all 0.2s;
  padding: 0.9rem 1.1rem;
  box-sizing: border-box;
}

input:focus {
  border: 1.5px solid var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

button[type='submit'], button {
  width: 100%;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 0.7rem;
  padding: 1rem 1.2rem;
  font-size: 1.1rem;
  cursor: pointer;
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: all 0.3s;
  margin-top: 0.5rem;
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.2);
}

button[type='submit']:hover:not(:disabled), 
button:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 18px rgba(99, 102, 241, 0.3);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message, .error {
  color: var(--color-danger);
  font-weight: 600;
  text-align: center;
  margin-top: 0.5rem;
  font-size: 1rem;
}

.success {
  color: #43ea7c;
  font-weight: 600;
  text-align: center;
  margin-top: 0.5rem;
  font-size: 1rem;
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

/* Tablets e telas médias */
@media (max-width: 768px) {
  .centered-container {
    min-height: calc(100vh - 72px);
    padding: 0.8rem;
    padding-top: 95px;
  }

  .form-box {
    max-width: 450px;
    padding: 2rem 1.5rem;
  }

  h2 {
    font-size: 1.4rem;
  }
}

/* Smartphones */
@media (max-width: 600px) {
  .centered-container {
    min-height: calc(100vh - 70px);
    padding: 0.5rem;
    padding-top: 90px;
  }

  .form-box {
    padding: 1.8rem 1.2rem;
    gap: 1.2rem;
    border-radius: 0.8rem;
  }

  h2 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  input {
    padding: 0.8rem 1rem;
    font-size: 1rem;
  }

  button {
    padding: 0.9rem 1rem;
    font-size: 1rem;
  }
}

/* Telas muito pequenas */
@media (max-width: 400px) {
  .centered-container {
    padding: 0.2rem;
    padding-top: 85px;
    align-items: flex-start;
  }

  .form-box {
    padding: 1.5rem 1rem;
    border-radius: 0.5rem;
    gap: 1rem;
    box-shadow: 0 1px 8px rgba(0,0,0,0.1);
  }

  h2 {
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
  }

  input, button {
    font-size: 16px; /* Evita zoom em iOS */
    padding: 0.8rem;
  }

  .error-message, .success {
    font-size: 0.9rem;
  }

  .login-link {
    font-size: 0.9rem;
  }
}

/* Ajustes para altura muito pequena (paisagem) */
@media (max-height: 500px) {
  .centered-container {
    align-items: flex-start;
    padding-top: 1rem;
    min-height: auto;
  }

  .form-box {
    min-height: auto;
    gap: 0.8rem;
    padding: 1.2rem;
  }

  h2 {
    margin-bottom: 0.5rem;
  }
}
</style>

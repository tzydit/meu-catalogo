<template>
  <div class="create-movie-page">
    <div class="form-container">
      <h1>Criar Novo Filme</h1>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">Título</label>
          <input v-model="title" id="title" type="text" required />
        </div>
        <div class="form-group">
          <label for="description">Descrição</label>
          <textarea v-model="description" id="description" required></textarea>
        </div>
        <div class="form-group">
          <label for="imageUrl">URL da Imagem</label>
          <input v-model="imageUrl" id="imageUrl" type="url" required />
        </div>
        <div class="form-group">
          <label for="year">Ano</label>
          <input v-model.number="year" id="year" type="number" min="1900" max="2100" required />
        </div>
        <div class="form-group">
          <label for="gender">Gênero</label>
          <input v-model="gender" id="gender" type="text" required />
        </div>
        <button type="submit">Criar Filme</button>
        <p v-if="success" class="success">Filme criado com sucesso!</p>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'

const title = ref('')
const description = ref('')
const imageUrl = ref('')
const year = ref(new Date().getFullYear())
const gender = ref('')
const success = ref(false)
const error = ref('')
const router = useRouter()

async function handleSubmit() {
  error.value = ''
  success.value = false
  try {
    await api.post('/filmes', {
      titulo: title.value,
      descricao: description.value,
      imagem: imageUrl.value,
      ano: year.value,
      genero: gender.value
    })
    success.value = true
    setTimeout(() => router.push('/'), 1200)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erro ao criar filme.'
  }
}
</script>

<style scoped>
.create-movie-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #232526 0%, #414345 100%);
}
.form-container {
  background: rgba(34, 34, 34, 0.98);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
h1 {
  color: #fff;
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 700;
  letter-spacing: 1px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
label {
  color: #e74c3c;
  font-weight: 600;
  font-size: 1rem;
}
input, textarea {
  padding: 0.8rem 1rem;
  border-radius: 0.75rem;
  border: none;
  background: #292929;
  color: #fff;
  font-size: 1rem;
  transition: box-shadow 0.2s;
  box-shadow: 0 1px 4px #0002;
}
input:focus, textarea:focus {
  outline: none;
  box-shadow: 0 0 0 2px #e74c3c55;
}
button {
  background: linear-gradient(90deg, #e74c3c 60%, #ff7675 100%);
  color: #fff;
  border: none;
  border-radius: 0.75rem;
  padding: 0.9rem 1.2rem;
  font-size: 1.1rem;
  cursor: pointer;
  font-weight: 700;
  letter-spacing: 1px;
  transition: background 0.2s, transform 0.1s;
  margin-top: 0.5rem;
}
button:hover {
  background: linear-gradient(90deg, #c0392b 60%, #ff7675 100%);
  transform: translateY(-2px) scale(1.03);
}
.success {
  color: #2ecc40;
  font-weight: 600;
  text-align: center;
}
.error {
  color: #ff4d4f;
  font-weight: 600;
  text-align: center;
}
</style>

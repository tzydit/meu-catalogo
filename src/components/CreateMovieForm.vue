<template>
  <form class="create-movie-form" @submit.prevent="handleSubmit">
    <h3>Criar novo filme</h3>
    <input v-model="title" type="text" placeholder="Título do filme" required />
    <input v-model="genre" type="text" placeholder="Gênero" required />
    <textarea v-model="description" placeholder="Descrição" required></textarea>
    <button type="submit">Criar Filme</button>
    <p v-if="success" class="success">Filme criado com sucesso!</p>
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '../api/axios'

const title = ref('')
const genre = ref('')
const description = ref('')
const success = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''
  success.value = false
  try {
    await api.post('/filmes', {
      titulo: title.value,
      genero: genre.value,
      descricao: description.value
    })
    title.value = ''
    genre.value = ''
    description.value = ''
    success.value = true
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erro ao criar filme.'
  }
}
</script>

<style scoped>
.create-movie-form {
  background: #232323;
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px #000a;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}
input, textarea {
  padding: 0.7rem 1rem;
  border-radius: 0.75rem;
  border: none;
  background: #292929;
  color: #fff;
  font-size: 1rem;
}
button {
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 0.75rem;
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}
button:hover {
  background: #c0392b;
}
.success {
  color: #2ecc40;
  font-weight: 600;
}
.error {
  color: #ff4d4f;
  font-weight: 600;
}
</style>

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
    await api.post('/movies', {
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
  align-items: flex-start;
  justify-content: center;
  background: linear-gradient(120deg, #181818 0%, #232526 100%);
  padding-top: 80px;
}
.form-container {
  background: #181818;
  padding: 2.2rem 2rem 2rem 2rem;
  border-radius: 1.3rem;
  box-shadow: 0 2px 12px #000a;
  width: 100%;
  max-width: 430px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border: 1.5px solid #232323;
}
h1 {
  color: #fff;
  font-size: 2.1rem;
  margin-bottom: 1.2rem;
  text-align: center;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-shadow: none;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
label {
  color: #e53935;
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: 0.5px;
}
input, textarea {
  padding: 1rem 1.1rem;
  border-radius: 0.9rem;
  border: none;
  background: #232323;
  color: #fff;
  font-size: 1.08rem;
  transition: box-shadow 0.2s, border 0.2s;
  box-shadow: 0 1.5px 6px #0003;
  border: 1.5px solid #232323;
}
input:focus, textarea:focus {
  outline: none;
  box-shadow: 0 0 0 2px #e5393555;
  border: 1.5px solid #e53935;
}
button {
  background: linear-gradient(90deg, #e53935 60%, #ff7675 100%);
  color: #fff;
  border: none;
  border-radius: 0.9rem;
  padding: 1rem 1.2rem;
  font-size: 1.13rem;
  cursor: pointer;
  font-weight: 800;
  letter-spacing: 1.1px;
  transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
  margin-top: 0.5rem;
  box-shadow: 0 2px 12px #0006;
}
button:hover {
  background: linear-gradient(90deg, #c62828 60%, #ff7675 100%);
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 18px #000a;
}
.success {
  color: #43ea7c;
  font-weight: 700;
  text-align: center;
  margin-top: 0.5rem;
  font-size: 1.08rem;
}
.error {
  color: #ff4d4f;
  font-weight: 700;
  text-align: center;
  margin-top: 0.5rem;
  font-size: 1.08rem;
}
@media (max-width: 600px) {
  .form-container {
    padding: 1.2rem 0.5rem;
    border-radius: 1rem;
  }
  h1 {
    font-size: 1.3rem;
  }
  .create-movie-page {
    padding-top: 70px;
  }
}
</style>

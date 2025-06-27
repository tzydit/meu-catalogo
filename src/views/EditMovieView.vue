<template>
  <div class="edit-movie-container">
    <h1>Editar Filme</h1>
    <form @submit.prevent="handleEdit" class="edit-form" v-if="loaded">
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
      <button type="submit">Salvar Alterações</button>
      <p v-if="success" class="success">Filme atualizado com sucesso!</p>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
    <div v-else class="loading">Carregando dados do filme...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../api/axios';

const route = useRoute();
const router = useRouter();
const loaded = ref(false);
const title = ref('');
const description = ref('');
const imageUrl = ref('');
const year = ref(new Date().getFullYear());
const gender = ref('');
const success = ref(false);
const error = ref('');

async function fetchMovie() {
  try {
    const { data } = await api.get(`/movies/${route.params.id}`);
    title.value = data.title;
    description.value = data.description;
    imageUrl.value = data.imageUrl;
    year.value = data.year;
    gender.value = data.gender;
    loaded.value = true;
  } catch {
    error.value = 'Erro ao carregar filme.';
  }
}

async function handleEdit() {
  error.value = '';
  success.value = false;
  try {
    await api.put(`/movies/${route.params.id}`, {
      title: title.value,
      description: description.value,
      imageUrl: imageUrl.value,
      year: year.value,
      gender: gender.value
    });
    success.value = true;
    setTimeout(() => router.push('/gerenciar-filmes'), 1200);
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Erro ao atualizar filme.';
  }
}

onMounted(fetchMovie);
</script>

<style scoped>
.edit-movie-container {
  max-width: 500px;
  margin: 6.5rem auto 2rem auto;
  background: var(--color-card);
  border-radius: 1.1rem;
  box-shadow: var(--color-shadow);
  padding: 2.5rem 2rem 2rem 2rem;
  border: 1.5px solid var(--color-border);
}
h1 {
  color: var(--color-primary);
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 1.2rem;
  text-align: center;
}
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
label {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 1rem;
}
input, textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 0.9rem 1.1rem;
  border-radius: 0.7rem;
  border: 1.5px solid var(--color-border);
  background: var(--color-bg-alt);
  color: var(--color-text);
  font-size: 1rem;
  transition: border 0.2s;
  resize: none;
}
input:focus, textarea:focus {
  border: 1.5px solid var(--color-primary);
}
button[type='submit'] {
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
button[type='submit']:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 18px #0003;
}
.success {
  color: #43ea7c;
  font-weight: 700;
  text-align: center;
  margin-top: 0.5rem;
  font-size: 1.08rem;
}
.error {
  color: #e74c3c;
  font-weight: 700;
  text-align: center;
  margin-top: 0.5rem;
  font-size: 1.08rem;
}
.loading {
  color: var(--color-primary);
  text-align: center;
  margin-top: 2rem;
}
</style>

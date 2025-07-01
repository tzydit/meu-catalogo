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
          <label>Gêneros (máx. 3)</label>
          <div class="genre-checkboxes">
            <label v-for="genre in genres" :key="genre" class="genre-option">
              <input type="checkbox" :value="genre" v-model="selectedGenres" :disabled="selectedGenres.length >= 3 && !selectedGenres.includes(genre)" />
              {{ genre }}
            </label>
          </div>
        </div>
        <div class="form-group">
          <label for="trailerUrl">URL do Trailer (YouTube)</label>
          <input v-model="trailerUrl" id="trailerUrl" type="url" placeholder="https://youtube.com/watch?v=..." />
        </div>
        <button type="submit">Criar Filme</button>
        <p v-if="success" class="success">Filme criado com sucesso!</p>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'
import { isAdmin } from '../services/jwtHelper.ts'
import type { MovieFormData } from '../types'

const title = ref('')
const description = ref('')
const imageUrl = ref('')
const year = ref(new Date().getFullYear())
const genres = ref<string[]>([])
const selectedGenres = ref<string[]>([])
const trailerUrl = ref('')
const success = ref(false)
const error = ref('')
const router = useRouter()

async function fetchGenres() {
  try {
    const { data } = await api.get('/generos')
    genres.value = Array.isArray(data)
      ? data.map(g => typeof g === 'string' ? g : g.nome || g.name || g)
      : []
  } catch {
    genres.value = []
  }
}

const currentYear = new Date().getFullYear();

const isFormValid = computed(() => {
  return (
    title.value.length >= 2 &&
    title.value.length <= 100 &&
    description.value.length >= 10 &&
    description.value.length <= 1000 &&
    imageUrl.value.match(/^https?:\/\/.*/) &&
    year.value >= 1900 &&
    year.value <= currentYear &&
    selectedGenres.value.length > 0 &&
    selectedGenres.value.length <= 3 &&
    (!trailerUrl.value || trailerUrl.value.match(/^https?:\/\/(www\.)?youtube\.com\/.*|https?:\/\/youtu\.be\/.*/))
  );
});

async function handleSubmit() {
  error.value = '';
  success.value = false;

  // Validações específicas
  if (selectedGenres.value.length === 0) {
    error.value = 'Selecione pelo menos um gênero.';
    return;
  }

  if (selectedGenres.value.length > 3) {
    error.value = 'Selecione no máximo 3 gêneros.';
    return;
  }

  if (year.value > currentYear) {
    error.value = `O ano não pode ser maior que ${currentYear}.`;
    return;
  }

  try {
    const movieData = {
      title: title.value.trim(),
      description: description.value.trim(),
      imageUrl: imageUrl.value.trim(),
      year: year.value,
      gender: selectedGenres.value
    };

    if (trailerUrl.value) {
      movieData.trailerUrl = trailerUrl.value.trim();
    }

    const response = await api.post('/movies', movieData);
    
    if (response.status === 201 || response.status === 200) {
      success.value = true;
      setTimeout(() => router.push('/'), 1200);
    }
  } catch (err: any) {
    console.error('Erro ao criar filme:', err);
    error.value = err.response?.data?.message || 'Erro ao criar filme.';
  }
}

onMounted(async () => {
  if (!isAdmin()) {
    router.push('/');
    return;
  }
  await fetchGenres();
})
</script>

<style scoped>
.create-movie-page {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: var(--color-bg);
  padding-top: 90px;
}
.form-container {
  background: var(--color-card);
  padding: 2.5rem 2rem 2rem 2rem;
  border-radius: 1.1rem;
  box-shadow: var(--color-shadow);
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border: 1.5px solid var(--color-border);
}
h1 {
  color: var(--color-primary);
  font-size: 1.5rem;
  margin-bottom: 1.2rem;
  text-align: center;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-shadow: none;
}
form {
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
  font-size: 1.08rem;
  transition: box-shadow 0.2s, border 0.2s;
  box-shadow: 0 1.5px 6px #0003;
  resize: none;
}
input:focus, textarea:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-primary-light);
  border: 1.5px solid var(--color-primary);
}
button {
  background: linear-gradient(90deg, var(--color-primary) 60%, var(--color-primary-light) 100%);
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
  color: #ff4d4f;
  font-weight: 700;
  text-align: center;
  margin-top: 0.5rem;
  font-size: 1.08rem;
}
.genre-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.3rem;
  margin-bottom: 0.2rem;
}
.genre-option {
  background: var(--color-bg-alt);
  color: var(--color-text);
  border-radius: 0.75rem;
  padding: 0.4rem 1.1rem 0.4rem 0.7rem;
  font-size: 1rem;
  cursor: pointer;
  user-select: none;
  border: 1.5px solid var(--color-border);
  display: flex;
  align-items: center;
  transition: background 0.2s, border 0.2s;
}
.genre-option input[type="checkbox"] {
  accent-color: var(--color-primary);
  margin-right: 0.5em;
  width: 1.1em;
  height: 1.1em;
}
.genre-option:has(input[type="checkbox"]:checked) {
  background: var(--color-primary);
  color: #fff;
  border: 1.5px solid var(--color-primary-dark);
}
@media (max-width: 600px) {
  .form-container {
    padding: 1.2rem 0.5rem;
    border-radius: 1rem;
    max-width: 98vw;
  }
  h1 {
    font-size: 1.15rem;
  }
  .create-movie-page {
    padding-top: 70px;
  }
  .genre-checkboxes {
    gap: 0.3rem;
    justify-content: flex-start;
  }
  .genre-option {
    font-size: 0.95rem;
    padding: 0.3rem 0.7rem 0.3rem 0.5rem;
  }
}
</style>

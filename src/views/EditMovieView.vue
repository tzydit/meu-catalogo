<template>
  <div class="create-movie-page">
    <div class="form-container">
      <h1>Editar Filme</h1>
      <form @submit.prevent="handleEdit" v-if="loaded">
        <div class="form-group">
          <label for="title">Título</label>
          <input 
            v-model="title" 
            id="title" 
            type="text" 
            required 
            minlength="2"
            maxlength="100"
          />
          <small class="field-hint">Entre 2 e 100 caracteres</small>
        </div>
        
        <div class="form-group">
          <label for="description">Descrição</label>
          <textarea 
            v-model="description" 
            id="description" 
            required
            minlength="10"
            maxlength="1000"
            rows="4"
          ></textarea>
          <small class="field-hint">Entre 10 e 1000 caracteres</small>
        </div>
        
        <div class="form-group">
          <label for="imageUrl">URL da Imagem</label>
          <input 
            v-model="imageUrl" 
            id="imageUrl" 
            type="url" 
            required 
            pattern="https?://.*"
            placeholder="https://exemplo.com/imagem.jpg"
          />
          <small class="field-hint">URL válida começando com http:// ou https://</small>
        </div>
        
        <div class="form-group">
          <label for="year">Ano</label>
          <input 
            v-model.number="year" 
            id="year" 
            type="number" 
            :min="1900" 
            :max="currentYear"
            required 
          />
          <small class="field-hint">Entre 1900 e {{ currentYear }}</small>
        </div>
        
        <div class="form-group">
          <label>Gêneros (máx. 3)</label>
          <div class="genre-checkboxes">
            <label v-for="genre in genres" :key="genre" class="genre-option">
              <input 
                type="checkbox" 
                :value="genre" 
                v-model="selectedGenres"
                :disabled="selectedGenres.length >= 3 && !selectedGenres.includes(genre)"
              />
              {{ genre }}
            </label>
          </div>
          <small class="field-hint">Selecione de 1 a 3 gêneros</small>
        </div>
        
        <div class="form-group">
          <label for="trailerUrl">URL do Trailer (YouTube)</label>
          <input 
            v-model="trailerUrl" 
            id="trailerUrl" 
            type="url" 
            pattern="https?://(www\.)?youtube\.com/.*|https?://youtu\.be/.*"
            placeholder="https://youtube.com/watch?v=..."
          />
          <small class="field-hint">URL válida do YouTube (opcional)</small>
        </div>
        
        <button type="submit" :disabled="!isFormValid">Salvar Alterações</button>
        <p v-if="success" class="success">Filme atualizado com sucesso!</p>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
      <div v-else class="loading">
        <div class="loading-spinner"></div>
        <p>Carregando dados do filme...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../api/axios';
import { isAdmin } from '../services/jwtHelper.ts';
import type { Movie, MovieFormData } from '../types';

const route = useRoute();
const router = useRouter();
const loaded = ref(false);
const title = ref('');
const description = ref('');
const imageUrl = ref('');
const year = ref(new Date().getFullYear());
const genres = ref<string[]>([]);
const selectedGenres = ref<string[]>([]);
const trailerUrl = ref('');
const success = ref(false);
const error = ref('');

const currentYear = new Date().getFullYear();

// Validações computadas
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

async function fetchGenres() {
  try {
    const { data } = await api.get('/generos');
    genres.value = Array.isArray(data)
      ? data.map(g => typeof g === 'string' ? g : g.nome || g.name || g)
      : [];
  } catch (e) {
    console.error('Erro ao carregar gêneros:', e);
    genres.value = [];
  }
}

async function fetchMovie() {
  try {
    const { data } = await api.get(`/movies/${route.params.id}`);
    
    // Carrega dados básicos
    title.value = data.title || '';
    description.value = data.description || '';
    imageUrl.value = data.imageUrl || '';
    year.value = data.year || new Date().getFullYear();
    trailerUrl.value = data.trailerUrl || '';
    
    // Processa gêneros
    if (Array.isArray(data.gender)) {
      selectedGenres.value = data.gender;
    } else if (typeof data.gender === 'string') {
      selectedGenres.value = [data.gender];
    } else {
      selectedGenres.value = [];
    }
    
    loaded.value = true;
  } catch (e) {
    console.error('Erro ao carregar filme:', e);
    error.value = 'Erro ao carregar filme.';
  }
}

async function handleEdit() {
  error.value = '';
  success.value = false;
  
  // Validações
  if (selectedGenres.value.length === 0) {
    error.value = 'Selecione pelo menos um gênero.';
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

    const response = await api.put(`/movies/${route.params.id}`, movieData);
    
    if (response.status === 200) {
      success.value = true;
      setTimeout(() => router.push('/gerenciar-filmes'), 1200);
    }
  } catch (e: any) {
    console.error('Erro ao atualizar:', e);
    error.value = e.response?.data?.message || 'Erro ao atualizar filme.';
  }
}

onMounted(async () => {
  if (!isAdmin()) {
    router.push('/');
    return;
  }
  await fetchGenres();
  await fetchMovie();
});
</script>

<style scoped>
.create-movie-page {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;
  background: var(--color-bg);
}

.form-container {
  width: 100%;
  max-width: 600px;
  margin: 4.5rem auto 2rem;
  padding: 2rem;
  background: var(--color-card);
  border-radius: 1.2rem;
  box-shadow: var(--color-shadow);
  border: 1.5px solid var(--color-border);
}

h1 {
  color: var(--color-primary);
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 2rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--color-text);
}

input, textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1.5px solid var(--color-border);
  border-radius: 0.8rem;
  background: var(--color-bg-alt);
  color: var(--color-text);
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus, textarea:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 2px var(--color-primary-light);
}

.field-hint {
  display: block;
  margin-top: 0.4rem;
  font-size: 0.85rem;
  color: var(--color-text-light);
}

.genre-checkboxes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.8rem;
  margin-top: 0.5rem;
}

.genre-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
  cursor: pointer;
}

.genre-option input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.genre-option input[type="checkbox"]:disabled + span {
  color: var(--color-text-light);
}

button[type="submit"] {
  width: 100%;
  padding: 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0.8rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

button[type="submit"]:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

button[type="submit"]:disabled {
  background: var(--color-border);
  cursor: not-allowed;
  opacity: 0.7;
}

.success {
  color: #2ecc71;
  text-align: center;
  margin-top: 1rem;
  font-weight: 600;
}

.error {
  color: #e74c3c;
  text-align: center;
  margin-top: 1rem;
  font-weight: 600;
}

.loading {
  text-align: center;
  padding: 2rem;
}

.loading-spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid var(--color-border);
  border-radius: 50%;
  border-top-color: var(--color-primary);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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

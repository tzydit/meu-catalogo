<template>
  <div class="manage-container">
    <h1>Gerenciamento de Filmes</h1>
    <router-link to="/criar-filme" class="create-btn">+ Novo Filme</router-link>
    <div v-if="loading" class="loading">Carregando filmes...</div>
    <div v-else>
      <table class="movies-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Ano</th>
            <th>Gênero</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="movie in movies" :key="movie.id">
            <td>{{ movie.title }}</td>
            <td>{{ movie.year }}</td>
            <td>{{ movie.gender }}</td>
            <td>
              <router-link :to="`/editar-filme/${movie.id}`" class="edit-btn">Editar</router-link>
              <button class="delete-btn" @click="deleteMovie(movie.id)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api/axios';
import { useRouter } from 'vue-router';

const movies = ref<any[]>([]);
const loading = ref(true);
const error = ref('');
const router = useRouter();

async function fetchMovies() {
  loading.value = true;
  try {
    const { data } = await api.get('/movies');
    movies.value = data.map((m: any) => ({ ...m, id: m.id || m._id }));
    error.value = '';
  } catch (e: any) {
    error.value = 'Erro ao carregar filmes.';
  } finally {
    loading.value = false;
  }
}

async function deleteMovie(id: string) {
  if (!confirm('Tem certeza que deseja excluir este filme?')) return;
  try {
    await api.delete(`/movies/${id}`);
    movies.value = movies.value.filter(m => m.id !== id);
  } catch {
    error.value = 'Erro ao excluir filme.';
  }
}

onMounted(fetchMovies);
</script>

<style scoped>
.manage-container {
  max-width: 900px;
  margin: 0 auto;
  margin-top: 90px;
  padding: 2rem 1rem;
  background: var(--color-card);
  border-radius: 1.2rem;
  box-shadow: var(--color-shadow);
}
h1 {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}
.create-btn {
  display: inline-block;
  background: var(--color-primary);
  color: #fff;
  font-weight: 600;
  border-radius: 0.7rem;
  padding: 0.6rem 1.3rem;
  text-decoration: none;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  transition: background 0.2s, transform 0.1s;
  border: none;
  box-shadow: 0 1.5px 6px #0001;
}
.create-btn:hover {
  background: #1d4ed8;
}
.movies-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.movies-table th, .movies-table td {
  padding: 0.8rem 0.5rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}
.movies-table th {
  color: var(--color-primary);
  font-weight: 700;
  font-size: 1.05rem;
}
.edit-btn {
  color: var(--color-primary);
  margin-right: 1rem;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}
.delete-btn {
  color: #e74c3c;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: color 0.2s;
}
.delete-btn:hover {
  color: #b91c1c;
}
.loading {
  color: var(--color-primary);
  text-align: center;
  margin-top: 2rem;
}
.error {
  color: #e74c3c;
  text-align: center;
  margin-top: 1rem;
}
</style>

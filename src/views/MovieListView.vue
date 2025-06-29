<template>
  <div class="main-container">
    <section class="about-section">
      <h2>Como funciona o Meu Catálogo de Filmes?</h2>
      <ul>
        <li>Pesquise filmes por título ou gênero.</li>
        <li>Adicione filmes aos seus favoritos para acessar rapidamente depois.</li>
        <li>Veja detalhes, avaliações e escreva suas próprias reviews.</li>
        <li v-if="isAdmin">Crie novos filmes para compartilhar com a comunidade!</li>
      </ul>
      <router-link v-if="isAdmin" to="/criar-filme" class="create-movie-link">+ Criar novo filme</router-link>
    </section>
    <div class="top-bar">
      <input v-model="search" @input="fetchMovies" placeholder="Pesquisar por título..." class="search-input" />
      <GenreFilter :genres="genres" v-model="selectedGenres" @update:selectedGenres="fetchMovies" />
      <router-link to="/favoritos" class="fav-link">Favoritos ♥</router-link>
    </div>
    <div class="movies-grid">
      <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" :favorite="isFavorite(movie.id)" @toggle-favorite="toggleFavorite" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import api from '../api/axios';
import MovieCard from '../components/MovieCard.vue';
import GenreFilter from '../components/GenreFilter.vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

function getUserRole() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || (payload.roles ? payload.roles[0] : null);
  } catch {
    return null;
  }
}

const isAdmin = computed(() => getUserRole() === 'ADMIN');

const movies = ref([])
const genres = ref([])
const selectedGenres = ref([])
const search = ref('')
const favorites = ref<number[]>(JSON.parse(localStorage.getItem('favorites') || '[]'))
const router = useRouter()
const generos = ref([]);

function isFavorite(id: number) {
  return favorites.value.includes(id)
}
function toggleFavorite(movie: any) {
  const idx = favorites.value.indexOf(movie.id)
  if (idx === -1) favorites.value.push(movie.id)
  else favorites.value.splice(idx, 1)
  localStorage.setItem('favorites', JSON.stringify(favorites.value))
}
async function fetchMovies() {
  let url = '/movies?';
  if (search.value) url += `title=${encodeURIComponent(search.value)}&`;
  if (selectedGenres.value.length) url += `gender=${selectedGenres.value.join(',')}`;
  const { data } = await api.get(url);
  // Garante que cada filme tenha o campo 'id' (compatível com MongoDB)
  movies.value = data.map((movie: any) => ({
    ...movie,
    id: movie.id || movie._id
  }));
}

async function fetchGenres() {
  const { data } = await api.get('/generos');
  genres.value = data;
}

async function fetchGeneros() {
  try {
    const response = await axios.get('http://localhost:8080/generos');
    generos.value = response.data;
    console.log('Gêneros recebidos:', generos.value);
    return generos.value;
  } catch (error) {
    console.error('Erro ao buscar gêneros:', error);
    return [];
  }
}

onMounted(() => {
  fetchGenres()
  fetchMovies()
  fetchGeneros()
})
watch(selectedGenres, fetchMovies)
</script>

<style scoped>
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4.5rem 1rem 2rem 1rem; /* padding-top maior para não cortar atrás do header */
}
.about-section {
  background: var(--color-card);
  color: var(--color-text);
  border-radius: var(--radius);
  box-shadow: var(--color-shadow);
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  margin-bottom: 2.5rem;
  text-align: center;
  border: 1.5px solid var(--color-border);
}
.about-section h2 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  letter-spacing: 0.5px;
}
.about-section ul {
  list-style: none;
  padding: 0;
  margin-bottom: 1.2rem;
}
.about-section li {
  font-size: 1.08rem;
  margin-bottom: 0.5rem;
  opacity: 0.92;
}
.create-movie-link {
  display: inline-block;
  background: var(--color-primary);
  color: #fff;
  font-weight: 700;
  border-radius: 0.7rem;
  padding: 0.7rem 1.5rem;
  text-decoration: none;
  font-size: 1.1rem;
  margin-top: 1rem;
  transition: background var(--transition), transform 0.1s;
  border: none;
  box-shadow: 0 1.5px 6px #0001;
}
.create-movie-link:hover {
  background: var(--color-primary-dark);
  color: #fff;
  transform: translateY(-2px) scale(1.03);
}
.top-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
  background: var(--color-bg-alt);
  border-radius: 0.9rem;
  padding: 1.1rem 1.5rem;
  box-shadow: 0 2px 12px #0001;
  transition: background var(--transition);
  backdrop-filter: blur(2px);
}
.search-input {
  flex: 1;
  min-width: 220px;
  padding: 0.7rem 1rem;
  border-radius: 0.7rem;
  border: 1.5px solid var(--color-border);
  background: var(--color-bg-alt);
  color: var(--color-text);
  font-size: 1rem;
  transition: border var(--transition);
}
.search-input:focus {
  border: 1.5px solid var(--color-primary);
}
.fav-link {
  color: var(--color-primary);
  background: var(--color-bg-alt);
  border-radius: 0.7rem;
  padding: 0.6rem 1.2rem;
  text-decoration: none;
  font-weight: 600;
  transition: background var(--transition), color var(--transition);
  border: 1.5px solid var(--color-border);
}
.fav-link:hover {
  background: var(--color-card);
  color: var(--color-primary-dark);
}
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}
@media (max-width: 700px) {
  .about-section {
    padding: 1.2rem 0.5rem 1rem 0.5rem;
    border-radius: 1rem;
  }
  .main-container {
    padding: 1rem 0.2rem;
  }
  .top-bar {
    padding: 0.7rem 0.5rem;
    border-radius: 0.5rem;
  }
}
</style>

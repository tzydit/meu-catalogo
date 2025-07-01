<template>
  <div class="main-container">
    <h1>Meus Favoritos</h1>
    <div class="movies-grid">
      <MovieCard v-for="movie in favoriteMovies" :key="movie.id" :movie="movie" :favorite="true" @toggle-favorite="toggleFavorite" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api/axios';
import MovieCard from '../components/MovieCard_new.vue';

const favoriteIds = ref<number[]>(JSON.parse(localStorage.getItem('favorites') || '[]'))
const favoriteMovies = ref<any[]>([])

async function fetchFavorites() {
  if (!favoriteIds.value.length) {
    favoriteMovies.value = []
    return
  }
  const { data } = await api.get('/movies')
  favoriteMovies.value = data.filter((m: any) => favoriteIds.value.includes(m.id))
}
function toggleFavorite(movie: any) {
  const idx = favoriteIds.value.indexOf(movie.id)
  if (idx === -1) favoriteIds.value.push(movie.id)
  else favoriteIds.value.splice(idx, 1)
  localStorage.setItem('favorites', JSON.stringify(favoriteIds.value))
  fetchFavorites()
}
onMounted(fetchFavorites)
</script>

<style scoped>
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  padding-top: 90px; /* Espaço para o header fixo */
  width: 100%;
  box-sizing: border-box;
}
@media (max-width: 900px) {
  .main-container {
    padding: 1.2rem 0.5rem;
    padding-top: 85px;
  }
}
@media (max-width: 700px) {
  .main-container {
    padding: 0.7rem 0.2rem;
    padding-top: 80px;
  }
}
@media (max-width: 400px) {
  .main-container {
    padding: 0;
    padding-top: 75px;
    max-width: 100vw;
  }
}
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.2rem;
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
}

/* Limita o tamanho máximo dos cards */
.movies-grid > * {
  max-width: 280px;
  justify-self: center;
}

@media (min-width: 1200px) {
  .movies-grid {
    grid-template-columns: repeat(4, 1fr);
    max-width: 1200px;
  }
  .movies-grid > * {
    max-width: none;
  }
}

@media (max-width: 700px) {
  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 0.8rem;
  }
  .movies-grid > * {
    max-width: 200px;
  }
}

@media (max-width: 500px) {
  .movies-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 0.5rem;
  }
  .movies-grid > * {
    max-width: none;
  }
}

@media (max-width: 400px) {
  .movies-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 0.3rem;
    padding: 0;
  }
  .movies-grid > * {
    max-width: none;
  }
}
h1 {
  color: var(--color-text);
  margin-bottom: 2rem;
  font-size: clamp(1.2rem, 4vw, 2rem);
  text-align: center;
}
</style>

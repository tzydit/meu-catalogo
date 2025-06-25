<template>
  <div class="detail-container" v-if="movie">
    <div class="detail-header">
      <img :src="movie.imagemUrl" :alt="movie.titulo" class="detail-img" />
      <div class="detail-info">
        <h1>{{ movie.titulo }}</h1>
        <div class="meta">
          <span class="year">{{ movie.ano }}</span>
          <span class="genres">{{ movie.generos?.join(', ') }}</span>
          <span class="rating">⭐ {{ movie.notaMedia?.toFixed(1) }}</span>
          <button class="fav-btn" @click="toggleFavorite(movie)">
            <span :class="isFavorite(movie.id) ? 'heart filled' : 'heart'">♥</span>
          </button>
        </div>
        <p class="synopsis">{{ movie.sinopse }}</p>
      </div>
    </div>
    <div class="reviews-section">
      <h2>Avaliações</h2>
      <ReviewForm @submit="submitReview" />
      <MovieReview v-for="review in movie.avaliacoes" :key="review.id" :review="review" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api/axios';
import MovieReview from '../components/MovieReview.vue';
import ReviewForm from '../components/ReviewForm.vue';

const route = useRoute()
const movie = ref<any>(null)
const favorites = ref<number[]>(JSON.parse(localStorage.getItem('favorites') || '[]'))

function isFavorite(id: number) {
  return favorites.value.includes(id)
}
function toggleFavorite(movie: any) {
  const idx = favorites.value.indexOf(movie.id)
  if (idx === -1) favorites.value.push(movie.id)
  else favorites.value.splice(idx, 1)
  localStorage.setItem('favorites', JSON.stringify(favorites.value))
}
async function fetchMovie() {
  const { data } = await api.get(`/movies/${route.params.id}`)
  movie.value = data
}
async function submitReview(review: any) {
  await api.post(`/movies/${route.params.id}/reviews`, review)
  fetchMovie()
}
onMounted(fetchMovie)
</script>

<style scoped>
.detail-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.detail-header {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}
.detail-img {
  width: 260px;
  height: 380px;
  object-fit: cover;
  border-radius: 1rem;
  box-shadow: 0 2px 16px #000a;
}
.detail-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.meta {
  display: flex;
  gap: 1.2rem;
  align-items: center;
  margin-bottom: 0.7rem;
}
.year, .genres, .rating {
  background: #232323;
  border-radius: 0.5rem;
  padding: 0.3rem 0.8rem;
  color: #fff;
  font-size: 1rem;
}
.fav-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.3rem;
  padding: 0;
}
.heart {
  color: #888;
  transition: color 0.2s;
}
.heart.filled {
  color: #e74c3c;
}
.synopsis {
  color: #ccc;
  margin-top: 1rem;
}
.reviews-section {
  margin-top: 2rem;
}
</style>

<template>
  <div class="detail-container" v-if="movie">
    <div class="detail-header">
      <img :src="movie.imageUrl" :alt="movie.title" class="detail-img" />
      <div class="detail-info">
        <h1>{{ movie.title }}</h1>
        <div class="meta">
          <span class="year">{{ movie.year }}</span>
          <span class="genres">{{ movie.gender }}</span>
          <span class="rating">⭐ {{ movie.averageRating?.toFixed(1) ?? '0.0' }}</span>
          <button class="fav-btn" @click="toggleFavorite(movie)">
            <span :class="isFavorite(movie.id) ? 'heart filled' : 'heart'">♥</span>
          </button>
        </div>
        <p class="synopsis">{{ movie.description }}</p>
      </div>
    </div>
    <div class="reviews-section">
      <h2>Avaliações</h2>
      <ReviewForm @submit="submitReview" />
      <MovieReview v-for="review in movie.reviews" :key="review.id || review._id" :review="review" />
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
  movie.value = {
    ...data,
    id: data.id || data._id
  }
}
async function submitReview(review: any) {
  await api.post(`/movies/${route.params.id}/reviews`, review)
  fetchMovie()
}
onMounted(fetchMovie)
</script>

<style scoped>
.detail-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 2.5rem 1rem 2rem 1rem;
  background: var(--color-card);
  border-radius: 1.2rem;
  box-shadow: var(--color-shadow);
}
.detail-header {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}
.detail-img {
  width: 200px;
  height: 300px;
  object-fit: cover;
  border-radius: 1rem;
  background: #e5e7eb;
  box-shadow: 0 2px 8px #0001;
}
.detail-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  min-width: 180px;
}
.detail-info h1 {
  color: var(--color-text);
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: 0.5px;
}
.meta {
  display: flex;
  gap: 0.7rem;
  align-items: center;
  margin-bottom: 0.7rem;
}
.year, .genres, .rating {
  background: var(--color-bg-alt);
  border-radius: 0.5rem;
  padding: 0.3rem 0.8rem;
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 500;
}
.rating { color: var(--color-primary); }
.fav-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.3rem;
  padding: 0 0.2rem;
  margin-left: 0.5rem;
  color: #bbb;
  transition: color 0.2s, transform 0.1s;
}
.fav-btn:hover .heart, .fav-btn:focus .heart { color: #e74c3c; transform: scale(1.15); }
.heart {
  color: #bbb;
  transition: color 0.2s, transform 0.1s;
}
.heart.filled {
  color: #e74c3c;
}
.synopsis {
  color: #888;
  margin-top: 1rem;
  font-size: 1.05rem;
  line-height: 1.6;
  background: var(--color-bg-alt);
  border-radius: 0.7rem;
  padding: 1rem 1.1rem;
}
.reviews-section {
  margin-top: 2.2rem;
  background: var(--color-bg-alt);
  border-radius: 1rem;
  box-shadow: 0 1.5px 6px #0001;
  padding: 1.3rem 1rem 1rem 1rem;
  border: 1.5px solid var(--color-border);
}
.reviews-section h2 {
  color: var(--color-text);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.1rem;
}
@media (max-width: 700px) {
  .detail-header {
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
  }
  .detail-img {
    width: 90vw;
    max-width: 260px;
    height: 55vw;
    max-height: 300px;
  }
  .detail-info {
    min-width: 0;
    width: 100%;
  }
}
</style>

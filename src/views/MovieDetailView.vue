<template>
  <div class="detail-container" v-if="movie">
    <div class="detail-header">
      <img :src="movie.imageUrl" :alt="movie.title" class="detail-img" />
      <div class="detail-info">
        <h1>{{ movie.title }}</h1>
        <div class="meta">
          <span class="year">{{ movie.year }}</span>
          <span class="genres">
            <template v-if="Array.isArray(movie.gender)">
              <span v-for="g in movie.gender" :key="g" class="genre-chip">{{ g }}</span>
            </template>
            <template v-else>
              <span class="genre-chip">{{ movie.gender }}</span>
            </template>
          </span>
          <span class="rating">⭐ {{ movie.averageRating?.toFixed(1) ?? '0.0' }}</span>
          <button class="fav-btn" @click="toggleFavorite(movie)">
            <span :class="isFavorite(movie.id) ? 'heart filled' : 'heart'">♥</span>
          </button>
        </div>
        <p class="synopsis">{{ movie.description }}</p>
      </div>
    </div>
    <div class="trailer-section" v-if="movie.trailerUrl">
      <h2>Trailer</h2>
      <div class="trailer-player">
        <iframe
          v-if="movie.trailerUrl.includes('youtube.com') || movie.trailerUrl.includes('youtu.be')"
          :src="getYoutubeEmbedUrl(movie.trailerUrl)"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          class="trailer-iframe"
        ></iframe>
        <video v-else :src="movie.trailerUrl" controls class="trailer-video"></video>
      </div>
    </div>
    <div class="reviews-section">
      <h2>Avaliações</h2>
      <div v-if="errorMsg" class="review-error">{{ errorMsg }}</div>
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
import axios from 'axios';

const route = useRoute()
const movie = ref<any>(null)
const favorites = ref<number[]>(JSON.parse(localStorage.getItem('favorites') || '[]'))
const errorMsg = ref('')

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
  errorMsg.value = ''
  try {
    await api.post(`/movies/${route.params.id}/reviews`, review)
    fetchMovie()
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        errorMsg.value = 'Não foi possível encontrar o filme para avaliar. Tente recarregar a página ou verifique se o filme ainda existe.'
      } else if (error.response.status === 403) {
        errorMsg.value = 'Você precisa estar autenticado para avaliar.'
      } else {
        errorMsg.value = error.response.data?.message || 'Erro ao criar a avaliação.'
      }
    } else {
      errorMsg.value = 'Erro ao criar a avaliação.'
    }
  }
}
function getYoutubeEmbedUrl(url: string) {
  // Suporta links do tipo https://www.youtube.com/watch?v=ID ou https://youtu.be/ID
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (youtubeMatch && youtubeMatch[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  return url;
}
onMounted(fetchMovie)
</script>

<style scoped>
.detail-container {
  max-width: 1100px;
  margin: 3.5rem auto 2rem auto;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.10);
  animation: fadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.detail-header {
  display: flex;
  gap: 2.2rem;
  align-items: flex-start;
  margin-bottom: 2.2rem;
  flex-wrap: wrap;
}
.detail-img {
  width: 220px;
  height: 330px;
  object-fit: cover;
  border-radius: 1.2rem;
  background: #e5e7eb;
  box-shadow: 0 4px 18px #0002;
  transition: box-shadow 0.2s, transform 0.2s;
}
.detail-img:hover {
  box-shadow: 0 8px 32px #e74c3c33;
  transform: scale(1.03);
}
.detail-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  min-width: 180px;
}
.detail-info h1 {
  color: #232323;
  font-size: 2.1rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px #0003;
}
.meta {
  display: flex;
  gap: 0.7rem;
  align-items: center;
  margin-bottom: 0.7rem;
  flex-wrap: wrap;
}
.year, .rating {
  background: #f0f0f0;
  color: #232323;
  border-radius: 1.2rem;
  padding: 0.35rem 1.1rem;
  font-size: 1.05rem;
  font-weight: 600;
  box-shadow: 0 1px 4px #0002;
  margin-right: 0.2rem;
}
.genres {
  display: flex;
  gap: 0.4rem;
}
.genre-chip {
  background: linear-gradient(90deg, #e74c3c 60%, #ff7675 100%);
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.5px;
  border-radius: 1.2rem;
  padding: 0.35rem 1.1rem;
  font-size: 1.05rem;
  box-shadow: 0 1px 4px #e74c3c22;
  margin-right: 0.1rem;
}
.fav-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
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
  color: #444;
  margin-top: 1.2rem;
  font-size: 1.13rem;
  line-height: 1.7;
  background: #f7f7f7;
  border-radius: 0.9rem;
  padding: 1.2rem 1.3rem;
  box-shadow: 0 1.5px 6px #0002;
}
.reviews-section {
  margin-top: 2.5rem;
  background: #f7f7f7;
  border-radius: 1.2rem;
  box-shadow: 0 1.5px 6px #0002;
  padding: 1.5rem 1.1rem 1.1rem 1.1rem;
  border: 1.5px solid #e0e0e0;
}
.reviews-section h2 {
  color: #232323;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1.1rem;
}
.trailer-section {
  margin: 2.2rem 0 2.5rem 0;
  background: #f7f7f7;
  border-radius: 1.2rem;
  box-shadow: 0 1.5px 6px #0002;
  padding: 1.5rem 1.1rem 1.1rem 1.1rem;
  border: 1.5px solid #e0e0e0;
  text-align: center;
}
.trailer-section h2 {
  color: #232323;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1.1rem;
}
.trailer-player {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  padding: 0.5rem 0 0.5rem 0;
}
.trailer-iframe, .trailer-video {
  width: 100%;
  max-width: 700px;
  aspect-ratio: 16/9;
  min-height: 240px;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px #0001;
  background: #000;
  border: 2px solid #e0e0e0;
  margin: 0 auto;
  display: block;
}
.review-error {
  color: #e74c3c;
  background: #ffeaea;
  border: 1.5px solid #e74c3c;
  border-radius: 0.7rem;
  padding: 0.7rem 1rem;
  margin-bottom: 1rem;
  font-weight: 600;
  text-align: center;
  font-size: 1.05rem;
}
@media (max-width: 1100px) {
  .detail-container {
    padding: 1.2rem 0.5rem;
  }
}
@media (max-width: 900px) {
  .detail-container {
    padding: 1.2rem 0.2rem;
  }
  .detail-header {
    gap: 1.2rem;
  }
  .trailer-iframe, .trailer-video {
    max-width: 98vw;
    min-height: 180px;
  }
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
  .detail-container {
    margin: 2.2rem 0 1.2rem 0;
    padding: 1.2rem 0.2rem;
  }
  .trailer-player iframe,
  .trailer-player video {
    max-width: 98vw;
    height: 45vw;
    min-height: 180px;
  }
}
</style>

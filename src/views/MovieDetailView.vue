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
          <button v-if="isAuthenticated()" 
                  class="fav-btn" 
                  @click="handleToggleFavorite"
                  :disabled="isLoading">
            <span v-if="isLoading" class="loader"></span>
            <span v-else :class="isFavorite(movie.id) ? 'heart filled' : 'heart'">♥</span>
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
      <div v-if="reviewsError" class="review-error">{{ reviewsError }}</div>
      <MovieReview
        v-for="review in reviews"
        :key="review.id || review._id"
        :review="review"
        @edit-review="handleEditReview"
        @delete-review="handleDeleteReview"
        @add-comment="(payload, done) => handleAddComment(payload, done, review)"
        @edit-comment="(payload, done) => handleEditComment(payload, done, review)"
        @delete-comment="payload => handleDeleteComment(payload, review)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../api/axios';
import MovieReview from '../components/MovieReview.vue';
import ReviewForm from '../components/ReviewForm.vue';
import { isAuthenticated } from '../services/jwtHelper';
import { getUserFavorites, toggleFavorite } from '../services/userService';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const movie = ref<any>(null);
const reviews = ref<any[]>([]);
const reviewsError = ref('');
const errorMsg = ref('');
const favorites = ref<any[]>([]);
const isLoading = ref(false);

// Carrega os favoritos do usuário
async function loadFavorites() {
  if (!isAuthenticated()) return;
  
  try {
    const username = localStorage.getItem('username');
    if (username) {
      favorites.value = await getUserFavorites(username);
    }
  } catch (error) {
    console.error('Erro ao carregar favoritos:', error);
  }
}

// Verifica se um filme é favorito
function isFavorite(movieId: string) {
  return favorites.value.some(fav => fav.movieId === movieId);
}

// Adiciona/remove dos favoritos
async function handleToggleFavorite() {
  if (!isAuthenticated()) {
    router.push('/login');
    return;
  }

  if (!movie.value) return;

  try {
    isLoading.value = true;
    await toggleFavorite(movie.value.id);
    await loadFavorites(); // Recarrega a lista de favoritos
  } catch (error) {
    console.error('Erro ao alternar favorito:', error);
  } finally {
    isLoading.value = false;
  }
}

async function fetchMovie() {
  try {
    const { data } = await api.get(`/movies/${route.params.id}`);
    movie.value = {
      ...data,
      id: data.id || data._id
    };
  } catch (error) {
    console.error('Erro ao carregar filme:', error);
    errorMsg.value = 'Erro ao carregar o filme.';
  }
}
async function fetchReviews() {
  reviewsError.value = ''
  try {
    const { data } = await api.get(`/reviews/movie/${route.params.id}`)
    reviews.value = data
  } catch (error: any) {
    reviews.value = []
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        reviewsError.value = 'Nenhuma avaliação encontrada para este filme.'
      } else {
        reviewsError.value = error.response.data?.message || 'Erro ao buscar avaliações.'
      }
    } else {
      reviewsError.value = 'Erro ao buscar avaliações.'
    }
  }
}
async function submitReview(review: any) {
  errorMsg.value = ''
  try {
    await api.post(`/reviews/movies/${route.params.id}/reviews`, review)
    await fetchMovie() // Atualiza dados do filme (inclui média)
    await fetchReviews() // Atualiza avaliações
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        errorMsg.value = 'Não foi possível encontrar o filme para avaliar. Tente recarregar a página ou verifique se o filme ainda existe.';
      } else if (error.response.status === 403) {
        errorMsg.value = 'Você precisa estar autenticado para avaliar.';
      } else {
        errorMsg.value = error.response.data?.message || 'Erro ao criar a avaliação.';
      }
    } else {
      errorMsg.value = 'Erro ao criar a avaliação.';
    }
  }
}
async function handleEditReview(editedReview: any, done: Function) {
  try {
    await api.put(`/reviews/${editedReview.id || editedReview._id}`, {
      comentario: editedReview.comentario,
      nota: editedReview.nota
    })
    await fetchReviews()
    await fetchMovie()
    done && done()
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      alert('Permissão negada: apenas o autor da avaliação pode editar.')
    } else {
      alert('Erro ao editar avaliação.')
    }
  }
}
async function handleDeleteReview(review: any) {
  try {
    await api.delete(`/reviews/${review.id || review._id}`)
    await fetchReviews()
    await fetchMovie()
  } catch (error: any) {
    alert('Erro ao excluir avaliação.')
  }
}
async function handleAddComment(comment: any, done: Function, review: any) {
  try {
    await api.post(`/reviews/${review.id || review._id}/comments`, {
      texto: comment.texto
    })
    await fetchReviews()
    done && done()
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      alert('Você não tem permissão para comentar. Faça login.')
    } else {
      alert('Erro ao adicionar comentário.')
    }
  }
}
async function handleEditComment({ commentId, texto }: any, done: Function, review: any) {
  try {
    await api.put(`/reviews/${review.id || review._id}/comments/${commentId}`, { texto })
    await fetchReviews()
    done && done()
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      const msg = 'Permissão negada: apenas o autor ou um administrador pode editar este comentário.'
      done ? done(msg) : alert(msg)
    } else {
      const msg = 'Erro ao editar comentário.'
      done ? done(msg) : alert(msg)
    }
  }
}
async function handleDeleteComment({ commentId }: any, review: any, done?: Function) {
  try {
    await api.delete(`/reviews/${review.id || review._id}/comments/${commentId}`)
    await fetchReviews()
    done && done()
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      const msg = 'Permissão negada: apenas o autor ou um administrador pode excluir este comentário.'
      done ? done(msg) : alert(msg)
    } else {
      const msg = 'Erro ao excluir comentário.'
      done ? done(msg) : alert(msg)
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
onMounted(async () => {
  await Promise.all([
    fetchMovie(),
    fetchReviews(),
    loadFavorites()
  ]);
})
</script>

<style scoped>
.detail-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  background: #f8fafc;
}

.detail-header {
  display: grid;
  grid-template-columns: minmax(250px, 300px) 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 0.8rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #edf2f7;
}

.detail-img {
  width: 100%;
  height: auto;
  border-radius: 0.8rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.detail-info h1 {
  font-size: 1.8rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.2rem;
  flex-wrap: wrap;
}

.year {
  color: #4a5568;
  font-weight: 500;
}

.genres {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.genre-chip {
  background: #edf2f7;
  color: #2d3748;
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.9rem;
}

.rating {
  color: #4a5568;
  font-weight: 500;
}

.synopsis {
  color: #4a5568;
  line-height: 1.6;
}

.reviews-section {
  background: white;
  padding: 2rem;
  border-radius: 0.8rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #edf2f7;
  margin: 2rem 0;
}

.reviews-section h2 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.review-error {
  background: #fff5f5;
  color: #e53e3e;
  padding: 1rem;
  border-radius: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #feb2b2;
}

.trailer-section {
  margin: 2rem 0;
  background: white;
  padding: 2rem;
  border-radius: 0.8rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #edf2f7;
}

.trailer-section h2 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.trailer-player {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: 0.8rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.trailer-iframe,
.trailer-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.fav-btn {
  background: var(--color-card);
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1rem;
}

.fav-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.heart {
  color: var(--color-text);
  transition: color 0.3s ease, transform 0.3s ease;
}

.heart.filled {
  color: #ff4081;
  transform: scale(1.1);
}

.loader {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: var(--color-text);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .detail-container {
    padding: 1rem;
  }

  .detail-header {
    grid-template-columns: 1fr;
    padding: 1.5rem;
  }

  .detail-img {
    max-width: 250px;
    margin: 0 auto;
  }

  .detail-info h1 {
    font-size: 1.5rem;
    text-align: center;
  }

  .meta {
    justify-content: center;
  }

  .synopsis {
    text-align: center;
  }
}
</style>

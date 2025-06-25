<template>
  <div class="profile-container">
    <div class="profile-box">
      <h2>Perfil do Usuário</h2>
      <div class="user-info">
        <p><strong>Usuário:</strong> {{ username }}</p>
      </div>
      <button class="logout-btn" @click="logout">Sair</button>
    </div>
    <div class="reviews-section">
      <h3>Minhas Avaliações</h3>
      <div v-if="reviews.length === 0" class="no-reviews">Nenhuma avaliação encontrada.</div>
      <div v-else>
        <div v-for="review in reviews" :key="review.id" class="review-card">
          <div class="review-header">
            <span class="movie-title">Filme: {{ review.movieTitle }}</span>
            <span class="stars">{{ '★'.repeat(review.nota) + '☆'.repeat(5 - review.nota) }}</span>
          </div>
          <p class="comment">{{ review.comentario }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const username = localStorage.getItem('username') || '';
const reviews = ref<any[]>([]);

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  router.push('/login');
}

async function fetchUserReviews() {
  try {
    const { data } = await api.get(`/usuarios/${username}/avaliacoes`);
    reviews.value = data;
  } catch (e) {
    reviews.value = [];
  }
}

onMounted(() => {
  fetchUserReviews();
});
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
}
.profile-box {
  background: #232323;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px #000a;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}
.user-info {
  font-size: 1.1rem;
  color: #fff;
}
.logout-btn {
  background: linear-gradient(90deg, #000 60%, #e74c3c 100%);
  color: #fff;
  border: none;
  border-radius: 0.75rem;
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  font-weight: 600;
}
.logout-btn:hover {
  background: linear-gradient(90deg, #222 60%, #c0392b 100%);
}
.reviews-section {
  background: #232323;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 12px #000a;
}
.review-card {
  background: #292929;
  border-radius: 0.7rem;
  padding: 1rem;
  margin-bottom: 1rem;
}
.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.movie-title {
  color: #ffd700;
  font-weight: 600;
}
.stars {
  color: #ffd700;
  font-size: 1.1rem;
}
.comment {
  color: #fff;
  margin: 0;
}
.no-reviews {
  color: #aaa;
  text-align: center;
  margin-top: 1rem;
}
</style>

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
import api from '../api/axios';

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
  margin: 6.5rem auto 2rem auto;
  padding: 0 1rem 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.profile-box {
  background: var(--color-card);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--color-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
}
.user-info {
  font-size: 1.1rem;
  color: var(--color-text);
  text-align: center;
}
.logout-btn {
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 0.75rem;
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  font-weight: 600;
  transition: background 0.2s;
}
.logout-btn:hover {
  background: var(--color-primary-dark);
}
.reviews-section {
  background: var(--color-bg-alt);
  border-radius: 1rem;
  box-shadow: 0 1.5px 6px #0001;
  padding: 1.5rem 1rem;
  border: 1.5px solid var(--color-border);
  width: 100%;
}
.review-card {
  background: var(--color-card);
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
  color: var(--color-primary);
  font-weight: 600;
}
.stars {
  color: #ffd700;
  font-size: 1.1rem;
}
.comment {
  color: var(--color-text);
  margin: 0;
}
.no-reviews {
  color: #aaa;
  text-align: center;
  margin-top: 1rem;
}
@media (max-width: 700px) {
  .profile-container {
    margin: 7.5rem 0.2rem 1.5rem 0.2rem;
    padding: 0;
  }
  .profile-box, .reviews-section {
    padding: 1.2rem 0.5rem;
    border-radius: 1rem;
  }
}
</style>

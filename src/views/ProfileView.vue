<template>
  <div class="profile-container">
    <div class="profile-box">
      <h2>Perfil do Usuário</h2>
      <div class="user-info">
        <p><strong>Usuário:</strong> {{ profileUsername }}</p>
      </div>
      <button v-if="isOwner" class="logout-btn" @click="logout">Sair</button>
    </div>

    <div class="favorites-section">
      <h3>Filmes Favoritos</h3>
      <div v-if="loading" class="loading">Carregando...</div>
      <div v-else-if="favorites.length === 0" class="no-items">Nenhum filme favorito.</div>
      <div v-else class="favorites-grid">
        <div v-for="movie in favorites" :key="movie.movieId" class="movie-card">
          <router-link :to="'/movies/' + movie.movieId" class="movie-link">
            <img :src="movie.imageUrl" :alt="movie.title" class="movie-img" />
            <div class="movie-info">
              <h4>{{ movie.title }}</h4>
              <span class="year">{{ movie.year }}</span>
            </div>
          </router-link>
          <button v-if="isOwner" 
                  class="remove-btn" 
                  @click="handleRemoveFavorite(movie.movieId)"
                  :disabled="loading">
            Remover dos favoritos
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { isCurrentUser } from '../services/jwtHelper';
import { getUserFavorites, removeFavorite } from '../services/userService';

const router = useRouter();
const route = useRoute();

// Garante que sempre teremos um username válido
const profileUsername = computed(() => {
  const username = route.params.username || localStorage.getItem('username');
  if (!username) {
    router.push('/login');
    return '';
  }
  return username.toString();
});

const isOwner = computed(() => isCurrentUser(profileUsername.value));
const favorites = ref<any[]>([]);
const loading = ref(false);

async function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  router.push('/login');
}

async function fetchUserFavorites() {
  if (!profileUsername.value) return;
  
  try {
    loading.value = true;
    favorites.value = await getUserFavorites(profileUsername.value);
  } catch (error) {
    console.error('Erro ao carregar favoritos:', error);
    favorites.value = [];
  } finally {
    loading.value = false;
  }
}

async function handleRemoveFavorite(movieId: string) {
  if (!isOwner.value) return;

  try {
    loading.value = true;
    await removeFavorite(movieId);
    await fetchUserFavorites();
  } catch (error) {
    console.error('Erro ao remover favorito:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (profileUsername.value) {
    fetchUserFavorites();
  }
});
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-box {
  background: var(--color-card);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid var(--color-border);
  box-shadow: var(--color-shadow);
}

.profile-box h2 {
  margin: 0 0 1rem 0;
  color: var(--color-text);
}

.user-info {
  margin-bottom: 1rem;
}

.logout-btn {
  background: #ff4081;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #f50057;
}

.favorites-section {
  margin-top: 2rem;
}

.favorites-section h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.movie-card {
  background: var(--color-card);
  border-radius: 0.8rem;
  overflow: hidden;
  box-shadow: var(--color-shadow);
  transition: transform 0.2s;
  border: 1px solid var(--color-border);
}

.movie-card:hover {
  transform: translateY(-4px);
}

.movie-link {
  text-decoration: none;
  color: inherit;
}

.movie-img {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-bottom: 1px solid var(--color-border);
}

.movie-info {
  padding: 1rem;
}

.movie-info h4 {
  margin: 0;
  font-size: 1rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.year {
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.remove-btn {
  width: 100%;
  padding: 0.8rem;
  background: #ff4081;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s;
}

.remove-btn:hover {
  background: #f50057;
}

.remove-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading,
.no-items {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-light);
  font-size: 1.1rem;
}
</style>

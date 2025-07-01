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
      <div v-else class="movies-grid">
        <MovieCard 
          v-for="movie in favorites" 
          :key="movie.movieId" 
          :movie="{
            id: movie.movieId,
            title: movie.title || 'Título não disponível',
            imageUrl: movie.imageUrl || '',
            year: movie.year || 0,
            averageRating: Number(movie.averageRating) || 0,
            gender: movie.gender || [],
            description: movie.description || ''
          }" 
          :favorite="true" 
          @toggle-favorite="handleRemoveFavorite(movie.movieId)" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { isCurrentUser } from '../services/jwtHelper';
import { getUserFavorites, removeFavorite } from '../services/userService';
import MovieCard from '../components/MovieCard_new.vue';
import api from '../api/axios';
import Swal from 'sweetalert2';

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
    const favoriteMovies = await getUserFavorites(profileUsername.value);
    
    // Buscar detalhes completos de cada filme para ter a avaliação
    const moviesWithDetails = await Promise.all(
      favoriteMovies.map(async (favorite) => {
        try {
          const { data: movieDetails } = await api.get(`/movies/${favorite.movieId}`);
          return {
            ...favorite,
            averageRating: movieDetails.averageRating || 0,
            gender: movieDetails.gender || [],
            description: movieDetails.description || ''
          };
        } catch (error) {
          console.error(`Erro ao buscar detalhes do filme ${favorite.movieId}:`, error);
          return favorite; // Retorna o favorito sem os detalhes extras
        }
      })
    );
    
    favorites.value = moviesWithDetails;
  } catch (error) {
    console.error('Erro ao carregar favoritos:', error);
    favorites.value = [];
  } finally {
    loading.value = false;
  }
}

async function handleRemoveFavorite(movieId: string) {
  if (!isOwner.value) return;

  // Encontrar o filme para mostrar o título na confirmação
  const movie = favorites.value.find(fav => fav.movieId === movieId);
  const movieTitle = movie?.title || 'este filme';

  // Mostrar confirmação bonita com SweetAlert2
  const result = await Swal.fire({
    title: 'Remover dos favoritos?',
    text: `Tem certeza que deseja remover "${movieTitle}" dos seus favoritos?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sim, remover!',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    customClass: {
      popup: 'swal-popup',
      title: 'swal-title',
      confirmButton: 'swal-confirm-btn',
      cancelButton: 'swal-cancel-btn'
    }
  });

  if (result.isConfirmed) {
    try {
      loading.value = true;
      await removeFavorite(movieId);
      await fetchUserFavorites();
      
      // Mostrar sucesso
      Swal.fire({
        title: 'Removido!',
        text: `"${movieTitle}" foi removido dos seus favoritos.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'swal-popup',
          title: 'swal-title'
        }
      });
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      
      // Mostrar erro
      Swal.fire({
        title: 'Erro!',
        text: 'Não foi possível remover o filme dos favoritos. Tente novamente.',
        icon: 'error',
        confirmButtonColor: '#e74c3c',
        customClass: {
          popup: 'swal-popup',
          title: 'swal-title',
          confirmButton: 'swal-confirm-btn'
        }
      });
    } finally {
      loading.value = false;
    }
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
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  padding-top: 90px; /* Espaço para o header fixo */
  min-height: calc(100vh - 90px);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-sizing: border-box;
}

.profile-box {
  background: var(--color-card);
  border-radius: var(--radius);
  padding: 2rem;
  border: 1px solid var(--color-border);
  box-shadow: var(--color-shadow);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
}

.profile-box h2 {
  margin: 0;
  color: var(--color-text);
  font-size: clamp(1.3rem, 5vw, 1.8rem);
  font-weight: 700;
  flex: 1;
  min-width: 200px;
}

.user-info {
  flex: 2;
  min-width: 200px;
}

.user-info p {
  font-size: clamp(0.95rem, 2.5vw, 1.1rem);
  color: var(--color-text);
  margin: 0;
}

.logout-btn {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.9rem 2rem;
  border-radius: var(--radius);
  cursor: pointer;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  font-weight: 600;
  transition: all var(--transition);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
}

.logout-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.favorites-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.favorites-section h3 {
  font-size: clamp(1.2rem, 4vw, 1.7rem);
  color: var(--color-text);
  font-weight: 700;
  text-align: center;
  margin: 0;
}

/* Grid dos filmes favoritos - idêntico ao usado na FavoritesView */
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

.loading,
.no-items {
  text-align: center;
  padding: clamp(1.2rem, 3vw, 2rem);
  color: var(--color-text-light);
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  background: var(--color-card);
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
  box-shadow: var(--color-shadow);
}

/* Responsividade do grid de filmes favoritos */
@media (max-width: 700px) {
  .profile-container {
    padding: 0.5rem 0.2rem;
    padding-top: 80px;
    gap: 1rem;
  }
  .profile-box {
    padding: 1rem;
    border-radius: 0.7rem;
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
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
  .profile-container {
    padding: 0;
    padding-top: 75px;
    gap: 0.3rem;
  }
  .profile-box {
    padding: 0.7rem 0.2rem;
    border-radius: 0;
    border-left: 0;
    border-right: 0;
    flex-direction: column;
    text-align: center;
    box-shadow: none;
    gap: 0.7rem;
  }
  .movies-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 0.3rem;
    padding: 0;
  }
  .movies-grid > * {
    max-width: none;
  }
  .loading,
  .no-items {
    border-radius: 0;
    border-left: 0;
    border-right: 0;
    box-shadow: none;
    padding: 0.7rem 0.2rem;
  }
}
@media (max-height: 500px) {
  .profile-container {
    min-height: auto;
    padding-top: 0.5rem;
  }
}

/* Estilos customizados para SweetAlert2 */
:global(.swal-popup) {
  border-radius: 1.2rem !important;
  padding: 2rem !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2) !important;
  border: 1px solid var(--color-border) !important;
  background: var(--color-card) !important;
}

:global(.swal-title) {
  color: var(--color-text) !important;
  font-weight: 700 !important;
  font-size: 1.5rem !important;
  margin-bottom: 1rem !important;
}

:global(.swal2-html-container) {
  color: var(--color-text-light) !important;
  font-size: 1.1rem !important;
  line-height: 1.5 !important;
}

:global(.swal-confirm-btn) {
  background: linear-gradient(135deg, #e74c3c, #c0392b) !important;
  border: none !important;
  border-radius: 0.8rem !important;
  padding: 0.8rem 1.5rem !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}

:global(.swal-confirm-btn:hover) {
  background: linear-gradient(135deg, #c0392b, #a93226) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4) !important;
}

:global(.swal-cancel-btn) {
  background: var(--color-bg-alt) !important;
  color: var(--color-text) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: 0.8rem !important;
  padding: 0.8rem 1.5rem !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}

:global(.swal-cancel-btn:hover) {
  background: var(--color-border) !important;
  transform: translateY(-2px) !important;
}

:global(.swal2-icon.swal2-question) {
  border-color: var(--color-primary) !important;
  color: var(--color-primary) !important;
}

:global(.swal2-icon.swal2-success) {
  border-color: #28a745 !important;
  color: #28a745 !important;
}

:global(.swal2-icon.swal2-error) {
  border-color: #e74c3c !important;
  color: #e74c3c !important;
}
</style>

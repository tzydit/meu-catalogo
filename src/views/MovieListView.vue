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
      <GenreFilter :genres="genres" v-model="selectedGenres" />
    </div>
    <div v-if="search || selectedGenres.length > 0" class="filter-info">
      <p class="results-count">{{ movies.length }} filmes encontrados</p>
      <div v-if="search" class="active-search">
        Buscando por: "<strong>{{ search }}</strong>"
      </div>
      <div v-if="selectedGenres.length > 0" class="active-filters">
        Filtros ativos: 
        <span v-for="genre in selectedGenres" :key="genre" class="active-filter">{{ genre }}</span>
        <button @click="clearAllFilters" class="clear-all-btn">Limpar Tudo</button>
      </div>
    </div>
    <div class="movies-grid">
      <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import api from '../api/axios';
import MovieCard from '../components/MovieCard_new.vue';
import GenreFilter from '../components/GenreFilter.vue';

interface Movie {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  year: number;
  averageRating: number;
  gender: string[];
  trailerUrl?: string;
  // ...outros campos se necessário
}

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

const movies = ref<Movie[]>([])
const genres = ref<string[]>([])
const selectedGenres = ref<string[]>([])
const search = ref('')
const loading = ref(false)
const errorMsg = ref('')

// Função utilitária para normalizar texto
function normalizeText(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    // Corrige problemas de encoding comuns
    .replace(/Ã§Ã£o/g, 'ção')
    .replace(/Ã©/g, 'é')
    .replace(/Ã¡/g, 'á')
    .replace(/Ã­/g, 'í')
    .replace(/Ã³/g, 'ó')
    .replace(/Ãº/g, 'ú')
    .replace(/Ã/g, 'ã')
    .replace(/Ã§/g, 'ç')
    // Remove acentos para comparação
    .replace(/[ãáàâä]/g, 'a')
    .replace(/[õóòôö]/g, 'o')
    .replace(/[éèêë]/g, 'e')
    .replace(/[íìîï]/g, 'i')
    .replace(/[úùûü]/g, 'u')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, ' '); // Normaliza espaços
}

function clearAllFilters() {
  search.value = ''
  selectedGenres.value = []
  fetchMovies()
}
async function fetchMovies() {
  loading.value = true
  errorMsg.value = ''
  
  try {
    const params = new URLSearchParams();
    
    if (search.value.trim()) {
      params.append('title', search.value.trim());
    }
    
    // Para filtragem por gênero, enviamos cada gênero selecionado como parâmetro separado
    if (selectedGenres.value.length > 0) {
      selectedGenres.value.forEach(genre => {
        params.append('gender', genre.trim());
      });
    }
    
    const url = params.toString() ? `/movies?${params.toString()}` : '/movies';
    
    const { data } = await api.get(url);
    
    let filteredMovies = data.map((movie: any) => ({
      ...movie,
      id: movie.id || movie._id
    }));
    
    // Filtragem adicional no frontend para garantir que funcione
    if (selectedGenres.value.length > 0) {
      filteredMovies = filteredMovies.filter((movie: any) => {
        const movieGenres = Array.isArray(movie.gender) ? movie.gender : [movie.gender].filter(Boolean);
        
        // Mudança: agora verifica se o filme tem TODOS os gêneros selecionados (interseção)
        const hasAllSelectedGenres = selectedGenres.value.every(selectedGenre => 
          movieGenres.some((movieGenre: string) => {
            if (!movieGenre || !selectedGenre) return false;
            
            // Usa a função de normalização
            const normalizedMovieGenre = normalizeText(movieGenre);
            const normalizedSelectedGenre = normalizeText(selectedGenre);
            
            const match = normalizedMovieGenre === normalizedSelectedGenre || 
                         normalizedMovieGenre.includes(normalizedSelectedGenre) ||
                         normalizedSelectedGenre.includes(normalizedMovieGenre);
            
            return match;
          })
        );
        
        return hasAllSelectedGenres;
      });
    }
    
    // Não limita mais os filmes na página principal
    movies.value = filteredMovies;
  } catch (e) {
    console.error('Erro ao buscar filmes:', e);
    errorMsg.value = 'Erro ao buscar filmes.'
    movies.value = []
  } finally {
    loading.value = false
  }
}

async function fetchGenres() {
  try {
    const { data } = await api.get('/generos');
    // Normaliza os gêneros recebidos do backend
    genres.value = data.map((genre: string) => {
      // Tenta corrigir problemas de encoding
      return genre
        .replace(/Ã§Ã£o/g, 'ção')
        .replace(/Ã©/g, 'é')
        .replace(/Ã¡/g, 'á')
        .replace(/Ã­/g, 'í')
        .replace(/Ã³/g, 'ó')
        .replace(/Ãº/g, 'ú')
        .replace(/Ã/g, 'ã')
        .replace(/FicÃ§Ã£o CientÃfica/g, 'Ficção Científica')
        .replace(/ComÃ©dia/g, 'Comédia')
        .replace(/A[çÃ§]?[ãÃ£]?o/g, 'Ação')
        .replace(/AnimaÃ§Ã£o/g, 'Animação')
        .replace(/DocumentÃ¡rio/g, 'Documentário');
    });
  } catch (error) {
    console.error('Erro ao buscar gêneros:', error);
    // Fallback com gêneros comuns se a API falhar
    genres.value = ['Ação', 'Aventura', 'Comédia', 'Drama', 'Horror', 'Romance', 'Ficção Científica', 'Thriller', 'Animação', 'Documentário', 'Suspense'];
  }
}

onMounted(() => {
  fetchGenres()
  fetchMovies()
})

// Watcher separado para debug
watch(selectedGenres, () => {
  fetchMovies()
}, { deep: true })

watch(search, () => {
  fetchMovies()
})
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
.filter-info {
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  border-radius: 0.8rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

.results-count {
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--color-primary);
}

.active-filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-size: 0.9rem;
}

.active-search {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text);
}

.active-filter {
  background: var(--color-primary);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 0.4rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.clear-all-btn {
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 0.4rem;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.clear-all-btn:hover {
  background: #c0392b;
}

@media (max-width: 700px) {
  .filter-info {
    padding: 0.8rem;
    border-radius: 0.6rem;
  }
  
  .active-filters {
    font-size: 0.85rem;
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
}
@media (max-width: 400px) {
  .movies-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 0.3rem;
    padding: 0;
  }
}
.about-section {
  background: var(--color-card);
  color: var(--color-text);
  border-radius: var(--radius);
  box-shadow: var(--color-shadow);
  padding: clamp(1rem, 4vw, 2.5rem) clamp(0.5rem, 2vw, 2.5rem) clamp(1rem, 4vw, 1.5rem) clamp(0.5rem, 2vw, 2.5rem);
  margin-bottom: 1.5rem;
  text-align: center;
  border: 1.5px solid var(--color-border);
}
@media (max-width: 700px) {
  .about-section {
    padding: 1rem 0.5rem 1rem 0.5rem;
    border-radius: 0.7rem;
  }
}
@media (max-width: 400px) {
  .about-section {
    padding: 0.5rem 0.2rem 0.5rem 0.2rem;
    border-radius: 0;
  }
}
.top-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
}
@media (max-width: 700px) {
  .top-bar {
    flex-direction: column;
    gap: 0.7rem;
    margin-bottom: 1rem;
  }
}
.search-input {
  flex: 1;
  min-width: 180px;
  font-size: clamp(0.95rem, 2.5vw, 1.1rem);
  padding: clamp(0.7rem, 2vw, 1rem) clamp(1rem, 4vw, 1.2rem);
  border-radius: 0.7rem;
  border: 1.5px solid var(--color-border);
}
@media (max-width: 400px) {
  .search-input {
    font-size: 1rem;
    padding: 0.7rem 0.5rem;
    border-radius: 0.3rem;
  }
}
.create-movie-link {
  font-size: clamp(0.95rem, 2.5vw, 1.13rem);
  padding: clamp(0.7rem, 2vw, 1rem) clamp(1rem, 4vw, 1.2rem);
  border-radius: 0.7rem;
  background: var(--color-primary);
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  transition: background 0.2s;
  border: none;
  display: inline-block;
}
.create-movie-link:hover {
  background: var(--color-primary-dark);
}
@media (max-width: 400px) {
  .create-movie-link {
    font-size: 1rem;
    padding: 0.7rem 0.5rem;
    border-radius: 0.3rem;
  }
}
</style>

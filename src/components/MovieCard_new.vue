<template>
  <div class="movie-card-wrapper">
    <router-link :to="`/movies/${movie.id}`" class="movie-link">
      <div class="movie-card" :class="{ favorite }">
        <div class="movie-image-container">
          <img :src="movie.imageUrl" :alt="movie.title" class="movie-img" />
          <div class="movie-overlay">
            <div class="overlay-top">
              <span class="movie-year">{{ movie.year }}</span>
            </div>
            <div class="overlay-bottom">
              <div class="rating-badge">
                <span class="rating-star">⭐</span>
                <span class="rating-value">{{ movie.averageRating?.toFixed(1) ?? '0.0' }}</span>
              </div>
            </div>
          </div>
          <div class="card-shine"></div>
        </div>
        <div class="movie-info">
          <h3 class="movie-title">{{ movie.title }}</h3>
          <div class="genre-tags">
            <span v-for="(genre, index) in movieGenres.slice(0, 2)" 
                  :key="index" 
                  class="genre-tag">
              {{ genre }}
            </span>
            <span v-if="movieGenres.length > 2" class="genre-more">+{{ movieGenres.length - 2 }}</span>
          </div>
        </div>
      </div>
    </router-link>
    <button v-if="favorite" class="unfavorite-btn" @click="$emit('toggle-favorite', movie)">
      Desfavoritar
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  movie: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    year: number;
    averageRating?: number;
    gender: string | string[];
  };
  favorite?: boolean;
}>();

defineEmits(['toggle-favorite']);

const movieGenres = computed(() => {
  if (!props.movie.gender) return [];
  return Array.isArray(props.movie.gender) ? props.movie.gender : [props.movie.gender];
});
</script>

<style scoped>
.movie-card-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
}

.movie-link {
  text-decoration: none;
  color: inherit;
  display: block;
  width: 100%;
  height: 460px; /* Altura aumentada para proporção de cartaz */
  max-width: 100%;
}

.movie-card {
  background: var(--color-card);
  border-radius: 1.2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  width: 100%;
  height: 100%;
  border: 1px solid var(--color-border);
  position: relative;
  min-width: 0;
  backdrop-filter: blur(10px);
  max-width: 100%;
}

.movie-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgba(99, 102, 241, 0.15);
  border-color: var(--color-primary);
}

.movie-image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 2/3.2; /* Proporção mais alta como cartaz de filme */
  min-width: 0;
  overflow: hidden;
  background: var(--color-bg-alt); /* Fundo para preencher espaços vazios */
}

.movie-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Preenche todo o container com tamanho uniforme */
  object-position: center; /* Centraliza a imagem */
  transition: transform 0.3s ease;
}

.movie-card:hover .movie-img {
  transform: scale(1.05); /* Zoom mais visível para efeito cover */
}

.movie-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.7) 0%,
    transparent 30%,
    transparent 70%,
    rgba(0, 0, 0, 0.8) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.8rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.movie-card:hover .movie-overlay {
  opacity: 1;
}

.overlay-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.overlay-bottom {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}

.movie-year {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.rating-badge {
  background: rgba(255, 193, 7, 0.9);
  color: #333;
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-weight: 600;
  font-size: 0.8rem;
  backdrop-filter: blur(10px);
}

.rating-star {
  font-size: 0.9rem;
}

.fav-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.fav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.heart {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.heart.filled {
  color: #e74c3c;
  text-shadow: 0 0 8px rgba(231, 76, 60, 0.6);
}

.unfavorite-btn {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  border: none;
  border-radius: 1rem;
  padding: 0.9rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 0.8rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.unfavorite-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.unfavorite-btn:hover::before {
  left: 100%;
}

.unfavorite-btn:hover {
  background: linear-gradient(135deg, #c0392b, #a93226);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(231, 76, 60, 0.5);
}

.unfavorite-btn:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
}

.card-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.6s ease;
}

.movie-card:hover .card-shine {
  left: 100%;
}

.movie-info {
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.movie-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: auto;
}

.genre-tag {
  background: linear-gradient(45deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 0.4rem;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2);
}

.genre-more {
  background: var(--color-bg-alt);
  color: var(--color-text);
  padding: 0.2rem 0.5rem;
  border-radius: 0.4rem;
  font-size: 0.7rem;
  font-weight: 500;
  border: 1px solid var(--color-border);
}

/* Responsividade */
@media (max-width: 1200px) {
  .movie-link {
    height: 380px;
  }
}

@media (max-width: 900px) {
  .movie-link {
    height: 350px;
  }
}

@media (max-width: 700px) {
  .movie-card {
    border-radius: 0.8rem;
  }
  
  .movie-link {
    height: 280px;
  }
  
  .movie-overlay {
    padding: 0.6rem;
  }
  
  .movie-info {
    padding: 0.8rem;
  }
  
  .movie-title {
    font-size: 0.9rem;
  }
}

@media (max-width: 500px) {
  .movie-link {
    height: 360px; /* Altura ajustada para proporção de cartaz em mobile */
  }
  
  .movie-image-container {
    aspect-ratio: 2/3; /* Proporção de cartaz em mobile */
  }
  
  .unfavorite-btn {
    padding: 0.7rem 1.2rem;
    font-size: 0.8rem;
    margin-top: 0.6rem;
    border-radius: 0.8rem;
  }
}

@media (max-width: 400px) {
  .movie-card {
    border-radius: 0.6rem;
    min-width: 0;
  }
  
  .movie-link {
    height: 320px; /* Altura aumentada para manter proporção de cartaz */
  }
  
  .movie-image-container {
    aspect-ratio: 2/2.8; /* Proporção ligeiramente menos alta em telas muito pequenas */
  }
  
  .movie-overlay {
    padding: 0.5rem;
  }
  
  .movie-info {
    padding: 0.6rem;
    gap: 0.4rem;
  }
  
  .movie-title {
    font-size: 0.85rem;
  }
  
  .fav-btn {
    width: 30px;
    height: 30px;
  }
  
  .heart {
    font-size: 1rem;
  }
  
  .genre-tag, .genre-more {
    font-size: 0.6rem;
    padding: 0.15rem 0.4rem;
  }
}
</style>

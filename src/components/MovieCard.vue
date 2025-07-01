<template>
  <router-link :to="`/movies/${movie.id}`" class="movie-link">
    <div class="movie-card" :class="{ favorite }">
      <div class="movie-image-container">
        <img :src="movie.imageUrl" :alt="movie.title" class="movie-img" />
        <div class="movie-overlay">
          <div class="overlay-top">
            <span class="movie-year">{{ movie.year }}</span>
            <button class="fav-btn" @click.stop="$emit('toggle-favorite', movie)">
              <span :class="favorite ? 'heart filled' : 'heart'">♥</span>
            </button>
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
  favorite: boolean;
}>();

defineEmits(['toggle-favorite']);

const movieGenres = computed(() => {
  if (!props.movie.gender) return [];
  return Array.isArray(props.movie.gender) ? props.movie.gender : [props.movie.gender];
});
</script>

<style scoped>
.movie-card {
  background: var(--color-card);
  border-radius: 1.1rem;
  box-shadow: var(--color-shadow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  width: 100%;
  height: 100%;
  border: 1.5px solid var(--color-border);
  position: relative;
  min-width: 0;
}

@media (max-width: 700px) {
  .movie-card {
    border-radius: 0.7rem;
  }
}

@media (max-width: 400px) {
  .movie-card {
    border-radius: 0.3rem;
    min-width: 0;
  }
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.movie-image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  min-width: 0;
}

.movie-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-bottom: 1px solid var(--color-border);
  transition: transform 0.3s ease;
  min-width: 0;
}

@media (max-width: 400px) {
  .movie-img {
    border-radius: 0.3rem 0.3rem 0 0;
  }
}

.movie-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
}

@media (max-width: 400px) {
  .movie-overlay {
    padding: 0.5rem;
  }
}

.movie-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  min-width: 0;
}

@media (max-width: 700px) {
  .movie-info {
    padding: 0.7rem;
    gap: 0.4rem;
  }
}

@media (max-width: 400px) {
  .movie-info {
    padding: 0.4rem;
    gap: 0.2rem;
  }
}

.movie-info h3 {
  margin: 0;
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  color: var(--color-text);
  font-weight: 700;
  line-height: 1.3;
  min-width: 0;
  word-break: break-word;
}

.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.genre-tag {
  background: var(--color-bg-alt);
  color: var(--color-text);
  border-radius: 1rem;
  font-size: 0.85em;
  padding: 0.2em 0.7em;
  margin-bottom: 0.2em;
}

.rating-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating {
  color: var(--color-primary);
  font-weight: 700;
  font-size: 1.1em;
}

.fav-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.3rem;
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
}

.fav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.heart {
  color: rgba(255, 255, 255, 0.8);
  transition: color 0.2s;
}

.heart.filled {
  color: #e74c3c;
}

.movie-card.favorite .heart {
  color: #e74c3c;
}
</style>

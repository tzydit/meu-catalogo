<template>
  <router-link :to="`/movies/${movie.id}`" class="movie-link">
    <div class="movie-card" :class="{ favorite }">
      <div class="movie-image-container">
        <img :src="movie.imageUrl" :alt="movie.title" class="movie-img" />
        <div class="movie-overlay">
          <span class="movie-year">{{ movie.year }}</span>
          <button class="fav-btn" @click.stop="$emit('toggle-favorite', movie)">
            <span :class="favorite ? 'heart filled' : 'heart'">♥</span>
          </button>
        </div>
      </div>
      <div class="movie-info">
        <h3>{{ movie.title }}</h3>
        <div class="genre-tags">
          <span v-for="(genre, index) in movieGenres" 
                :key="index" 
                class="genre-tag">
            {{ genre }}
          </span>
        </div>
        <div class="movie-meta">
          <div class="rating-container">
            <span class="rating">⭐ {{ movie.averageRating?.toFixed(1) ?? '0.0' }}</span>
          </div>
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
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.movie-image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
}

.movie-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-bottom: 1px solid var(--color-border);
  transition: transform 0.3s ease;
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

.movie-year {
  background: var(--color-primary);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.movie-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  flex: 1;
  background: var(--color-card);
}

.movie-info h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.2rem;
}

.genre-tag {
  background: var(--color-bg-alt);
  color: var(--color-text);
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  border: 1px solid var(--color-border);
}

.movie-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.rating-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating {
  color: #ffd700;
  font-weight: bold;
  font-size: 0.95rem;
}

.fav-btn {
  background: rgba(255, 255, 255, 0.2);
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

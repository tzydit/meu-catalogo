<template>
  <div class="movie-card" :class="{ favorite }">
    <img :src="movie.imagemUrl" :alt="movie.titulo" class="movie-img" />
    <div class="movie-info">
      <h3>{{ movie.titulo }}</h3>
      <div class="movie-meta">
        <span class="rating">⭐ {{ movie.notaMedia.toFixed(1) }}</span>
        <button class="fav-btn" @click.stop="$emit('toggle-favorite', movie)">
          <span :class="favorite ? 'heart filled' : 'heart'">♥</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ movie: any, favorite: boolean }>()
defineEmits(['toggle-favorite'])
</script>

<style scoped>
.movie-card {
  background: #232323;
  border-radius: 1rem;
  box-shadow: 0 2px 12px #000a;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.15s;
  width: 220px;
}
.movie-card:hover {
  transform: translateY(-4px) scale(1.03);
}
.movie-img {
  width: 100%;
  height: 320px;
  object-fit: cover;
}
.movie-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.movie-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.rating {
  color: #ffd700;
  font-weight: bold;
}
.fav-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.3rem;
  padding: 0;
}
.heart {
  color: #888;
  transition: color 0.2s;
}
.heart.filled {
  color: #e74c3c;
}
.movie-card.favorite .heart {
  color: #e74c3c;
}
</style>

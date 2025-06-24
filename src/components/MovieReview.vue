<template>
  <div class="review">
    <div class="review-header">
      <span class="author">{{ review.autor }}</span>
      <span class="stars">{{ '★'.repeat(review.nota) + '☆'.repeat(5 - review.nota) }}</span>
    </div>
    <p class="comment">{{ review.comentario }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ review: { autor: string, comentario: string, nota: number } }>()
</script>

<style scoped>
.review {
  background: #232323;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
}
.review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.author {
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
</style>

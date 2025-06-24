<template>
  <form class="review-form" @submit.prevent="submitReview">
    <input v-model="autor" type="text" placeholder="Seu nome" required />
    <textarea v-model="comentario" placeholder="Comentário" required rows="2"></textarea>
    <div class="stars">
      <label v-for="n in 5" :key="n">
        <input type="radio" :value="n" v-model.number="nota" required />
        <span :class="n <= nota ? 'star filled' : 'star'">★</span>
      </label>
    </div>
    <button type="submit">Avaliar</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const emit = defineEmits(['submit'])
const autor = ref('')
const comentario = ref('')
const nota = ref(0)
function submitReview() {
  if (!autor.value || !comentario.value || !nota.value) return
  emit('submit', { autor: autor.value, comentario: comentario.value, nota: nota.value })
  autor.value = ''
  comentario.value = ''
  nota.value = 0
}
</script>

<style scoped>
.review-form {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  background: #232323;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}
input, textarea {
  background: #292929;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.6rem 1rem;
  font-size: 1rem;
}
.stars {
  display: flex;
  gap: 0.3rem;
}
.star {
  color: #888;
  font-size: 1.3rem;
  cursor: pointer;
}
.star.filled {
  color: #ffd700;
}
button {
  background: #000;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.7rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
}
button:hover {
  background: #222;
}
</style>

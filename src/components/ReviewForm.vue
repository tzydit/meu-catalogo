<template>
  <form class="review-form" @submit.prevent="submitReview">
    <div v-if="username" class="review-user">Avaliação como <b>{{ username }}</b></div>
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
const comentario = ref('')
const nota = ref(0)
const username = localStorage.getItem('username') || ''

function submitReview() {
  if (!username) {
    alert('Você precisa estar logado para avaliar!');
    return;
  }
  if (!comentario.value || !nota.value) return
  emit('submit', { autor: username, comentario: comentario.value, nota: nota.value })
  comentario.value = ''
  nota.value = 0
}
</script>

<style scoped>
.review-form {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  background: #f7f7f7;
  border-radius: 0.75rem;
  padding: 1.2rem 1rem 1rem 1rem;
  margin-bottom: 1.5rem;
  border: 1.5px solid #e0e0e0;
}
.review-user {
  color: #232323;
  font-size: 1rem;
  margin-bottom: 0.2rem;
}
input, textarea {
  background: #fff;
  color: #232323;
  border: 1.5px solid #e0e0e0;
  border-radius: 0.5rem;
  padding: 0.6rem 1rem;
  font-size: 1rem;
}
.stars {
  display: flex;
  gap: 0.3rem;
}
.star {
  color: #bbb;
  font-size: 1.3rem;
  cursor: pointer;
  transition: color 0.2s;
}
.star.filled {
  color: #ffd700;
}
button {
  background: linear-gradient(90deg, #e74c3c 60%, #ff7675 100%);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
  font-weight: 700;
  transition: background 0.2s;
}
button:hover {
  background: linear-gradient(90deg, #c0392b 60%, #ff7675 100%);
}
</style>

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
  gap: 1rem;
  background: #ffffff;
  border-radius: 1.2rem;
  padding: 1.5rem;
  margin-bottom: 1.8rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #edf2f7;
  max-width: 100%;
}

.review-form:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.review-user {
  color: #2d3748;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.review-user b {
  color: #2d3748;
  font-weight: 600;
}

textarea {
  width: calc(100% - 2rem);
  padding: 0.8rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.8rem;
  resize: none;
  height: 120px;
  font-family: inherit;
  font-size: 1rem;
  color: #4a5568;
  transition: all 0.2s ease;
  background: #fff;
  margin: 0 1rem;
}

textarea:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.stars {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.stars label {
  cursor: pointer;
  padding: 0.2rem;
}

.stars input[type="radio"] {
  display: none;
}

.star {
  color: #cbd5e0;
  font-size: 1.8rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.star.filled,
.stars label:hover .star,
.stars label:hover ~ label .star {
  color: #eab308;
}

button {
  align-self: flex-end;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 0.8rem;
  padding: 0.8rem 1.8rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

button:hover {
  background: #3182ce;
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

@media (max-width: 640px) {
  .review-form {
    padding: 1.2rem;
  }
  
  button {
    width: 100%;
    margin-top: 0.5rem;
  }
}
</style>

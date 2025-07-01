<template>
  <div class="genre-filter">
    <h4 class="filter-title">Filtrar por Gênero:</h4>
    <div class="genre-options">
      <label v-for="genre in genres" :key="genre" class="genre-option" :class="{ active: selectedGenres.includes(genre) }">
        <input type="checkbox" :value="genre" v-model="selectedGenres" @change="updateSelection" />
        <span class="genre-text">{{ genre }}</span>
      </label>
      <button v-if="selectedGenres.length > 0" @click="clearAll" class="clear-btn">
        Limpar Filtros
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps<{ 
  genres: string[], 
  modelValue: string[] 
}>()

const emit = defineEmits(['update:modelValue'])
const selectedGenres = ref([...props.modelValue])

function updateSelection() {
  console.log('Gêneros selecionados no componente:', selectedGenres.value)
  emit('update:modelValue', selectedGenres.value)
}

function clearAll() {
  selectedGenres.value = []
  console.log('Filtros limpos')
  emit('update:modelValue', selectedGenres.value)
}

watch(() => props.modelValue, (val) => { 
  selectedGenres.value = [...val] 
}, { immediate: true })
</script>

<style scoped>
.genre-filter {
  width: 100%;
  margin-bottom: 1.5rem;
}

.filter-title {
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  margin-top: 0;
}

.genre-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.genre-option {
  background: var(--color-bg-alt);
  color: var(--color-text);
  border: 2px solid var(--color-border);
  border-radius: 0.8rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  position: relative;
  overflow: hidden;
}

.genre-option:hover {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  transform: translateY(-1px);
}

.genre-option.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.genre-option input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.genre-text {
  font-weight: 500;
  letter-spacing: 0.2px;
}

.clear-btn {
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 0.8rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: #c0392b;
  transform: translateY(-1px);
}

@media (max-width: 600px) {
  .genre-options {
    gap: 0.4rem;
  }
  
  .genre-option {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
    border-radius: 0.6rem;
  }
  
  .clear-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
    border-radius: 0.6rem;
  }
  
  .filter-title {
    font-size: 0.9rem;
  }
}
</style>

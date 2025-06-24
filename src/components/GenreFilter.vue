<template>
  <div class="genre-filter">
    <label v-for="genre in genres" :key="genre" class="genre-option">
      <input type="checkbox" :value="genre" v-model="selectedGenres" @change="$emit('update:selectedGenres', selectedGenres)" />
      {{ genre }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
const props = defineProps<{ genres: string[], modelValue: string[] }>()
const emit = defineEmits(['update:selectedGenres'])
const selectedGenres = ref([...props.modelValue])
watch(() => props.modelValue, (val) => { selectedGenres.value = [...val] })
</script>

<style scoped>
.genre-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.genre-option {
  background: #232323;
  color: #fff;
  border-radius: 0.75rem;
  padding: 0.4rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  user-select: none;
}
input[type="checkbox"] {
  accent-color: #e74c3c;
  margin-right: 0.5em;
}
</style>

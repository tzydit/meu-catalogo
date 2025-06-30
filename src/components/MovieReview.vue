<template>
  <div class="review" :class="{ 'own-review': isOwnReview }">
    <div class="review-header">
      <div class="review-user-stars">
        <span class="author">{{ review.autor }}</span>
        <span class="stars">{{ '★'.repeat(review.nota) + '☆'.repeat(5 - review.nota) }}</span>
        <span v-if="review.editado" class="edited">(editado)</span>
      </div>
      <div v-if="isOwnReview" class="review-actions">
        <button class="edit-btn" @click="editMode = !editMode">{{ editMode ? 'Cancelar' : 'Editar' }}</button>
        <button class="delete-btn" @click="emitDelete">Excluir</button>
      </div>
    </div>
    <template v-if="editMode">
      <form class="edit-form" @submit.prevent="emitEdit">
        <textarea v-model="editComentario" required rows="2"></textarea>
        <div class="stars">
          <label v-for="n in 5" :key="n">
            <input type="radio" :value="n" v-model.number="editNota" required />
            <span :class="n <= editNota ? 'star filled' : 'star'">★</span>
          </label>
        </div>
        <button type="submit">Salvar</button>
      </form>
    </template>
    <p v-else class="comment">{{ review.comentario }}</p>

    <!-- Comentários de outros usuários -->
    <div class="comments-section">
      <button v-if="username" class="show-comment-btn" @click="showCommentInput = !showCommentInput">
        {{ showCommentInput ? 'Cancelar' : 'Comentar' }}
      </button>
      <form v-if="showCommentInput && username" class="add-comment-form" @submit.prevent="addComment">
        <input v-model="novoComentario" placeholder="Digite seu comentário..." maxlength="200" required />
        <button type="submit">Enviar</button>
      </form>
      <div v-if="!username" class="login-hint">Faça login para comentar nesta avaliação.</div>
      <div class="comments-list">
        <div class="comments-title" v-if="review.comentarios && review.comentarios.length">Comentários:</div>
        <div v-if="review.comentarios && review.comentarios.length">
          <div v-for="coment in review.comentarios" :key="coment.id" class="comment-item">
            <span class="comment-author">{{ coment.autor }}</span>
            <span class="comment-text" v-if="!coment.editMode">{{ coment.texto }}</span>
            <form v-else class="edit-comment-form" @submit.prevent="saveCommentEdit(coment)">
              <input v-model="coment.editText" maxlength="200" required />
              <button type="submit">Salvar</button>
              <button type="button" @click="coment.editMode = false">Cancelar</button>
            </form>
            <div v-if="canEditOrDeleteComment(coment)" class="comment-actions">
              <button class="edit-btn" v-if="!coment.editMode" @click="enableCommentEdit(coment)" title="Editar">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="#e67e22" d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm17.71-10.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
              </button>
              <button class="delete-btn" @click="deleteComment(coment)" title="Excluir">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="#e74c3c" d="M3 6h18v2H3V6zm2 3h14l-1.5 14h-11L5 9zm3 2v8h2v-8H8zm4 0v8h2v-8h-2z"/></svg>
              </button>
            </div>
          </div>
        </div>
        <div v-else class="no-comments">Nenhum comentário ainda.</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const props = defineProps<{ review: any }>();
const emit = defineEmits(['edit-review', 'delete-review', 'add-comment', 'edit-comment', 'delete-comment']);
const username = localStorage.getItem('username') || ''
const isOwnReview = props.review.autor === username
const editMode = ref(false)
const editComentario = ref(props.review.comentario)
const editNota = ref(props.review.nota)
const novoComentario = ref('')
const showCommentInput = ref(false)
const admin = computed(() => {
  const token = localStorage.getItem('token')
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return (payload.roles && payload.roles.includes('ADMIN')) || (payload.authorities && payload.authorities.includes('ROLE_ADMIN'))
  } catch { return false }
})

function emitEdit() {
  if (!editComentario.value || !editNota.value) return
  emit('edit-review', {
    ...props.review,
    comentario: editComentario.value,
    nota: editNota.value
  }, () => {
    editMode.value = false
  })
}
function emitDelete() {
  if (confirm('Tem certeza que deseja excluir esta avaliação?')) {
    emit('delete-review', props.review)
  }
}
function addComment() {
  if (!novoComentario.value.trim()) return
  emit('add-comment', {
    reviewId: props.review.id || props.review._id,
    texto: novoComentario.value,
    autor: username
  }, () => {
    novoComentario.value = ''
    showCommentInput.value = false
  })
}
function canEditOrDeleteComment(coment: any) {
  const commentId = coment.id || coment._id
  // Exibe para o autor OU para admin autenticado
  return ((admin.value || coment.autor === username) && !!commentId)
}
function enableCommentEdit(coment: any) {
  const commentId = coment.id || coment._id
  // Só permite editar se for autor ou admin
  if ((coment.autor === username || admin.value) && commentId) {
    coment.editMode = true
    coment.editText = coment.texto
  }
}
async function saveCommentEdit(coment: any) {
  const commentId = coment.id || coment._id
  if (!commentId) {
    alert('Comentário inválido. Não é possível editar.')
    return
  }
  try {
    emit('edit-comment', {
      commentId,
      texto: coment.editText
    }, (errMsg?: string) => {
      if (!errMsg) coment.editMode = false
      if (errMsg) alert(errMsg)
    })
  } catch {
    alert('Erro ao editar comentário.')
  }
}
async function deleteComment(coment: any) {
  const commentId = coment.id || coment._id
  if (!commentId) {
    alert('Comentário inválido. Não é possível excluir.')
    return
  }
  if (!confirm('Tem certeza que deseja excluir este comentário?')) return
  try {
    emit('delete-comment', {
      commentId
    }, (errMsg?: string) => {
      if (errMsg) alert(errMsg)
    })
  } catch {
    alert('Erro ao excluir comentário.')
  }
}
</script>

<style scoped>
.review {
  background: #fff;
  border-radius: 1.1rem;
  padding: 1.3rem 1.2rem 1.1rem 1.2rem;
  margin-bottom: 1.5rem;
  border: 1.5px solid #e0e0e0;
  box-shadow: 0 2px 10px #0001;
  transition: box-shadow 0.2s;
}
.own-review {
  border: 2px solid #e74c3c;
  background: #fff7f7;
}
.review-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.7rem;
  gap: 0.7rem;
}
.review-user-stars {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.author {
  color: #e74c3c;
  font-weight: 700;
  font-size: 1.08rem;
}
.stars {
  color: #ffd700;
  font-size: 1.15rem;
  font-weight: 700;
  margin-left: 0.1rem;
}
.edited {
  color: #888;
  font-size: 0.97rem;
  margin-left: 0.5rem;
}
.review-actions {
  display: flex;
  gap: 0.5rem;
}
.edit-btn, .delete-btn {
  background: none;
  border: none;
  color: #e74c3c;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.95rem;
  padding: 0.1rem 0.5rem;
  border-radius: 0.4rem;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.edit-btn svg {
  margin-right: 0;
}
.delete-btn svg {
  margin-right: 0;
}
.edit-btn:hover, .delete-btn:hover {
  background: #ffeaea;
}
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-bottom: 0.5rem;
}
.edit-form textarea {
  background: #fff;
  color: #232323;
  border: 1.5px solid #e0e0e0;
  border-radius: 0.5rem;
  padding: 0.6rem 1rem;
  font-size: 1rem;
}
.edit-form .stars {
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
.edit-form button {
  background: linear-gradient(90deg, #e74c3c 60%, #ff7675 100%);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 700;
  transition: background 0.2s;
}
.edit-form button:hover {
  background: linear-gradient(90deg, #c0392b 60%, #ff7675 100%);
}
.comment {
  color: #232323;
  margin: 0 0 0.7rem 0;
  font-size: 1.13rem;
  line-height: 1.6;
}
.comments-section {
  margin-top: 0.7rem;
  background: #f7f7f7;
  border-radius: 0.7rem;
  padding: 0.9rem 1.1rem 0.7rem 1.1rem;
  border: 1.5px solid #e0e0e0;
  text-align: left;
  box-shadow: 0 1.5px 6px #0001;
}
.comments-title {
  color: #e74c3c;
  font-weight: 700;
  font-size: 1.08rem;
  margin-bottom: 0.5rem;
  letter-spacing: 0.5px;
}
.comment-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 1.01rem;
  background: #fff;
  border-radius: 0.5rem;
  padding: 0.5rem 0.8rem;
  border: 1.2px solid #e0e0e0;
  box-shadow: 0 1px 4px #e74c3c11;
  transition: box-shadow 0.2s;
}
.comment-item:hover {
  box-shadow: 0 2px 12px #e74c3c22;
}
.comment-author {
  color: #e74c3c;
  font-weight: 600;
  margin-right: 0.3rem;
}
.comment-text {
  color: #232323;
  flex: 1;
}
.no-comments {
  color: #888;
  font-size: 0.97rem;
  margin-top: 0.2rem;
}
.show-comment-btn {
  background: linear-gradient(90deg, #e74c3c 60%, #ff7675 100%);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.1rem;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 700;
  margin-bottom: 0.6rem;
  transition: background 0.2s;
}
.show-comment-btn:hover {
  background: linear-gradient(90deg, #c0392b 60%, #ff7675 100%);
}
.add-comment-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.7rem;
}
.add-comment-form input {
  flex: 1;
  background: #fff;
  color: #232323;
  border: 1.2px solid #e0e0e0;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
}
.add-comment-form button {
  background: linear-gradient(90deg, #e74c3c 60%, #ff7675 100%);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.1rem;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 700;
  transition: background 0.2s;
}
.add-comment-form button:hover {
  background: linear-gradient(90deg, #c0392b 60%, #ff7675 100%);
}
.edit-comment-form {
  display: flex;
  gap: 0.4rem;
  margin-left: 0.5rem;
}
.edit-comment-form input {
  background: #fff;
  color: #232323;
  border: 1.2px solid #e0e0e0;
  border-radius: 0.5rem;
  padding: 0.3rem 0.7rem;
  font-size: 1rem;
}
.edit-comment-form button {
  background: linear-gradient(90deg, #e74c3c 60%, #ff7675 100%);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.3rem 0.9rem;
  font-size: 0.95rem;
  cursor: pointer;
  font-weight: 700;
  transition: background 0.2s;
}
.edit-comment-form button[type="button"] {
  background: #bbb;
  color: #fff;
}
.edit-comment-form button:hover {
  background: linear-gradient(90deg, #c0392b 60%, #ff7675 100%);
}
.login-hint {
  color: #888;
  font-size: 0.97rem;
  margin-top: 0.5rem;
  text-align: left;
}
</style>

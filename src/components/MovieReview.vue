<template>
  <div class="review" :class="{ 'own-review': isOwnReview }">
    <div class="review-header">
      <div class="review-user-stars">
        <span class="author">{{ review.autor }}</span>
        <span class="stars">{{ '★'.repeat(review.nota) + '☆'.repeat(5 - review.nota) }}</span>
        <span v-if="review.editado" class="edited">editado</span>
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
              <div class="buttons-container">
                <button type="submit">Salvar</button>
                <button type="button" @click="coment.editMode = false">Cancelar</button>
              </div>
            </form>
            <div v-if="canEditOrDeleteComment(coment)" class="comment-actions" :data-admin="isAdminDeleting(coment)">
              <button class="edit-btn" v-if="!coment.editMode" @click="enableCommentEdit(coment)" title="Editar">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="#4299e1" d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm17.71-10.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
              </button>
              <button class="delete-btn" @click="deleteComment(coment)" title="Excluir">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="#e53e3e" d="M3 6h18v2H3V6zm2 3h14l-1.5 14h-11L5 9zm3 2v8h2v-8H8zm4 0v8h2v-8h-2z"/></svg>
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
import Swal from 'sweetalert2'
const props = defineProps<{ review: any }>();
const emit = defineEmits(['edit-review', 'delete-review', 'add-comment', 'edit-comment', 'delete-comment']);
const username = localStorage.getItem('username') || ''
const isOwnReview = props.review.autor === username
const editMode = ref(false)
const editComentario = ref(props.review.comentario)
const editNota = ref(props.review.nota)
const novoComentario = ref('')
const showCommentInput = ref(false)
const isAdmin = computed(() => {
  const token = localStorage.getItem('token')
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return (
      (payload.roles && (payload.roles.includes('ADMIN') || payload.roles.includes('ROLE_ADMIN'))) ||
      (payload.authorities && (payload.authorities.includes('ADMIN') || payload.authorities.includes('ROLE_ADMIN'))) ||
      payload.role === 'ADMIN' ||
      payload.role === 'ROLE_ADMIN'
    )
  } catch (e) {
    console.error('Erro ao verificar permissões:', e)
    return false
  }
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
async function emitDelete() {
  const result = await Swal.fire({
    title: 'Excluir avaliação?',
    text: 'Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    customClass: {
      popup: 'swal-popup',
      title: 'swal-title',
      confirmButton: 'swal-confirm-btn',
      cancelButton: 'swal-cancel-btn'
    }
  });

  if (result.isConfirmed) {
    emit('delete-review', props.review)
    
    // Mostrar sucesso
    Swal.fire({
      title: 'Excluída!',
      text: 'Sua avaliação foi excluída com sucesso.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      customClass: {
        popup: 'swal-popup',
        title: 'swal-title'
      }
    });
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
  const commentId = coment.id || coment._id;
  if (!commentId) return false;
  
  // Permite excluir se for admin ou o próprio autor
  if (isAdmin.value) return true;
  
  // Permite editar/excluir se for o autor do comentário
  return coment.autor === username;
}

function enableCommentEdit(coment: any) {
  const commentId = coment.id || coment._id;
  if (!commentId) return;
  
  // Apenas o autor pode editar seu próprio comentário
  if (coment.autor === username) {
    coment.editMode = true;
    coment.editText = coment.texto;
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
  const commentId = coment.id || coment._id;
  if (!commentId) {
    Swal.fire({
      title: 'Erro!',
      text: 'Comentário inválido. Não é possível excluir.',
      icon: 'error',
      confirmButtonColor: '#e74c3c',
      customClass: {
        popup: 'swal-popup',
        title: 'swal-title',
        confirmButton: 'swal-confirm-btn'
      }
    });
    return;
  }

  // Mensagem diferente para admins
  const isAdminDeleting = isAdmin.value && coment.autor !== username;
  const title = isAdminDeleting ? 'Excluir comentário de usuário?' : 'Excluir seu comentário?';
  const text = isAdminDeleting
    ? `Tem certeza que deseja excluir o comentário do usuário "${coment.autor}"?`
    : 'Tem certeza que deseja excluir seu comentário?';

  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    customClass: {
      popup: 'swal-popup',
      title: 'swal-title',
      confirmButton: 'swal-confirm-btn',
      cancelButton: 'swal-cancel-btn'
    }
  });

  if (!result.isConfirmed) return;

  try {
    emit('delete-comment', {
      commentId,
      isAdminAction: isAdminDeleting
    }, (errMsg?: string) => {
      if (errMsg) {
        Swal.fire({
          title: 'Erro!',
          text: errMsg,
          icon: 'error',
          confirmButtonColor: '#e74c3c',
          customClass: {
            popup: 'swal-popup',
            title: 'swal-title',
            confirmButton: 'swal-confirm-btn'
          }
        });
      } else {
        // Mostrar sucesso
        Swal.fire({
          title: 'Excluído!',
          text: 'Comentário excluído com sucesso.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'swal-popup',
            title: 'swal-title'
          }
        });
      }
    });
  } catch (error) {
    console.error('Erro ao excluir comentário:', error);
    Swal.fire({
      title: 'Erro!',
      text: 'Erro ao excluir comentário. Tente novamente.',
      icon: 'error',
      confirmButtonColor: '#e74c3c',
      customClass: {
        popup: 'swal-popup',
        title: 'swal-title',
        confirmButton: 'swal-confirm-btn'
      }
    });
  }
}

// Função para verificar se é uma ação de admin em comentário de outro usuário
function isAdminDeleting(coment: any): boolean {
  return isAdmin.value && coment.autor !== username;
}
</script>

<style scoped>
.review {
  background: #ffffff;
  border-radius: 0.8rem;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #edf2f7;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #edf2f7;
}

.review-user-stars {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.author {
  font-weight: 600;
  color: #2d3748;
  font-size: 1rem;
}

.stars {
  color: #eab308;
  letter-spacing: 0.05em;
}

.edited {
  font-size: 0.85rem;
  color: #718096;
  font-style: italic;
  background-color: #f7fafc;
  padding: 0.2rem 0.6rem;
  border-radius: 0.6rem;
  margin-left: 0.5rem;
  border: 1px solid #e2e8f0;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.edited::before {
  content: "✎";
  font-style: normal;
  font-size: 0.9rem;
  color: #4299e1;
}

.comment {
  color: #4a5568;
  line-height: 1.5;
  margin: 0.8rem 1rem;
  white-space: pre-line;
  text-align: left;
  width: calc(100% - 2rem);
  box-sizing: border-box;
}

.review-actions {
  display: flex;
  gap: 0.6rem;
}

.edit-btn, .delete-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.6rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn {
  background: #edf2f7;
  color: #4a5568;
  border: none;
}

.edit-btn:hover {
  background: #e2e8f0;
}

.delete-btn {
  background: #fff;
  color: #e53e3e;
  border: 1px solid #e53e3e;
}

.delete-btn:hover {
  background: #fff5f5;
}

/* Formulário de edição de review */
.edit-form {
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 0.6rem;
  border: 1px solid #e2e8f0;
  width: calc(100% - 2rem);
  margin-left: 1rem;
  margin-right: 1rem;
  box-sizing: border-box;
}

.edit-form textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.6rem;
  resize: none;
  height: 100px;
  font-family: inherit;
  font-size: 1rem;
  color: #4a5568;
  background: #fff;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.edit-form textarea:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.1);
}

.edit-form .stars {
  display: flex;
  gap: 0.3rem;
  padding: 0.5rem 0;
}

.edit-form .stars label {
  cursor: pointer;
}

.edit-form .stars input[type="radio"] {
  display: none;
}

.edit-form .star {
  color: #cbd5e0;
  font-size: 1.5rem;
  transition: color 0.2s ease;
}

.edit-form .star.filled,
.edit-form .stars label:hover .star,
.edit-form .stars label:hover ~ label .star {
  color: #eab308;
}

.edit-form button {
  align-self: flex-end;
  padding: 0.6rem 1.2rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 0.6rem;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-form button:hover {
  background: #3182ce;
  transform: translateY(-1px);
}

.edit-form button:active {
  transform: translateY(0);
}

/* Comentários */
.comments-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #edf2f7;
}

.comment-item {
  display: flex;
  align-items: flex-start;
  padding: 0.8rem 1rem;
  margin: 0.5rem 0;
  background: #f8fafc;
  border-radius: 0.6rem;
  position: relative;
  border: 1px solid #e2e8f0;
}

.comment-author {
  font-weight: 600;
  color: #2d3748;
  margin-right: 0.8rem;
  min-width: fit-content;
}

.comment-text {
  color: #4a5568;
  flex: 1;
  margin-right: 2.5rem;
  text-align: left;
}

.comment-actions {
  position: absolute;
  right: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 0.4rem;
  z-index: 1;
}

/* Formulário de edição de comentário */
.edit-comment-form {
  display: flex;
  gap: 0.8rem;
  width: 100%;
  margin: 0.5rem 0;
  align-items: center;
  position: relative;
  padding-right: 3rem;
}

.edit-comment-form input {
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.6rem;
  font-size: 0.95rem;
  color: #4a5568;
  background: #fff;
  transition: all 0.2s ease;
}

.edit-comment-form input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.1);
}

.edit-comment-form .buttons-container {
  display: flex;
  gap: 0.4rem;
  margin-left: auto;
}

.edit-comment-form button {
  padding: 0.6rem 1rem;
  border-radius: 0.6rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.edit-comment-form button[type="submit"] {
  background: #4299e1;
  color: white;
  border: none;
}

.edit-comment-form button[type="submit"]:hover {
  background: #3182ce;
}

.edit-comment-form button[type="button"] {
  background: #edf2f7;
  color: #4a5568;
  border: none;
}

.edit-comment-form button[type="button"]:hover {
  background: #e2e8f0;
}

/* Formulário de adicionar comentário */
.add-comment-form {
  margin: 0.8rem 0;
  display: flex;
  gap: 0.6rem;
}

.add-comment-form input {
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.6rem;
  font-size: 0.95rem;
  color: #4a5568;
  transition: all 0.2s ease;
}

.add-comment-form input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.1);
}

.show-comment-btn {
  background: #4299e1;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 0.6rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.show-comment-btn:hover {
  background: #3182ce;
}

.login-hint {
  text-align: center;
  color: #718096;
  padding: 0.8rem;
  background: #f7fafc;
  border-radius: 0.6rem;
  border: 1px solid #e2e8f0;
}

@media (max-width: 640px) {
  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }

  .review-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .comment-item {
    flex-direction: column;
    gap: 0.4rem;
  }

  .comment-actions {
    position: static;
    transform: none;
    margin-top: 0.5rem;
  }

  .edit-comment-form,
  .add-comment-form {
    flex-direction: column;
  }

  .edit-comment-form button,
  .add-comment-form button {
    width: 100%;
  }
}

/* Estilos customizados para SweetAlert2 - Reviews e Comentários */
:global(.swal-popup) {
  border-radius: 1.2rem !important;
  padding: 2rem !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2) !important;
  border: 1px solid var(--color-border) !important;
  background: var(--color-card) !important;
}

:global(.swal-title) {
  color: var(--color-text) !important;
  font-weight: 700 !important;
  font-size: 1.5rem !important;
  margin-bottom: 1rem !important;
}

:global(.swal2-html-container) {
  color: var(--color-text-light) !important;
  font-size: 1.1rem !important;
  line-height: 1.5 !important;
}

:global(.swal-confirm-btn) {
  background: linear-gradient(135deg, #e74c3c, #c0392b) !important;
  border: none !important;
  border-radius: 0.8rem !important;
  padding: 0.8rem 1.5rem !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}

:global(.swal-confirm-btn:hover) {
  background: linear-gradient(135deg, #c0392b, #a93226) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4) !important;
}

:global(.swal-cancel-btn) {
  background: var(--color-bg-alt) !important;
  color: var(--color-text) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: 0.8rem !important;
  padding: 0.8rem 1.5rem !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}

:global(.swal-cancel-btn:hover) {
  background: var(--color-border) !important;
  transform: translateY(-2px) !important;
}

:global(.swal2-icon.swal2-warning) {
  border-color: #f39c12 !important;
  color: #f39c12 !important;
}

:global(.swal2-icon.swal2-success) {
  border-color: #28a745 !important;
  color: #28a745 !important;
}

:global(.swal2-icon.swal2-error) {
  border-color: #e74c3c !important;
  color: #e74c3c !important;
}
</style>

import api from '../api/axios';
import { getAuthHeader } from './jwtHelper';

interface Review {
  id: string;
  movieId: string;
  text: string;
  rating: number;
  createdAt: string;
  movieTitle?: string;
}

interface FavoriteMovie {
  movieId: string;
  title: string;
  imageUrl: string;
  year: number;
}

/**
 * Lista as reviews do usuário
 */
export async function getUserReviews(username: string): Promise<Review[]> {
  const response = await api.get(`/api/users/${username}/reviews`, {
    headers: getAuthHeader()
  });
  return response.data;
}

/**
 * Lista os favoritos do usuário
 */
export async function getUserFavorites(username: string): Promise<FavoriteMovie[]> {
  const response = await api.get(`/api/users/${username}/favorites`);
  return response.data;
}

/**
 * Adiciona/Remove um filme dos favoritos
 */
export async function toggleFavorite(movieId: string): Promise<void> {
  await api.post(`/api/users/favorites/${movieId}`, {}, {
    headers: getAuthHeader()
  });
}

/**
 * Remove explicitamente um filme dos favoritos
 */
export async function removeFavorite(movieId: string): Promise<void> {
  await api.delete(`/api/users/favorites/${movieId}`, {
    headers: getAuthHeader()
  });
}

/**
 * Verifica se um filme está nos favoritos
 */
export function isFavorite(movieId: string, favorites: FavoriteMovie[]): boolean {
  return favorites.some(fav => fav.movieId === movieId);
}

export interface Movie {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  year: number;
  gender: string | string[];
  trailerUrl?: string;
  averageRating?: number;
}

export interface MovieFormData {
  title: string;
  description: string;
  imageUrl: string;
  year: number;
  gender: string[];
  trailerUrl?: string;
}

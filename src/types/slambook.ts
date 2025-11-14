export interface SlamBookEntry {
  id: string;
  name: string;
  nickname: string;
  birthday: string;
  contactNumber: string;
  likes: string;
  dislikes: string;
  favoriteMovie: string;
  favoriteFood: string;
  about: string;
  message: string;
  tags?: string[];
  isFavorite?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface EntryStatistics {
  total: number;
  favorites: number;
  byTag: Record<string, number>;
}

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { KOPISPerformance } from '@/types';

interface FavoritesState {
  favorites: KOPISPerformance[];
  addFavorite: (performance: KOPISPerformance) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (performance: KOPISPerformance) => void;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (performance) => 
        set((state) => ({ favorites: [...state.favorites, performance] })),
      removeFavorite: (id) => 
        set((state) => ({ favorites: state.favorites.filter((f) => f.id !== id) })),
      isFavorite: (id) => 
        get().favorites.some((f) => f.id === id),
      toggleFavorite: (performance) => {
        const isFav = get().isFavorite(performance.id);
        if (isFav) {
          get().removeFavorite(performance.id);
        } else {
          get().addFavorite(performance);
        }
      },
    }),
    {
      name: 'kopis-favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SearchFilters } from "@/types";

// ─── Search Store ──────────────────────────────────────────────────────────────
interface SearchState {
  filters: SearchFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

const defaultFilters: SearchFilters = {
  sortBy: "rating",
  page: 1,
  limit: 12,
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      filters: defaultFilters,
      setFilters: (newFilters) =>
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
      resetFilters: () => set({ filters: defaultFilters }),
      recentSearches: [],
      addRecentSearch: (query) =>
        set((state) => ({
          recentSearches: [
            query,
            ...state.recentSearches.filter((s) => s !== query),
          ].slice(0, 8),
        })),
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: "staynest-search",
      partialize: (state) => ({
        recentSearches: state.recentSearches,
      }),
    }
  )
);

// ─── Favorites Store ──────────────────────────────────────────────────────────
interface FavoritesState {
  favoriteIds: string[];
  addFavorite: (pgId: string) => void;
  removeFavorite: (pgId: string) => void;
  toggleFavorite: (pgId: string) => void;
  isFavorite: (pgId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      addFavorite: (pgId) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(pgId)
            ? state.favoriteIds
            : [...state.favoriteIds, pgId],
        })),
      removeFavorite: (pgId) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((id) => id !== pgId),
        })),
      toggleFavorite: (pgId) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(pgId)) {
          removeFavorite(pgId);
        } else {
          addFavorite(pgId);
        }
      },
      isFavorite: (pgId) => get().favoriteIds.includes(pgId),
    }),
    {
      name: "staynest-favorites",
    }
  )
);

// ─── UI Store ──────────────────────────────────────────────────────────────────
interface UIState {
  theme: "light" | "dark";
  toggleTheme: () => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  duration?: number;
}

export const useUIStore = create<UIState>((set) => ({
  theme: "light",
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
  mobileNavOpen: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).slice(2);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, toast.duration || 5000);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

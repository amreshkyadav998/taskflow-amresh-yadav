import { create } from "zustand";
import type { User } from "@/types";
import {
  getToken,
  setToken,
  getStoredUser,
  setStoredUser,
  clearAuth,
} from "@/lib/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (token: string, user: User) => {
    setToken(token);
    setStoredUser(user);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    clearAuth();
    set({ user: null, token: null, isAuthenticated: false });
  },

  hydrate: () => {
    const token = getToken();
    const user = getStoredUser();
    if (token && user) {
      set({ user, token, isAuthenticated: true });
    } else {
      clearAuth();
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));

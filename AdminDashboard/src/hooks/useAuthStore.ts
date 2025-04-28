import { create } from "zustand";

interface AuthStore {
  username: string | null;
  setUsername: (username: string) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  username: null,
  setUsername: (username) => set({ username }),
}));

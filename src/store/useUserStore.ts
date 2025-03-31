
import { create } from 'zustand';

type User = {
  id: string;
  email: string;
  nome_completo?: string;
  coordenacao_id?: string;
  status_conta?: string;
};

type UserState = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

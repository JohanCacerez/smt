import { create } from "zustand";

// Interfaz que define la estructura del usuario en el sistema
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Interfaz para el estado y acciones del store
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Estado inicial simulado para desarrollo
  user: {
    id: "u-101",
    name: "Johan Cacerez",
    email: "caj3cea@bosch.com",
    role: "Supervisor de Mantenimiento",
  },
  isAuthenticated: true,

  // Métodos de autenticación con tipado explícito
  login: (userData: User) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

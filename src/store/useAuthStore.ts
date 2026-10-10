import { create } from "zustand";
import { persist } from "zustand/middleware";

// Definimos la estructura del perfil detallado del usuario que viene de la base de datos
interface UserProfile {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  role_id: number;
  role_name: string; // Guardamos directamente el nombre del rol (admin, tecnico, etc.)
}

interface AuthState {
  user: UserProfile | null;
  sessionToken: string | null;
  isAuthenticated: boolean;
  login: (user: UserProfile, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      sessionToken: null,
      isAuthenticated: false,

      // Función para iniciar sesión y almacenar los datos
      login: (user, token) =>
        set({
          user,
          sessionToken: token,
          isAuthenticated: true,
        }),

      // Función para cerrar sesión y limpiar todo
      logout: () =>
        set({
          user: null,
          sessionToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage", // Nombre de la clave en LocalStorage
    },
  ),
);

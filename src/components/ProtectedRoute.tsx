import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore"; // Ajusta la ruta a tu store

interface ProtectedRouteProps {
  allowedRoles?: number[]; // Lista de IDs de roles permitidos para acceder (ej: [4] para Admin)
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();

  // 1. Si no está autenticado, redirigir al Login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si el usuario está inactivo, bloquear el acceso por completo
  if (!user.is_active) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si se especifican roles permitidos y el rol del usuario no está en la lista
  if (allowedRoles && !allowedRoles.includes(user.role_id)) {
    // Redirige al dashboard o a una página de acceso no autorizado
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Si pasa todas las validaciones, renderiza las rutas hijas (Outlet)
  return <Outlet />;
};

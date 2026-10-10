import "bootstrap/dist/css/bootstrap.min.css";

// 1. Importamos los componentes de React Router
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Home } from "./pages/Home";
import { AllUsers } from "./pages/Users/AllUsers";
import { Login } from "./pages/Login";

// 2. Importamos los componentes de protección de rutas
import { ProtectedRoute } from "./components/ProtectedRoute"; // Ajusta la ruta si es necesario
import { Unauthorized } from "./pages/Unauthorized"; // Crea esta página en tu carpeta /pages o déjala inline

// Simulación de páginas/componentes para las nuevas rutas
const Dashboard = () => (
  <div className="container mt-4">
    <h2>Dashboard de SMT</h2>
    <p>Bienvenido al panel de control.</p>
  </div>
);
const Lineas = () => (
  <div className="container mt-4">
    <h2>Líneas de Producción</h2>
    <p>Estado de las líneas SMT.</p>
  </div>
);
const Procesos = () => (
  <div className="container mt-4">
    <h2>Flujos y Procesos</h2>
    <p>Administración de procesos de manufactura.</p>
  </div>
);
const Tickets = () => (
  <div className="container mt-4">
    <h2>Mantenimiento y Tickets</h2>
    <p>Historial de fallas y reportes.</p>
  </div>
);
const Equipo = () => (
  <div className="container mt-4">
    <h2>Gestión de Equipo</h2>
    <p>Miembros del equipo de mantenimiento.</p>
  </div>
);
const Configuracion = () => (
  <div className="container mt-4">
    <h2>Configuración del Sistema</h2>
    <p>Ajustes generales.</p>
  </div>
);
const Perfil = () => (
  <div className="container mt-4">
    <h2>Perfil de Usuario</h2>
    <p>Configuración de cuenta del supervisor.</p>
  </div>
);

function App() {
  return (
    // Envolvemos toda la aplicación en el BrowserRouter
    <BrowserRouter>
      <div className="app-container">
        {/* La barra de navegación ahora funcionará perfectamente porque está dentro del contexto del Router */}
        <Navigation />

        {/* Contenido principal */}
        <main className="py-3">
          <Routes>
            {/* === 🔓 RUTAS ABIERTAS/PÚBLICAS === */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* === 🔒 RUTAS PROTEGIDAS GENERALES (Cualquier usuario autenticado) === */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/lineas" element={<Lineas />} />
              <Route path="/procesos" element={<Procesos />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/equipo" element={<Equipo />} />
              <Route path="/configuracion" element={<Configuracion />} />
              <Route path="/perfil" element={<Perfil />} />
            </Route>

            {/* === 👑 RUTAS EXCLUSIVAS DE ADMINISTRADOR (Rol ID = 4) === */}
            <Route element={<ProtectedRoute allowedRoles={[4]} />}>
              <Route path="/all_users" element={<AllUsers />} />
            </Route>

            {/* Redirección por defecto si el usuario entra a una ruta que no existe */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

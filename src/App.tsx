import "bootstrap/dist/css/bootstrap.min.css";
// 1. Importamos los componentes de React Router
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Home } from "./pages/Home";

import { AllUsers } from "./pages/Users/AllUsers";
import { Login } from "./pages/Login";

// Simulación de páginas/componentes para las nuevas rutas
// (Puedes mover estos componentes a sus propios archivos en la carpeta /pages más adelante)
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
    // 2. Envolvemos toda la aplicación en el BrowserRouter
    <BrowserRouter>
      <div className="app-container">
        {/* La barra de navegación ahora funcionará perfectamente porque está dentro del contexto del Router */}
        <Navigation />

        {/* Contenido principal */}
        <main className="py-3">
          {/* 3. Definimos los caminos (rutas) de nuestra aplicación */}
          <Routes>
            {/* Ruta inicial (Home) */}
            <Route path="/" element={<Home />} />

            {/* Rutas para cada sección del Navbar */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lineas" element={<Lineas />} />
            <Route path="/procesos" element={<Procesos />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/equipo" element={<Equipo />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/login" element={<Login />} />

            {/* Rutas de usuario */}
            <Route path="/all_users" element={<AllUsers />} />

            {/* Redirección por defecto si el usuario entra a una ruta que no existe */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

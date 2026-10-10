import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Button,
  Badge,
} from "react-bootstrap";
import {
  Cpu,
  LayoutDashboard,
  GitBranch,
  Workflow,
  TicketCheck,
  Users,
  Settings,
  User,
  LogOut,
  LogIn,
} from "lucide-react";

// Importamos NavLink y useNavigate de react-router-dom
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { supabase } from "../supabaseClient"; // Ajusta la ruta

export const Navigation = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      // 1. Cerramos la sesión en Supabase
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error al cerrar sesión en Supabase:", error);
    } finally {
      // 2. Limpiamos el Store de Zustand y el LocalStorage
      logout();
      // 3. Redireccionamos a la pantalla de login o inicio
      navigate("/login");
    }
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      sticky="top"
      className="shadow-sm py-2"
    >
      <Container fluid className="px-lg-4">
        <Navbar.Brand
          as={NavLink}
          to="/"
          className="d-flex align-items-center gap-2 fw-bold text-uppercase tracking-wider"
        >
          <Cpu size={24} className="text-primary" />
          <span>SMT Control</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />

        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="mx-auto my-2 my-lg-0 gap-lg-1">
            {/* NavLinks condicionados por autenticación */}
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-1 ${isActive ? "active" : ""} ${!isAuthenticated ? "disabled text-secondary" : ""}`
              }
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/lineas"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-1 ${isActive ? "active" : ""} ${!isAuthenticated ? "disabled text-secondary" : ""}`
              }
            >
              <GitBranch size={18} />
              <span>Líneas</span>
            </NavLink>

            <NavLink
              to="/procesos"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-1 ${isActive ? "active" : ""} ${!isAuthenticated ? "disabled text-secondary" : ""}`
              }
            >
              <Workflow size={18} />
              <span>Procesos</span>
            </NavLink>

            <NavLink
              to="/tickets"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-1 ${isActive ? "active" : ""} ${!isAuthenticated ? "disabled text-secondary" : ""}`
              }
            >
              <TicketCheck size={18} />
              <span>Tickets</span>
            </NavLink>

            {/* Solo mostramos la pestaña 'Equipo' (Gestión de Usuarios) si es Administrador */}
            {isAuthenticated && user?.role_name === "Administrador" && (
              <NavLink
                to="/equipo"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-1 ${isActive ? "active" : ""}`
                }
              >
                <Users size={18} />
                <span>Equipo</span>
              </NavLink>
            )}

            <NavLink
              to="/configuracion"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-1 ${isActive ? "active" : ""} ${!isAuthenticated ? "disabled text-secondary" : ""}`
              }
            >
              <Settings size={18} />
              <span>Configuración</span>
            </NavLink>
          </Nav>

          <Nav className="align-items-center">
            {isAuthenticated && user ? (
              <NavDropdown
                title={
                  <span className="d-inline-flex align-items-center gap-2 text-white">
                    <div className="bg-primary bg-opacity-25 rounded-circle p-1 d-flex align-items-center justify-content-center text-primary">
                      <User size={18} />
                    </div>
                    <span>{user.name}</span>
                  </span>
                }
                id="user-nav-dropdown"
                align="end"
                className="user-menu-dropdown"
              >
                <div className="px-3 py-2 border-bottom text-muted small">
                  <div>
                    <strong>{user.name}</strong>
                  </div>
                  <div className="text-truncate" style={{ maxWidth: "200px" }}>
                    {user.email}
                  </div>
                  {/* Leemos la propiedad de rol mapeada por Zustand */}
                  <Badge bg="info" className="mt-1">
                    {user.role_name}
                  </Badge>
                </div>

                <NavLink
                  to="/perfil"
                  className="dropdown-item d-flex align-items-center gap-2 py-2"
                >
                  <User size={16} />
                  <span>Acceder al Usuario</span>
                </NavLink>

                <NavDropdown.Divider />

                {/* Usamos el cierre de sesión real integrado con Supabase */}
                <NavDropdown.Item
                  onClick={handleLogout}
                  className="d-flex align-items-center gap-2 text-danger py-2"
                >
                  <LogOut size={16} />
                  <span>Cerrar Sesión</span>
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => navigate("/login")}
                className="d-inline-flex align-items-center gap-2"
              >
                <LogIn size={16} />
                <span>Iniciar Sesión</span>
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

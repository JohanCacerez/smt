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
import { useAuthStore } from "../store/useAuthStorage";

export const Navigation = () => {
  const { user, isAuthenticated, logout, login } = useAuthStore();

  // Simulación rápida para alternar sesión en pruebas de desarrollo
  const handleSimulateLogin = () => {
    login({
      id: "u-101",
      name: "Johan Cacerez",
      email: "caj3cea@bosch.com",
      role: "Supervisor de Mantenimiento",
    });
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
        {/* Lado Izquierdo: Marca de la aplicación */}
        <Navbar.Brand
          href="#home"
          className="d-flex align-items-center gap-2 fw-bold text-uppercase tracking-wider"
        >
          <Cpu size={24} className="text-primary" />
          <span>SMT Control</span>
        </Navbar.Brand>

        {/* Botón responsive para pantallas móviles */}
        <Navbar.Toggle aria-controls="main-navbar-nav" />

        <Navbar.Collapse id="main-navbar-nav">
          {/* Centro: Módulos de la Aplicación */}
          <Nav className="mx-auto my-2 my-lg-0 gap-lg-1">
            <Nav.Link
              href="#dashboard"
              className={`d-flex align-items-center gap-1 ${!isAuthenticated ? "disabled text-secondary" : ""}`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Nav.Link>

            <Nav.Link
              href="#lineas"
              className={`d-flex align-items-center gap-1 ${!isAuthenticated ? "disabled text-secondary" : ""}`}
            >
              <GitBranch size={18} />
              <span>Líneas</span>
            </Nav.Link>

            <Nav.Link
              href="#procesos"
              className={`d-flex align-items-center gap-1 ${!isAuthenticated ? "disabled text-secondary" : ""}`}
            >
              <Workflow size={18} />
              <span>Procesos</span>
            </Nav.Link>

            <Nav.Link
              href="#tickets"
              className={`d-flex align-items-center gap-1 ${!isAuthenticated ? "disabled text-secondary" : ""}`}
            >
              <TicketCheck size={18} />
              <span>Tickets</span>
            </Nav.Link>

            <Nav.Link
              href="#equipo"
              className={`d-flex align-items-center gap-1 ${!isAuthenticated ? "disabled text-secondary" : ""}`}
            >
              <Users size={18} />
              <span>Equipo</span>
            </Nav.Link>

            <Nav.Link
              href="#configuracion"
              className={`d-flex align-items-center gap-1 ${!isAuthenticated ? "disabled text-secondary" : ""}`}
            >
              <Settings size={18} />
              <span>Configuración</span>
            </Nav.Link>
          </Nav>

          {/* Lado Derecho: Menú de Usuario o Iniciar Sesión */}
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
                  <Badge bg="info" className="mt-1">
                    {user.role}
                  </Badge>
                </div>

                <NavDropdown.Item
                  href="#perfil"
                  className="d-flex align-items-center gap-2 py-2"
                >
                  <User size={16} />
                  <span>Acceder al Usuario</span>
                </NavDropdown.Item>

                <NavDropdown.Divider />

                <NavDropdown.Item
                  onClick={logout}
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
                onClick={handleSimulateLogin}
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

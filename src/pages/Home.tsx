import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  ShieldAlert,
  LogIn,
  Cpu,
  CheckCircle2,
  Activity,
  Layers,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStorage";

export const Home = () => {
  const { isAuthenticated, user, login } = useAuthStore();

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        {/* Banner de Bienvenida */}
        <Row className="justify-content-center text-center mb-4">
          <Col md={9} lg={8}>
            <div className="mb-3 d-inline-flex p-3 bg-primary bg-opacity-10 text-primary rounded-circle">
              <Cpu size={48} />
            </div>
            <h1 className="display-5 fw-bold text-dark">
              Bienvenido a <span className="text-primary">SMT Control</span>
            </h1>
            <p className="lead text-secondary mt-3">
              Sistema integral para la supervisión de líneas de producción SMT,
              trazabilidad de mantenimiento, monitoreo de maquinaria y atención
              de tickets de falla en planta automotriz.
            </p>
          </Col>
        </Row>

        {/* Alerta de Control de Acceso según el estado de la sesión */}
        <Row className="justify-content-center">
          <Col md={8} lg={7}>
            {!isAuthenticated ? (
              <Card className="border-0 shadow-sm border-start border-warning border-4">
                <Card.Body className="p-4 text-center">
                  <div className="d-flex justify-content-center mb-3 text-warning">
                    <ShieldAlert size={40} />
                  </div>
                  <h4 className="fw-semibold text-dark">Acceso Restringido</h4>
                  <p className="text-muted mb-4">
                    Para visualizar el estado de las líneas, registrar paros
                    técnicos o gestionar los tickets de mantenimiento, es
                    necesario contar con una sesión activa en el sistema.
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    className="d-inline-flex align-items-center gap-2 px-4 shadow-sm"
                    onClick={() =>
                      login({
                        id: "u-101",
                        name: "Johan Cacerez",
                        email: "caj3cea@bosch.com",
                        role: "Supervisor de Mantenimiento",
                      })
                    }
                  >
                    <LogIn size={20} />
                    <span>Iniciar Sesión en el Portal</span>
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <Card className="border-0 shadow-sm border-start border-success border-4">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="text-success">
                      <CheckCircle2 size={36} />
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">
                        Sesión Activa: {user?.name}
                      </h5>
                      <p className="text-muted mb-0 small">
                        Tienes acceso autorizado con el rol de{" "}
                        <strong>{user?.role}</strong>. Puedes navegar por
                        cualquiera de los módulos desde la barra superior.
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>

        {/* Resumen rápido de módulos disponibles */}
        <Row className="justify-content-center mt-5 g-4 text-center">
          <Col sm={6} md={4}>
            <Card className="h-100 border-0 shadow-sm p-3">
              <Card.Body>
                <div className="text-primary mb-3">
                  <Layers size={32} />
                </div>
                <h6 className="fw-bold">Líneas y Procesos</h6>
                <p className="text-muted small mb-0">
                  Control visual del estado operativo de cada celda y máquina en
                  piso de ensamble.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={4}>
            <Card className="h-100 border-0 shadow-sm p-3">
              <Card.Body>
                <div className="text-danger mb-3">
                  <Activity size={32} />
                </div>
                <h6 className="fw-bold">Tickets y Paros de Línea</h6>
                <p className="text-muted small mb-0">
                  Registro inmediato de incidencias, cálculo de tiempos muertos
                  (downtime) y asignación técnica.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

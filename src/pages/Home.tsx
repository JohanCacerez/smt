import { Container, Row, Col, Card } from "react-bootstrap";
import { Cpu, Activity, Layers } from "lucide-react";

export const Home = () => {
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
        <Row className="justify-content-center"></Row>

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

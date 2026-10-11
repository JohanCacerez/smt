import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Activity, ShieldCheck, AlertTriangle } from "lucide-react";

export const SPP = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-4">
      <Button
        variant="outline-secondary"
        className="mb-4 d-inline-flex align-items-center gap-2"
        onClick={() => navigate("/procesos")}
      >
        <ArrowLeft size={16} />
        Volver a Procesos
      </Button>

      <div className="mb-4">
        <span className="badge bg-primary mb-2">Proceso ID: 1</span>
        <h1 className="fw-bold text-dark">Impresión de Soldadura (Stencil)</h1>
        <p className="text-muted">
          Panel de control de calidad, volumen y alineación de pasta de
          soldadura.
        </p>
      </div>

      <Row className="g-4">
        {/* Card de Rendimiento */}
        <Col xs={12} md={4}>
          <Card className="border-0 shadow-sm p-3 bg-white rounded-4">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-success bg-opacity-10 p-3 rounded-3 text-success">
                <Activity size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Rendimiento (OEE)</h6>
                <h3 className="fw-bold mb-0">98.4%</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Card de Alertas */}
        <Col xs={12} md={4}>
          <Card className="border-0 shadow-sm p-3 bg-white rounded-4">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-warning bg-opacity-10 p-3 rounded-3 text-warning">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Alertas Activas</h6>
                <h3 className="fw-bold mb-0">2 Advertencias</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Card de Estado del Stencil */}
        <Col xs={12} md={4}>
          <Card className="border-0 shadow-sm p-3 bg-white rounded-4">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-info bg-opacity-10 p-3 rounded-3 text-info">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Vida de Limpieza Stencil</h6>
                <h3 className="fw-bold mb-0">85%</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

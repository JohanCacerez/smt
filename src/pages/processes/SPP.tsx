import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import ToolingStatus from "../../components/widgets/ToolingStatus";

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
      <ToolingStatus />
    </Container>
  );
};

import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Hammer, ArrowLeft } from "lucide-react";

interface InDevelopmentProps {
  processName: string;
}

export const InDevelopment = ({ processName }: InDevelopmentProps) => {
  const navigate = useNavigate();

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: "70vh" }}
    >
      <div className="bg-warning bg-opacity-10 p-4 rounded-circle mb-4 text-warning">
        <Hammer size={64} />
      </div>
      <h1 className="fw-bold mb-2">{processName}</h1>
      <h3 className="text-muted mb-4 fs-5">Módulo de control en desarrollo</h3>
      <p className="text-muted mb-4" style={{ maxWidth: "500px" }}>
        Nuestros ingenieros de software están diseñando el panel de control, los
        gráficos de rendimiento y el gestor de alarmas específico para esta
        etapa de la línea.
      </p>
      <Button
        variant="outline-secondary"
        className="d-inline-flex align-items-center gap-2"
        onClick={() => navigate("/procesos")}
      >
        <ArrowLeft size={16} />
        Volver a Procesos
      </Button>
    </Container>
  );
};

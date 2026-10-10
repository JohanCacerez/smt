import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: "80vh" }}
    >
      <ShieldAlert size={80} className="text-danger mb-4" />
      <h1 className="fw-bold">Acceso Denegado</h1>
      <p className="text-muted fs-5 mb-4" style={{ maxWidth: "500px" }}>
        No tienes los permisos necesarios para visualizar esta sección. Si crees
        que se trata de un error, ponte en contacto con el administrador del
        sistema.
      </p>
      <Button variant="primary" onClick={() => navigate("/dashboard")}>
        Volver al Dashboard
      </Button>
    </Container>
  );
};

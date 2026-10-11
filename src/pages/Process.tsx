import { Container, Row, Col } from "react-bootstrap";
import { ProcessCard } from "../components/ProcessCard";

export const Process = () => {
  // Datos simulados de tus procesos de manufactura SMT
  const listaProcesos = [
    {
      id: 1,
      name: "Impresión de Soldadura",
      description:
        "Aplicación de pasta de soldadura mediante stencil automatizado en los pads de la PCB.",
      imageUrl:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop",
      engineers: [
        { id: 101, name: "Carlos Mendoza" },
        { id: 102, name: "Sofía Ruiz" },
        { id: 103, name: "David López" },
      ],
    },
    {
      id: 2,
      name: "SPI (Solder Paste Inspection)",
      description:
        "Inspección 3D de altura, volumen y alineación de la soldadura depositada.",
      imageUrl:
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop",
      engineers: [{ id: 104, name: "Ana Torres" }],
    },
    {
      id: 3,
      name: "Pick and Place (Montaje)",
      description:
        "Colocación a alta velocidad de componentes SMD sobre la pasta de soldadura.",
      imageUrl:
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
      engineers: [
        { id: 101, name: "Carlos Mendoza" },
        { id: 105, name: "Héctor Silva" },
      ],
    },
    {
      id: 4,
      name: "Horno de Reflujo",
      description:
        "Soldadura por convección térmica con perfiles de temperatura controlados.",
      imageUrl:
        "https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=600&auto=format&fit=crop",
      engineers: [
        { id: 102, name: "Sofía Ruiz" },
        { id: 106, name: "Patricia Vera" },
        { id: 107, name: "Juan Martínez" },
        { id: 108, name: "Luis Castro" },
      ],
    },
  ];

  return (
    <Container className="mt-4">
      <div className="mb-4">
        <h2>Procesos SMT</h2>
        <p className="text-muted">
          Línea de producción y personal de ingeniería a cargo de cada etapa.
        </p>
      </div>

      {/* Grid responsivo ideal para más de 10 procesos sin saturar la pantalla */}
      <Row className="g-4">
        {listaProcesos.map((proceso) => (
          <Col key={proceso.id} xs={12} sm={6} md={4} lg={3}>
            <ProcessCard
              id={proceso.id} // 💡 PASAMOS EL ID DE MANERA OBLIGATORIA
              name={proceso.name}
              description={proceso.description}
              imageUrl={proceso.imageUrl}
              engineers={proceso.engineers}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

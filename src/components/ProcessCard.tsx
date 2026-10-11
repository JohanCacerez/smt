import { Link } from "react-router-dom"; // 1. Importamos Link

interface Engineer {
  id: number;
  name: string;
  avatar_url?: string;
}

interface ProcessCardProps {
  id: number | string; // 2. Añadimos el ID o Slug del proceso para la ruta
  name: string;
  description: string;
  imageUrl: string;
  engineers: Engineer[];
}

export const ProcessCard = ({
  id,
  name,
  description,
  imageUrl,
  engineers,
}: ProcessCardProps) => {
  const maxVisibleEngineers = 2;
  const hasMore = engineers.length > maxVisibleEngineers;
  const extraCount = engineers.length - maxVisibleEngineers;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    // Envolvemos toda la tarjeta en un Link hacia la ruta específica del proceso
    <Link
      to={`/procesos/${id}`} // Ruta dinámica (ej. /procesos/1 o /procesos/impresion)
      className="text-decoration-none card border-0 rounded-4 overflow-hidden shadow-sm h-100 position-relative process-card"
      style={{
        minHeight: "220px",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        display: "block",
      }}
    >
      {/* Imagen de fondo con degradado oscuro */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.85)), url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 1,
        }}
      />

      {/* Contenido de la Card */}
      <div
        className="card-body d-flex flex-column justify-content-end position-relative h-100 p-4"
        style={{ zIndex: 2 }}
      >
        <div className="mb-2">
          <h4 className="text-white fw-bold mb-1 tracking-wide">{name}</h4>
          <p
            className="text-white-50 small mb-3 text-truncate-2-lines"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: "1.3",
            }}
          >
            {description}
          </p>
        </div>

        {/* Sección inferior: Ingenieros a cargo */}
        <div className="d-flex align-items-center justify-content-between pt-2 border-top border-secondary border-opacity-50">
          <span className="text-white-50 small fw-semibold">Ingenieros:</span>

          {/* Grupo de Avatares superpuestos */}
          <div className="d-flex align-items-center">
            {engineers.slice(0, maxVisibleEngineers).map((eng, index) => (
              <div
                key={eng.id}
                className="rounded-circle d-flex align-items-center justify-content-center border border-dark bg-primary text-white font-weight-bold shadow-sm"
                title={eng.name}
                style={{
                  width: "32px",
                  height: "32px",
                  fontSize: "12px",
                  marginLeft: index > 0 ? "-10px" : "0",
                  zIndex: 10 - index,
                }}
              >
                {eng.avatar_url ? (
                  <img
                    src={eng.avatar_url}
                    alt={eng.name}
                    className="w-100 h-100 rounded-circle"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <span>{getInitials(eng.name)}</span>
                )}
              </div>
            ))}

            {/* Burbuja de "+X" */}
            {hasMore && (
              <div
                className="rounded-circle d-flex align-items-center justify-content-center border border-dark bg-secondary text-white font-weight-bold shadow-sm"
                title={`${extraCount} ingenieros más`}
                style={{
                  width: "32px",
                  height: "32px",
                  fontSize: "12px",
                  marginLeft: "-10px",
                  zIndex: 5,
                }}
              >
                +{extraCount}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

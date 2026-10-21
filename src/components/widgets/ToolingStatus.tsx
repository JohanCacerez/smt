import { useState, useEffect } from "react";
import { Card, Spinner } from "react-bootstrap";
import { Cpu, Archive, Trash2, RefreshCw } from "lucide-react";
import { supabase } from "../../supabaseClient"; // Ajusta la ruta a tu cliente de Supabase

interface ToolingCounts {
  enLinea: number;
  almacenado: number;
  scrap: number;
}

export default function ToolingStatus() {
  const [counts, setCounts] = useState<ToolingCounts>({
    enLinea: 0,
    almacenado: 0,
    scrap: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Función para consultar Supabase y contar por estados
  const fetchCounts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("tooling").select("status");

      if (error) throw error;

      // Realizamos el conteo en el cliente de manera limpia
      const stats = { enLinea: 0, almacenado: 0, scrap: 0 };

      if (data) {
        data.forEach((item) => {
          const status = item.status?.toLowerCase() || "";
          if (
            status === "activo" ||
            status === "en linea" ||
            status === "en línea"
          ) {
            stats.enLinea++;
          } else if (status === "almacenado") {
            stats.almacenado++;
          } else if (status === "dañado" || status === "scrap") {
            stats.scrap++;
          }
        });
      }

      setCounts(stats);
    } catch (error) {
      console.error("Error obteniendo conteo de herramental:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCounts();
  }, []);

  return (
    <Card
      className="shadow-sm border-0 p-3 h-100 position-relative"
      style={{
        maxWidth: "280px",
        minHeight: "240px",
        borderRadius: "15px",
        background: "#ffffff",
      }}
    >
      <Card.Body className="d-flex flex-column justify-content-between p-1">
        {/* Encabezado del Widget */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-muted fw-bold small text-uppercase tracking-wider">
            Estatus Herramentales
          </span>
          <button
            onClick={fetchCounts}
            disabled={loading}
            className="btn btn-link p-0 text-muted hover-opacity"
            style={{ border: "none", background: "none" }}
          >
            <RefreshCw size={14} className={loading ? "spin" : ""} />
          </button>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center flex-grow-1">
            <Spinner animation="border" variant="primary" size="sm" />
          </div>
        ) : (
          <div className="d-flex flex-column gap-3 flex-grow-1 justify-content-center">
            {/* Estado: En Línea */}
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <div className="p-2 bg-success bg-opacity-10 rounded-3 text-success d-flex align-items-center">
                  <Cpu size={18} />
                </div>
                <span className="fw-semibold text-secondary small">
                  En Línea
                </span>
              </div>
              <span className="fs-5 fw-bold text-dark">{counts.enLinea}</span>
            </div>

            {/* Estado: Almacenado */}
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <div className="p-2 bg-info bg-opacity-10 rounded-3 text-info d-flex align-items-center">
                  <Archive size={18} className="text-info-emphasis" />
                </div>
                <span className="fw-semibold text-secondary small">
                  Almacenado
                </span>
              </div>
              <span className="fs-5 fw-bold text-dark">
                {counts.almacenado}
              </span>
            </div>

            {/* Estado: Scrap */}
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <div className="p-2 bg-danger bg-opacity-10 rounded-3 text-danger d-flex align-items-center">
                  <Trash2 size={18} />
                </div>
                <span className="fw-semibold text-secondary small">Scrap</span>
              </div>
              <span className="fs-5 fw-bold text-dark">{counts.scrap}</span>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

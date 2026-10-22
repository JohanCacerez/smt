import { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import DataTable, { type TableColumn } from "react-data-table-component";
import { FolderKanban, RefreshCw, X, Tag } from "lucide-react";
import { supabase } from "../../supabaseClient"; // Ajusta la ruta a tu cliente de Supabase

// Definición de tipos
interface FamilyRow {
  id: number;
  name: string;
  modelCount: number; // Campo que calcularemos nosotros
}

interface InventoryFamiliesProps {
  show: boolean;
  onHide: () => void;
}

export default function InventoryFamilies({
  show,
  onHide,
}: InventoryFamiliesProps) {
  const [families, setFamilies] = useState<FamilyRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Obtener familias y contar modelos asociados de Supabase
  const fetchFamiliesData = async () => {
    setLoading(true);
    try {
      // Traemos las familias y al mismo tiempo todos los modelos para agrupar
      const { data: familiesData, error: familiesError } = await supabase
        .from("families")
        .select("id, name");

      const { data: modelsData, error: modelsError } = await supabase
        .from("models")
        .select("id_family");

      if (familiesError) throw familiesError;
      if (modelsError) throw modelsError;

      // Generar el conteo
      const formattedData: FamilyRow[] = (familiesData || []).map((family) => {
        const associatedModels = (modelsData || []).filter(
          (model) => model.id_family === family.id,
        );
        return {
          id: family.id,
          name: family.name,
          modelCount: associatedModels.length,
        };
      });

      // Ordenar alfabéticamente por nombre
      formattedData.sort((a, b) => a.name.localeCompare(b.name));

      setFamilies(formattedData);
    } catch (error: unknown) {
      console.error("Error al cargar familias con contador:", error);
      alert(`Error al cargar datos: ${(error as Error).message || error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchFamiliesData();
    }
  }, [show]);

  const columns: TableColumn<FamilyRow>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Nombre de Familia",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <span className="fw-semibold text-dark d-flex align-items-center gap-1">
          <Tag size={14} className="text-primary" />
          {row.name}
        </span>
      ),
    },
    {
      name: "Modelos Asociados",
      selector: (row) => row.modelCount,
      sortable: true,
      center: true,
      width: "200px",
      cell: (row) => (
        <span
          className={`badge rounded-pill px-3 py-2 ${
            row.modelCount > 0
              ? "bg-primary-subtle text-primary"
              : "bg-light text-muted"
          }`}
          style={{ fontSize: "0.85rem" }}
        >
          {row.modelCount} {row.modelCount === 1 ? "Modelo" : "Modelos"}
        </span>
      ),
    },
  ];

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="fw-bold fs-5 d-flex align-items-center gap-2">
          <FolderKanban size={20} className="text-primary" />
          Familias de PCBs Registradas
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0" style={{ minHeight: "250px" }}>
        {loading ? (
          <div className="d-flex flex-column justify-content-center align-items-center position-absolute top-50 start-50 translate-middle w-100">
            <Spinner animation="border" variant="primary" className="mb-2" />
            <span className="text-muted small">
              Consultando familias y modelos...
            </span>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={families}
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10]}
            noDataComponent={
              <div className="p-5 text-center text-muted">
                No hay familias de PCB registradas en el sistema.
              </div>
            }
          />
        )}
      </Modal.Body>

      <Modal.Footer className="bg-light d-flex justify-content-between">
        <Button
          variant="outline-secondary"
          onClick={fetchFamiliesData}
          disabled={loading}
          className="d-flex align-items-center gap-1"
        >
          <RefreshCw size={16} className={loading ? "spin" : ""} />
          Actualizar
        </Button>
        <Button
          variant="secondary"
          onClick={onHide}
          className="d-flex align-items-center gap-1"
        >
          <X size={16} />
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

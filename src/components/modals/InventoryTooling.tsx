import { useState, useEffect, useMemo } from "react";
import {
  Modal,
  Button,
  Badge,
  Spinner,
  Form,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import DataTable, { type TableColumn } from "react-data-table-component";
import { Eye, RefreshCw, X, Search, Filter, MapPin } from "lucide-react";
import { supabase } from "../../supabaseClient"; // Ajusta la ruta a tu cliente de Supabase

// Definición del tipo de datos actualizado para incluir las nuevas columnas de Supabase
interface ToolingItem {
  id: number;
  created_at?: string;
  dmc: string;
  type: string;
  status: string;
  rack?: string; // ⚡ Agregado
  position?: string; // ⚡ Agregado
}

interface ModalInventoryProps {
  show: boolean;
  onHide: () => void;
}

export default function InventoryTooling({
  show,
  onHide,
}: ModalInventoryProps) {
  const [tools, setTools] = useState<ToolingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // --- Estados de los Filtros ---
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

  // Función para obtener los datos desde Supabase
  const fetchInventory = async () => {
    setLoading(true);
    try {
      // ⚡ Agregamos 'rack' y 'position' a la consulta SELECT
      const { data, error } = await supabase
        .from("tooling")
        .select("id, dmc, type, status, rack, position")
        .order("id", { ascending: false });

      if (error) throw error;
      setTools(data || []);
    } catch (error: unknown) {
      console.error("Error cargando inventario de Supabase:", error);
      alert(
        `Error al cargar el inventario: ${(error as Error).message || error}`,
      );
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos automáticamente cuando se abre el modal
  useEffect(() => {
    if (show) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchInventory();
    }
  }, [show]);

  // Al cerrar el modal, reiniciamos los filtros
  const handleClose = () => {
    setSearchTerm("");
    setSelectedType("");
    onHide();
  };

  // --- Lógica de Filtrado (useMemo para optimizar rendimiento) ---
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // 1. Filtrar por búsqueda DMC (Insensible a mayúsculas/minúsculas)
      const matchesDmc = tool.dmc
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      // 2. Filtrar por Tipo de Herramental seleccionado
      const matchesType =
        selectedType === "" ||
        tool.type?.toLowerCase() === selectedType.toLowerCase();

      return matchesDmc && matchesType;
    });
  }, [tools, searchTerm, selectedType]);

  // Función para dar formato visual al estado (Badge de Bootstrap)
  const renderStatus = (status: string) => {
    const normalizeStatus = status?.toLowerCase() || "";
    switch (normalizeStatus) {
      case "activo":
      case "en linea":
      case "en línea":
        return <Badge bg="success">En Línea</Badge>;
      case "almacenado":
        return (
          <Badge bg="info" className="text-dark">
            Almacenado
          </Badge>
        );
      case "dañado":
      case "scrap":
        return <Badge bg="danger">Scrap</Badge>;
      default:
        return <Badge bg="secondary">{status || "Desconocido"}</Badge>;
    }
  };

  // Configuración de columnas para el catálogo
  const columns: TableColumn<ToolingItem>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "75px",
    },
    {
      name: "DMC / Número de Serie",
      selector: (row) => row.dmc,
      sortable: true,
      wrap: true,
    },
    {
      name: "Tipo",
      selector: (row) => row.type,
      sortable: true,
      width: "110px",
      cell: (row) => <span className="text-capitalize">{row.type}</span>,
    },
    {
      name: "Ubicación", // ⚡ NUEVA COLUMNA DE UBICACIÓN COMBINADA
      selector: (row) => `${row.rack || ""} - ${row.position || ""}`,
      sortable: true,
      width: "180px",
      cell: (row) => (
        <span className="d-flex align-items-center gap-1 text-secondary small">
          <MapPin size={14} className="text-muted" />
          {row.rack && row.position ? (
            <span>
              {row.rack} <strong className="text-dark">[{row.position}]</strong>
            </span>
          ) : (
            <span className="text-muted italic">Sin asignar</span>
          )}
        </span>
      ),
    },
    {
      name: "Estado",
      selector: (row) => row.status,
      sortable: true,
      width: "120px",
      cell: (row) => renderStatus(row.status),
    },
  ];

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered scrollable>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="fw-bold fs-5 d-flex align-items-center gap-2">
          <Eye size={20} className="text-primary" />
          Inventario General de Herramental
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-3" style={{ minHeight: "350px" }}>
        {/* ========================================== */}
        {/* SECCIÓN DE FILTROS DE BÚSQUEDA            */}
        {/* ========================================== */}
        <Row className="mb-3 g-2">
          {/* Búsqueda por DMC */}
          <Col md={8} sm={12}>
            <InputGroup>
              <InputGroup.Text className="bg-white text-muted">
                <Search size={18} />
              </InputGroup.Text>
              <Form.Control
                placeholder="Buscar por DMC o Código de barras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
              />
              {searchTerm && (
                <Button
                  variant="outline-secondary"
                  onClick={() => setSearchTerm("")}
                  className="border-start-0"
                >
                  <X size={14} />
                </Button>
              )}
            </InputGroup>
          </Col>

          {/* Selector de Tipo */}
          <Col md={4} sm={12}>
            <InputGroup>
              <InputGroup.Text className="bg-white text-muted">
                <Filter size={18} />
              </InputGroup.Text>
              <Form.Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                disabled={loading}
              >
                <option value="">Todos los tipos...</option>
                <option value="estencil">Esténciles</option>
                <option value="base">Bases</option>
                <option value="navaja">Navajas</option>
                <option value="pasta">Pastas</option>
              </Form.Select>
            </InputGroup>
          </Col>
        </Row>

        {/* ========================================== */}
        {/* TABLA DE INVENTARIO                        */}
        {/* ========================================== */}
        {loading ? (
          <div className="d-flex flex-column justify-content-center align-items-center py-5">
            <Spinner animation="border" variant="primary" className="mb-2" />
            <span className="text-muted">
              Cargando herramentales de Supabase...
            </span>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredTools} // Pasamos los datos filtrados en tiempo real
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 15]}
            noDataComponent={
              <div className="p-5 text-center text-muted">
                {tools.length === 0
                  ? "No hay herramentales registrados en el inventario."
                  : "Ningún herramental coincide con los filtros de búsqueda."}
              </div>
            }
          />
        )}
      </Modal.Body>

      <Modal.Footer className="bg-light d-flex justify-content-between">
        <Button
          variant="outline-secondary"
          onClick={fetchInventory}
          disabled={loading}
          className="d-flex align-items-center gap-1"
        >
          <RefreshCw size={16} className={loading ? "spin" : ""} />
          Sincronizar
        </Button>
        <Button
          variant="secondary"
          onClick={handleClose}
          className="d-flex align-items-center gap-1"
        >
          <X size={16} />
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

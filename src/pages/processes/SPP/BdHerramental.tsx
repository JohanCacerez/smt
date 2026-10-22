import { useState, useEffect, useMemo } from "react";
import {
  Stack,
  Dropdown,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Spinner,
} from "react-bootstrap";
import DataTable, { type TableColumn } from "react-data-table-component";
import {
  Plus,
  FolderKanban,
  Cpu,
  Settings,
  Eye,
  Trash2,
  Edit,
  Search,
  Filter,
  RefreshCw,
  X,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { supabase } from "../../../supabaseClient"; // Ajusta la ruta a tu cliente de Supabase

// Modales del sistema
import AddTooling from "../../../components/modals/AddTooling";
import InventoryTooling from "../../../components/modals/InventoryTooling";
import ActionTooling from "../../../components/modals/ActionTooling";
import EditTooling from "../../../components/modals/EditTooling";
import AddFamily from "../../../components/modals/AddFamily";
import AddModel from "../../../components/modals/AddModel";
import InventoryFamilies from "../../../components/modals/InventoryFamilies";
import DeleteModel from "../../../components/modals/DeleteModel";
import ConfigureSetup from "../../../components/modals/ConfigureSetup";

// Interfaz para mapear los datos reales recibidos de Supabase (con sus Joins)
interface SetupRowData {
  id: number;
  stencil_top: string;
  stencil_bottom: string;
  squeegee_front: string;
  squeegee_rear: string;
  base: string;
  paste: string;
  families: { name: string }[] | { name: string } | null;
  models: { name: string }[] | { name: string } | null;
}

export default function BdHerramental() {
  // --- Estados de datos ---
  const [setups, setSetups] = useState<SetupRowData[]>([]);
  const [families, setFamilies] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // --- Estados de los Filtros ---
  const [searchModel, setSearchModel] = useState<string>("");
  const [selectedFamilyName, setSelectedFamilyName] = useState<string>("");
  const [searchDmc, setSearchDmc] = useState<string>("");

  // --- Estados para modales ---
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showInventoryModal, setShowInventoryModal] = useState<boolean>(false);
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showAddFamilyModal, setShowAddFamilyModal] = useState<boolean>(false);
  const [showAddModelModal, setShowAddModelModal] = useState<boolean>(false);
  const [showInventoryFamiliesModal, setShowInventoryFamiliesModal] =
    useState<boolean>(false);
  const [showDeleteModelModal, setShowDeleteModelModal] =
    useState<boolean>(false);
  const [showConfigureSetupModal, setShowConfigureSetupModal] =
    useState<boolean>(false);

  // ⚡ Consultar los Setups y las Familias en Supabase
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Obtener setups cruzando tablas para traer nombres de Familias y Modelos
      const { data: setupsData, error: setupsError } = await supabase.from(
        "setups",
      ).select(`
          id,
          stencil_top,
          stencil_bottom,
          squeegee_front,
          squeegee_rear,
          base,
          paste,
          families ( name ),
          models ( name )
        `);

      if (setupsError) throw setupsError;

      // 2. Obtener familias para el filtro dropdown
      const { data: familiesData, error: familiesError } = await supabase
        .from("families")
        .select("id, name")
        .order("name");

      if (familiesError) throw familiesError;

      // Guardamos los datos de setups forzando el casteo al tipado compatible
      setSetups((setupsData as unknown as SetupRowData[]) || []);
      setFamilies(familiesData || []);
    } catch (error: unknown) {
      console.error("Error al obtener setups de Supabase:", error);
      toast.error(
        `Error de sincronización: ${(error as Error).message || error}`,
      );
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleSuccess = () => {
    fetchData(); // Refrescar la tabla automáticamente cuando un modal guarde con éxito
  };

  // ⚡ Lógica de filtrado en tiempo real en memoria (useMemo)
  const filteredSetups = useMemo(() => {
    return setups.filter((setup) => {
      // Extraemos el nombre de la familia validando si viene como array o como objeto directo
      const familyName = Array.isArray(setup.families)
        ? setup.families[0]?.name || ""
        : setup.families?.name || "";

      // Extraemos el nombre del modelo de igual forma
      const modelName = Array.isArray(setup.models)
        ? setup.models[0]?.name || ""
        : setup.models?.name || "";

      // 1. Filtro de Familia
      const matchesFamily =
        selectedFamilyName === "" || familyName === selectedFamilyName;

      // 2. Filtro de Búsqueda de Modelo
      const matchesModel = modelName
        .toLowerCase()
        .includes(searchModel.toLowerCase().trim());

      // 3. Filtro de Búsqueda por DMC de cualquier componente de la receta
      const dmcToSearch = searchDmc.toLowerCase().trim();
      const matchesDmc =
        dmcToSearch === "" ||
        setup.stencil_top.toLowerCase().includes(dmcToSearch) ||
        setup.stencil_bottom.toLowerCase().includes(dmcToSearch) ||
        setup.squeegee_front.toLowerCase().includes(dmcToSearch) ||
        setup.squeegee_rear.toLowerCase().includes(dmcToSearch) ||
        setup.base.toLowerCase().includes(dmcToSearch) ||
        setup.paste.toLowerCase().includes(dmcToSearch);

      return matchesFamily && matchesModel && matchesDmc;
    });
  }, [setups, selectedFamilyName, searchModel, searchDmc]);

  // Tipado estricto para las columnas de la tabla real de Setups
  const columns: TableColumn<SetupRowData>[] = [
    {
      name: "Familia",
      selector: (row) =>
        Array.isArray(row.families)
          ? row.families[0]?.name || "N/A"
          : row.families?.name || "N/A",
      sortable: true,
      width: "110px",
    },
    {
      name: "Modelo / PCB",
      selector: (row) =>
        Array.isArray(row.models)
          ? row.models[0]?.name || "N/A"
          : row.models?.name || "N/A",
      sortable: true,
      width: "130px",
      cell: (row) => {
        const modelName = Array.isArray(row.models)
          ? row.models[0]?.name || "N/A"
          : row.models?.name || "N/A";
        return <strong className="text-primary">{modelName}</strong>;
      },
    },
    {
      name: "Esténcil TOP",
      selector: (row) => row.stencil_top,
      sortable: true,
    },
    {
      name: "Esténcil BOT",
      selector: (row) => row.stencil_bottom,
      sortable: true,
    },
    {
      name: "Navaja FRONT",
      selector: (row) => row.squeegee_front,
      sortable: true,
    },
    {
      name: "Navaja REAR",
      selector: (row) => row.squeegee_rear,
      sortable: true,
    },
    {
      name: "Base Soporte",
      selector: (row) => row.base,
      sortable: true,
    },
    {
      name: "Pasta Soldadura",
      selector: (row) => row.paste,
      sortable: true,
      width: "140px",
    },
  ];

  return (
    <div className="container mt-4">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="d-flex justify-content-between align-items-center mb-1">
        <h3 className="fw-bold">Base de Datos de Herramental</h3>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={fetchData}
          disabled={loading}
          className="d-flex align-items-center gap-1"
        >
          <RefreshCw size={14} className={loading ? "spin" : ""} />
          Sincronizar
        </Button>
      </div>

      <p className="text-muted">
        Gestión y recetas de montaje (Setups) para el control preventivo en piso
        de SMT.
      </p>

      {/* Stack de Acciones usando Dropdowns */}
      <Stack
        gap={3}
        direction="horizontal"
        className="d-flex justify-content-center mb-4 flex-wrap"
      >
        {/* DROPDOWN: HERRAMENTAL */}
        <Dropdown>
          <Dropdown.Toggle
            variant="primary"
            id="dropdown-herramental"
            className="d-flex align-items-center gap-1"
          >
            <Settings size={18} /> Herramental
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => setShowAddModal(true)}
              className="d-flex align-items-center gap-2 text-primary fw-semibold"
            >
              <Plus size={16} /> Agregar herramental
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => setShowEditModal(true)}
              className="d-flex align-items-center gap-2 text-warning fw-semibold"
            >
              <Edit size={16} /> Editar herramental
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => setShowActionModal(true)}
              className="d-flex align-items-center gap-2 text-danger fw-semibold"
            >
              <Trash2 size={16} /> Eliminar / Scrap herramental
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => setShowInventoryModal(true)}
              className="d-flex align-items-center gap-2 text-success fw-semibold"
            >
              <Eye size={16} /> Ver inventario
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* DROPDOWN: FAMILIAS */}
        <Dropdown>
          <Dropdown.Toggle
            variant="secondary"
            id="dropdown-familias"
            className="d-flex align-items-center gap-1"
          >
            <FolderKanban size={18} /> Familias
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => setShowAddFamilyModal(true)}
              className="d-flex align-items-center gap-2 text-primary fw-semibold"
            >
              <Plus size={16} /> Nueva familia
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => setShowInventoryFamiliesModal(true)}
              className="d-flex align-items-center gap-2 text-success fw-semibold"
            >
              <Eye size={16} /> Mostrar familias
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* DROPDOWN: MODELOS */}
        <Dropdown>
          <Dropdown.Toggle
            variant="secondary"
            id="dropdown-modelos"
            className="d-flex align-items-center gap-1"
          >
            <Cpu size={18} /> Modelos
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => setShowAddModelModal(true)}
              className="d-flex align-items-center gap-2 text-primary fw-semibold"
            >
              <Plus size={16} /> Nuevo modelo
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => setShowDeleteModelModal(true)}
              className="d-flex align-items-center gap-2 text-danger fw-semibold"
            >
              <Trash2 size={16} /> Eliminar modelo
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* DROPDOWN: SETUP */}
        <Dropdown>
          <Dropdown.Toggle
            variant="secondary"
            id="dropdown-setup"
            className="d-flex align-items-center gap-1"
          >
            <Settings size={18} /> Setup
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => setShowConfigureSetupModal(true)}
              className="d-flex align-items-center gap-2 text-primary fw-semibold"
            >
              <Plus size={16} /> Configurar nuevo setup
            </Dropdown.Item>
            <Dropdown.Item className="d-flex align-items-center gap-2">
              <Edit size={16} /> Editar setups
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Stack>

      {/* ========================================== */}
      {/* SECCIÓN INTERACTIVA DE FILTROS EN PISO     */}
      {/* ========================================== */}
      <Row className="mb-3 g-2 bg-light p-3 rounded-3 shadow-sm border">
        {/* Filtro: Buscar por Modelo */}
        <Col lg={4} md={6} sm={12}>
          <Form.Group controlId="filterModel">
            <Form.Label className="small fw-semibold text-secondary">
              Buscar Modelo / PCB
            </Form.Label>
            <InputGroup size="sm">
              <InputGroup.Text className="bg-white">
                <Cpu size={14} />
              </InputGroup.Text>
              <Form.Control
                placeholder="Escribe el modelo..."
                value={searchModel}
                onChange={(e) => setSearchModel(e.target.value)}
              />
              {searchModel && (
                <Button
                  variant="outline-secondary"
                  onClick={() => setSearchModel("")}
                >
                  <X size={12} />
                </Button>
              )}
            </InputGroup>
          </Form.Group>
        </Col>

        {/* Filtro: Filtrar por Familia */}
        <Col lg={3} md={6} sm={12}>
          <Form.Group controlId="filterFamily">
            <Form.Label className="small fw-semibold text-secondary">
              Filtrar por Familia
            </Form.Label>
            <InputGroup size="sm">
              <InputGroup.Text className="bg-white">
                <Filter size={14} />
              </InputGroup.Text>
              <Form.Select
                value={selectedFamilyName}
                onChange={(e) => setSelectedFamilyName(e.target.value)}
              >
                <option value="">Todas las familias...</option>
                {families.map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </Form.Group>
        </Col>

        {/* Filtro: Buscar por DMC de Herramental */}
        <Col lg={5} md={12} sm={12}>
          <Form.Group controlId="filterDmc">
            <Form.Label className="small fw-semibold text-secondary">
              Buscar por DMC de Herramental (Esténcil, Base, etc.)
            </Form.Label>
            <InputGroup size="sm">
              <InputGroup.Text className="bg-white">
                <Search size={14} />
              </InputGroup.Text>
              <Form.Control
                placeholder="Escanee o escriba número de serie / DMC..."
                value={searchDmc}
                onChange={(e) => setSearchDmc(e.target.value)}
              />
              {searchDmc && (
                <Button
                  variant="outline-secondary"
                  onClick={() => setSearchDmc("")}
                >
                  <X size={12} />
                </Button>
              )}
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      {/* Tabla de Datos Reales */}
      {loading ? (
        <div className="d-flex flex-column justify-content-center align-items-center py-5 bg-white border rounded shadow-sm">
          <Spinner animation="border" variant="primary" className="mb-2" />
          <span className="text-muted small">
            Cargando recetas de setups desde Supabase...
          </span>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredSetups}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 15, 20]}
          noDataComponent={
            <div className="p-5 text-center text-muted">
              {setups.length === 0
                ? "No hay setups configurados en el sistema."
                : "Ninguna receta de setup coincide con los filtros de búsqueda."}
            </div>
          }
        />
      )}

      {/* Modales del sistema */}
      <AddTooling
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSuccess={handleSuccess}
      />
      <InventoryTooling
        show={showInventoryModal}
        onHide={() => setShowInventoryModal(false)}
      />
      <ActionTooling
        show={showActionModal}
        onHide={() => setShowActionModal(false)}
        onSuccess={handleSuccess}
      />
      <EditTooling
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSuccess={handleSuccess}
      />
      <AddFamily
        show={showAddFamilyModal}
        onHide={() => setShowAddFamilyModal(false)}
        onSuccess={handleSuccess}
      />
      <AddModel
        show={showAddModelModal}
        onHide={() => setShowAddModelModal(false)}
        onSuccess={handleSuccess}
      />
      <InventoryFamilies
        show={showInventoryFamiliesModal}
        onHide={() => setShowInventoryFamiliesModal(false)}
      />
      <DeleteModel
        show={showDeleteModelModal}
        onHide={() => setShowDeleteModelModal(false)}
        onSuccess={handleSuccess}
      />
      <ConfigureSetup
        show={showConfigureSetupModal}
        onHide={() => setShowConfigureSetupModal(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

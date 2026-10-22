import { useState } from "react";
import { Stack, Dropdown } from "react-bootstrap";
import DataTable, { type TableColumn } from "react-data-table-component";
import {
  Plus,
  FolderKanban,
  Cpu,
  Settings,
  Eye,
  Trash2,
  Edit,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import AddTooling from "../../../components/modals/AddTooling";
import InventoryTooling from "../../../components/modals/InventoryTooling";
import ActionTooling from "../../../components/modals/ActionTooling";
import EditTooling from "../../../components/modals/EditTooling";
import AddFamily from "../../../components/modals/AddFamily";
import AddModel from "../../../components/modals/AddModel";
import InventoryFamilies from "../../../components/modals/InventoryFamilies";
import DeleteModel from "../../../components/modals/DeleteModel"; // ⚡ Importamos el nuevo modal de eliminación de modelos

interface SmtRowData {
  familia: string;
  modelo: string;
  setup: string;
  estencilTop: string;
  estencilBottom: string;
  navajaFront: string;
  navajaRear: string;
  base: string;
}

export default function BdHerramental() {
  // Estados para controlar los modales de forma independiente
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showInventoryModal, setShowInventoryModal] = useState<boolean>(false);
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showAddFamilyModal, setShowAddFamilyModal] = useState<boolean>(false);
  const [showAddModelModal, setShowAddModelModal] = useState<boolean>(false);
  const [showInventoryFamiliesModal, setShowInventoryFamiliesModal] =
    useState<boolean>(false);
  const [showDeleteModelModal, setShowDeleteModelModal] =
    useState<boolean>(false); // ⚡ Nuevo estado

  const handleSuccess = () => {
    console.log("¡Acción procesada con éxito! Refrescando datos del sistema.");
  };

  const columns: TableColumn<SmtRowData>[] = [
    { name: "Familia", selector: (row) => row.familia, sortable: true },
    { name: "Modelo", selector: (row) => row.modelo, sortable: true },
    { name: "Setup", selector: (row) => row.setup, sortable: true },
    {
      name: "Estencil top",
      selector: (row) => row.estencilTop,
      sortable: true,
    },
    {
      name: "Estencil bottom",
      selector: (row) => row.estencilBottom,
      sortable: true,
    },
    {
      name: "Navaja front",
      selector: (row) => row.navajaFront,
      sortable: true,
    },
    { name: "Navaja rear", selector: (row) => row.navajaRear, sortable: true },
    { name: "Base", selector: (row) => row.base, sortable: true },
  ];

  const data: SmtRowData[] = [
    {
      familia: "Familia 1",
      modelo: "Modelo 1",
      setup: "Setup 1",
      estencilTop: "Estencil Top 1",
      estencilBottom: "Estencil Bottom 1",
      navajaFront: "Navaja Front 1",
      navajaRear: "Navaja Rear 1",
      base: "Base 1",
    },
  ];

  return (
    <div className="container mt-4">
      <Toaster position="top-right" reverseOrder={false} />
      <h3 className="fw-bold">Base de Datos de Herramental</h3>
      <p className="text-muted">
        Gestión y registro de todos los herramentales disponibles en el proceso.
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
            <Settings size={18} />
            Herramental
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
            variant="primary"
            id="dropdown-familias"
            className="d-flex align-items-center gap-1"
          >
            <FolderKanban size={18} />
            Familias
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
            variant="primary"
            id="dropdown-modelos"
            className="d-flex align-items-center gap-1"
          >
            <Cpu size={18} />
            Modelos
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => setShowAddModelModal(true)}
              className="d-flex align-items-center gap-2 text-primary fw-semibold"
            >
              <Plus size={16} /> Nuevo modelo
            </Dropdown.Item>
            {/* ⚡ Reemplazamos 'Editar modelos' por 'Eliminar modelo' */}
            <Dropdown.Item
              onClick={() => setShowDeleteModelModal(true)}
              className="d-flex align-items-center gap-2 text-danger fw-semibold"
            >
              <Trash2 size={16} />
              Eliminar modelo
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* DROPDOWN: SETUP */}
        <Dropdown>
          <Dropdown.Toggle
            variant="primary"
            id="dropdown-setup"
            className="d-flex align-items-center gap-1"
          >
            <Settings size={18} />
            Setup
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item className="d-flex align-items-center gap-2">
              <Plus size={16} /> Configurar nuevo setup
            </Dropdown.Item>
            <Dropdown.Item className="d-flex align-items-center gap-2">
              <Edit size={16} /> Editar setups
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Stack>

      <DataTable columns={columns} data={data} pagination />

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

      {/* ⚡ Renderizamos el nuevo modal de eliminación de modelos */}
      <DeleteModel
        show={showDeleteModelModal}
        onHide={() => setShowDeleteModelModal(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

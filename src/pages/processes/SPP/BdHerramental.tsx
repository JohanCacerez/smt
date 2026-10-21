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
import ActionTooling from "../../../components/modals/ActionTooling"; // Importamos el nuevo modal de acción

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
  const [showActionModal, setShowActionModal] = useState<boolean>(false); // Nuevo estado

  const handleSuccess = () => {
    console.log("¡Acción procesada con éxito! Refrescando datos del sistema.");
  };

  // Tipado estricto para las columnas de react-data-table-component
  const columns: TableColumn<SmtRowData>[] = [
    {
      name: "Familia",
      selector: (row) => row.familia,
      sortable: true,
    },
    {
      name: "Modelo",
      selector: (row) => row.modelo,
      sortable: true,
    },
    {
      name: "Setup",
      selector: (row) => row.setup,
      sortable: true,
    },
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
    {
      name: "Navaja rear",
      selector: (row) => row.navajaRear,
      sortable: true,
    },
    {
      name: "Base",
      selector: (row) => row.base,
      sortable: true,
    },
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
              <Plus size={16} />
              Agregar herramental
            </Dropdown.Item>

            {/* ⚡ Reemplazamos 'Editar herramental' por 'Eliminar o mandar a Scrap' */}
            <Dropdown.Item
              onClick={() => setShowActionModal(true)}
              className="d-flex align-items-center gap-2 text-danger fw-semibold"
            >
              <Trash2 size={16} />
              Eliminar / Scrap herramental
            </Dropdown.Item>

            <Dropdown.Item
              onClick={() => setShowInventoryModal(true)}
              className="d-flex align-items-center gap-2 text-success fw-semibold"
            >
              <Eye size={16} />
              Ver inventario
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
            <FolderKanban size={18} />
            Familias
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item className="d-flex align-items-center gap-2">
              <Plus size={16} />
              Nueva familia
            </Dropdown.Item>
            <Dropdown.Item className="d-flex align-items-center gap-2">
              <Edit size={16} />
              Editar familias
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
            <Cpu size={18} />
            Modelos
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item className="d-flex align-items-center gap-2">
              <Plus size={16} />
              Nuevo modelo
            </Dropdown.Item>
            <Dropdown.Item className="d-flex align-items-center gap-2">
              <Edit size={16} />
              Editar modelos
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
            <Settings size={18} />
            Setup
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item className="d-flex align-items-center gap-2">
              <Plus size={16} />
              Configurar nuevo setup
            </Dropdown.Item>
            <Dropdown.Item className="d-flex align-items-center gap-2">
              <Edit size={16} />
              Editar setups
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Stack>

      {/* Tabla de Datos */}
      <DataTable columns={columns} data={data} pagination />

      {/* MODAL 1: REGISTRAR NUEVO */}
      <AddTooling
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSuccess={handleSuccess}
      />

      {/* MODAL 2: VER INVENTARIO */}
      <InventoryTooling
        show={showInventoryModal}
        onHide={() => setShowInventoryModal(false)}
      />

      {/* ⚡ MODAL 3: ACCIONES ELIMINAR / SCRAP */}
      <ActionTooling
        show={showActionModal}
        onHide={() => setShowActionModal(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

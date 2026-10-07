import React, { useState } from "react";
import DataTable from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";
import { UserPlus, MoreVertical, Pencil, Trash2, X, Save } from "lucide-react";

interface User {
  id: number | "";
  nombre: string;
  correo: string;
  puesto: string;
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      nombre: "Johan Cacerez",
      correo: "caj3cea@bosch.com",
      puesto: "Administrador",
    },
    {
      id: 2,
      nombre: "Ana Martínez",
      correo: "ana.martinez@example.com",
      puesto: "Desarrollador Frontend",
    },
    {
      id: 3,
      nombre: "Carlos Mendoza",
      correo: "carlos.mendoza@example.com",
      puesto: "Diseñador UI/UX",
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  // Guardamos el ID del usuario cuyo dropdown está abierto actualmente
  const [activeDropdownUserId, setActiveDropdownUserId] = useState<
    number | null
  >(null);

  const [selectedUser, setSelectedUser] = useState<User>({
    id: "",
    nombre: "",
    correo: "",
    puesto: "",
  });

  // --- CONTROL DE ACCIONES ---

  const handleOpenCreate = () => {
    setSelectedUser({ id: "", nombre: "", correo: "", puesto: "" });
    setShowCreateModal(true);
    setActiveDropdownUserId(null); // Cerrar cualquier menú abierto
  };

  const handleCreateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentIds = users.map((u) => (typeof u.id === "number" ? u.id : 0));
    const nextId = users.length > 0 ? Math.max(...currentIds) + 1 : 1;

    const newUser: User = {
      id: nextId,
      nombre: selectedUser.nombre,
      correo: selectedUser.correo,
      puesto: selectedUser.puesto,
    };

    setUsers([...users, newUser]);
    setShowCreateModal(false);
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
    setActiveDropdownUserId(null); // Cerrar menú
  };

  const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUsers(users.map((u) => (u.id === selectedUser.id ? selectedUser : u)));
    setShowEditModal(false);
  };

  const handleOpenDelete = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
    setActiveDropdownUserId(null); // Cerrar menú
  };

  const handleDeleteUser = () => {
    setUsers(users.filter((u) => u.id !== selectedUser.id));
    setShowDeleteModal(false);
  };

  // Alternar el estado de apertura de un dropdown de manera segura
  const toggleDropdown = (e: React.MouseEvent, userId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (activeDropdownUserId === userId) {
      setActiveDropdownUserId(null);
    } else {
      setActiveDropdownUserId(userId);
    }
  };

  // --- CONFIGURACIÓN DE LAS COLUMNAS ---
  const columns: TableColumn<User>[] = [
    {
      name: "ID",
      selector: (row: User) => row.id as number,
      sortable: true,
      width: "80px",
    },
    {
      name: "Nombre",
      selector: (row: User) => row.nombre,
      sortable: true,
    },
    {
      name: "Correo Electrónico",
      selector: (row: User) => row.correo,
      sortable: true,
    },
    {
      name: "Puesto",
      selector: (row: User) => row.puesto,
      sortable: true,
    },
    {
      name: "Acción",
      cell: (row: User, rowIndex: number) => {
        // <-- Añadimos rowIndex aquí
        const userId = row.id as number;
        const isDropdownOpen = activeDropdownUserId === userId;

        // Si es el último registro de la tabla, haremos que el menú se despliegue hacia arriba (Dropup)
        const isLastRow = rowIndex === users.length - 1;

        return (
          <div className="position-relative">
            <button
              className="btn btn-link text-secondary p-1"
              type="button"
              style={{ border: "none", boxShadow: "none" }}
              onClick={(e) => toggleDropdown(e, userId)}
            >
              <MoreVertical size={18} />
            </button>

            {/* Menú controlado por React */}
            {isDropdownOpen && (
              <ul
                className="dropdown-menu dropdown-menu-end show shadow-sm position-absolute"
                style={{
                  right: 0,
                  // Si es la última fila, se posiciona arriba (bottom: 100%), si no, abajo (top: 100%)
                  bottom: isLastRow ? "100%" : "auto",
                  top: isLastRow ? "auto" : "100%",
                  zIndex: 1000,
                  display: "block",
                  minWidth: "120px",
                  marginBottom: isLastRow ? "4px" : "0", // Margen superior si se despliega hacia arriba
                }}
              >
                <li>
                  <button
                    type="button"
                    className="dropdown-item d-flex align-items-center gap-2 text-primary"
                    onClick={() => handleOpenEdit(row)}
                  >
                    <Pencil size={14} />
                    Editar
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider my-1" />
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item d-flex align-items-center gap-2 text-danger"
                    onClick={() => handleOpenDelete(row)}
                  >
                    <Trash2 size={14} />
                    Eliminar
                  </button>
                </li>
              </ul>
            )}
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true, // <-- Asegura que el componente permita desbordar
      button: true,
      width: "100px",
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontWeight: "700",
        fontSize: "14px",
        backgroundColor: "#f8f9fa",
        color: "#495057",
        borderBottom: "2px solid #dee2e6",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
        minHeight: "56px",
        "&:not(:last-child)": {
          borderBottom: "1px solid #e9ecef",
        },
      },
    },
  };

  return (
    // Cerramos el menú si el usuario hace clic fuera de la tabla en cualquier parte de la pantalla
    <div
      className="container my-5"
      onClick={() => setActiveDropdownUserId(null)}
    >
      {/* Cabecera Principal */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0 text-dark">Gestión de Usuarios</h2>
          <p className="text-muted small mb-0">
            Panel de control y administración de cuentas de usuario
          </p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 fw-semibold"
          onClick={handleOpenCreate}
        >
          <UserPlus size={18} />
          Agregar Usuario
        </button>
      </div>

      {/* Contenedor de la Tabla */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-0">
          <DataTable
            columns={columns}
            data={users}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 30]}
            customStyles={customStyles}
            highlightOnHover
            noDataComponent={
              <div className="p-5 text-center text-muted">
                No hay usuarios registrados en el sistema.
              </div>
            }
          />
        </div>
      </div>

      {/* MODAL 1: AGREGAR USUARIO */}
      {showCreateModal && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title d-flex align-items-center gap-2">
                  <UserPlus size={20} /> Nuevo Usuario
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowCreateModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleCreateUser}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={selectedUser.nombre}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSelectedUser({
                          ...selectedUser,
                          nombre: e.target.value,
                        })
                      }
                      placeholder="Ej. Juan Pérez"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Correo Electrónico
                    </label>
                    <input
                      type="type"
                      className="form-control"
                      required
                      value={selectedUser.correo}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSelectedUser({
                          ...selectedUser,
                          correo: e.target.value,
                        })
                      }
                      placeholder="ejemplo@correo.com"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Puesto / Rol
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={selectedUser.puesto}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSelectedUser({
                          ...selectedUser,
                          puesto: e.target.value,
                        })
                      }
                      placeholder="Ej. Desarrollador"
                    />
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-outline-secondary d-flex align-items-center gap-1"
                    onClick={() => setShowCreateModal(false)}
                  >
                    <X size={16} /> Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary d-flex align-items-center gap-1"
                  >
                    <Save size={16} /> Guardar Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDITAR USUARIO */}
      {showEditModal && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title d-flex align-items-center gap-2 fw-bold">
                  <Pencil size={20} /> Editar Usuario #{selectedUser.id}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleUpdateUser}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={selectedUser.nombre}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSelectedUser({
                          ...selectedUser,
                          nombre: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      required
                      value={selectedUser.correo}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSelectedUser({
                          ...selectedUser,
                          correo: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Puesto / Rol
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={selectedUser.puesto}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSelectedUser({
                          ...selectedUser,
                          puesto: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-outline-secondary d-flex align-items-center gap-1"
                    onClick={() => setShowEditModal(false)}
                  >
                    <X size={16} /> Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-warning d-flex align-items-center gap-1 fw-bold"
                  >
                    <Save size={16} /> Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CONFIRMAR ELIMINACIÓN */}
      {showDeleteModal && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title d-flex align-items-center gap-2">
                  <Trash2 size={20} /> Eliminar Usuario
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowDeleteModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-4 text-center">
                <Trash2 size={48} className="text-danger mb-3" />
                <h5 className="fw-bold mb-2">¿Estás seguro?</h5>
                <p className="text-muted mb-0">
                  Estás a punto de eliminar permanentemente a{" "}
                  <strong>{selectedUser.nombre}</strong> ({selectedUser.correo}
                  ). Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="modal-footer bg-light justify-content-center">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={() => setShowDeleteModal(false)}
                >
                  No, Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger px-4"
                  onClick={handleDeleteUser}
                >
                  Sí, Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

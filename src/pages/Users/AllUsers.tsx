import { useEffect, useState } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import { X, Pencil } from "lucide-react";
import { supabase } from "../../supabaseClient";
import { AddUser } from "../../components/modals/AddUser";
import { EditUser } from "../../components/modals/EditUser";
import { DeleteUser } from "../../components/modals/DeleteUser"; // 1. Importamos el modal de borrado

interface UserTable {
  id: number;
  name: string;
  email: string;
  created_at: string;
  is_active: boolean;
  role_id: number;
  roles: {
    name: string;
  } | null;
}

export const AllUsers = () => {
  const [users, setUsers] = useState<UserTable[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Controles para los Modales
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  // 2. Controles para el Modal de Eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserTable | null>(null);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select(`
          id,
          name,
          email,
          created_at,
          is_active,
          role_id,
          roles (
            name
          )
        `);

      if (error) {
        throw error;
      }

      if (data) {
        setUsers(data as unknown as UserTable[]);
      }
    } catch (error) {
      const err = error as Error;
      console.error("Error cargando usuarios:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  const handleEdit = (user: UserTable) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // 3. Función para abrir el modal de confirmación de borrado
  const handleDeleteClick = (user: UserTable) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const columns: TableColumn<UserTable>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Correo",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Rol",
      selector: (row) => row.roles?.name || "Sin Rol",
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) => (row.is_active ? "Activo" : "Inactivo"),
      sortable: true,
      cell: (row) => (
        <span className={`badge ${row.is_active ? "bg-success" : "bg-danger"}`}>
          {row.is_active ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      name: "Acciones",
      ignoreRowClick: true,
      width: "150px",
      cell: (row) => (
        <section className="d-flex align-items-center py-2">
          <button
            className="btn btn-primary me-2"
            onClick={() => handleEdit(row)}
          >
            <Pencil size={16} />
          </button>
          {/* 4. Cambiamos el comportamiento del botón eliminar */}
          <button
            className="btn btn-danger"
            onClick={() => handleDeleteClick(row)}
          >
            <X size={16} />
          </button>
        </section>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2>Todos los Usuarios</h2>
          <p>Lista de todos los usuarios del sistema.</p>
        </div>
        <button
          className="btn btn-success mb-3"
          onClick={() => setIsModalOpen(true)}
        >
          Agregar Usuario
        </button>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          pagination
          animateRows
          noDataComponent="No se encontraron usuarios"
        />
      )}

      {/* Modal para Agregar */}
      <AddUser
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserAdded={fetchUsers}
      />

      {/* Modal para Editar */}
      <EditUser
        show={isEditModalOpen}
        user={selectedUser}
        onClose={() => setIsEditModalOpen(false)}
        onUserUpdated={fetchUsers}
      />

      {/* Modal para Eliminar */}
      <DeleteUser
        show={isDeleteModalOpen}
        user={selectedUser}
        onClose={() => setIsDeleteModalOpen(false)}
        onUserDeleted={fetchUsers}
      />
      <EditUser
        show={isEditModalOpen}
        user={selectedUser}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onUserUpdated={fetchUsers}
      />

      {/* 5. Renderizamos el Modal para Eliminar */}
      <DeleteUser
        show={isDeleteModalOpen}
        user={selectedUser}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onUserDeleted={fetchUsers}
      />
    </div>
  );
};

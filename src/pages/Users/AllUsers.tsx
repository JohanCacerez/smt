import { useEffect, useState } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import { X, Pencil } from "lucide-react";

// 1. Importa tu cliente de Supabase configurado
import { supabase } from "../../supabaseClient"; // Ajusta la ruta de importación según tu proyecto

// Definimos la interfaz del usuario que viene de la base de datos
interface UserTable {
  id: number;
  name: string;
  email: string;
  created_at: string;
  is_active: boolean;
  role_id: number;
  roles: {
    name: string; // Nombre del rol venido de la tabla relacionada 'roles'
  } | null; // Puede ser null si el usuario no tiene rol asignado
}

export const AllUsers = () => {
  // 2. Definimos estados para los datos, la carga (loading) y posibles errores
  // Iniciamos loading en true para no tener que activarlo síncronamente en el useEffect
  const [users, setUsers] = useState<UserTable[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 3. Función para obtener los datos desde Supabase
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
        // Tipamos la respuesta de forma segura
        setUsers(data as unknown as UserTable[]);
      }
    } catch (error) {
      // Solución al error "any": Tratamos el error de manera segura
      const err = error as Error;
      console.error("Error cargando usuarios:", err.message);
    } finally {
      // Apagamos el estado de carga una vez finaliza la petición
      setLoading(false);
    }
  };

  // 4. Cargamos los datos al montar el componente
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  const handleEdit = (email: string) => {
    console.log(`Edit user with email: ${email}`);
  };

  // 5. Ajustamos las columnas para leer los datos reales de Supabase
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
            onClick={() => handleEdit(row.email)}
          >
            <Pencil size={16} />
          </button>
          <button
            className="btn btn-danger"
            onClick={() => console.log(`Delete user with email: ${row.email}`)}
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
          onClick={() => console.log("Add new user")}
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
    </div>
  );
};

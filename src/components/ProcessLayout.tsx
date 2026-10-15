import { useParams, Outlet } from "react-router-dom";
// Importamos los Sidebars que diseñaremos para cada proceso
import { SPPSidebar } from "./sidebars/SPPSidebar";
import { DefaultSidebar } from "./sidebars/DefaultSidebar";

// 1. Mapeo de Sidebars Exclusivos por ID de proceso
// Cuando crees más Sidebars personalizados (como el de SPI con id "2"), solo los registras aquí
const sidebarsDeProcesos: Record<string, React.ComponentType> = {
  "1": SPPSidebar, // Proceso 1 cargará de forma exclusiva el menú de Impresión
};

export const ProcessLayout = () => {
  const { id } = useParams<{ id: string }>();
  const idProceso = id || "";

  // 2. Buscamos si existe un Sidebar único para este ID, de lo contrario cargamos el básico (Default)
  const SidebarDedicado = sidebarsDeProcesos[idProceso] || DefaultSidebar;

  return (
    <div className="d-flex w-100" style={{ minHeight: "calc(100vh - 56px)" }}>
      {/* Columna Izquierda: El Sidebar exclusivo del proceso */}
      <aside className="border-end d-none d-lg-block bg-dark">
        <SidebarDedicado />
      </aside>

      {/* Columna Derecha: Contenido dinámico del proceso */}
      <main className="flex-grow-1 p-4" style={{ backgroundColor: "#f8f9fa" }}>
        <Outlet />
      </main>
    </div>
  );
};

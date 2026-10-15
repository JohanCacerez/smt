import { NavLink } from "react-router-dom";
import { Activity, ClipboardList, PenTool, Database } from "lucide-react";

export const SPPSidebar = () => {
  return (
    <div
      className="bg-dark text-white p-3 d-flex flex-column h-100 shadow"
      style={{ width: "260px", minHeight: "calc(100vh - 56px)" }}
    >
      <div className="mb-4 pb-2 border-bottom border-secondary">
        <span className="text-muted small text-uppercase">Proceso 1</span>
        <h5 className="fw-bold mb-0 text-primary">Impresión Stencil</h5>
      </div>
      <nav className="nav flex-column gap-2 flex-grow-1">
        <NavLink
          to="/procesos/1"
          end
          className={({ isActive }) =>
            `nav-link d-flex align-items-center gap-2 rounded py-2 px-3 text-white-50 ${isActive ? "bg-primary text-white active" : "hover-bg-light"}`
          }
        >
          <Activity size={18} />
          <span>Monitor de Pasta</span>
        </NavLink>
        <NavLink
          to="/procesos/1/limpieza"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center gap-2 rounded py-2 px-3 text-white-50 ${isActive ? "bg-primary text-white active" : "hover-bg-light"}`
          }
        >
          <PenTool size={18} />
          <span>Ciclos de Limpieza</span>
        </NavLink>
        <NavLink
          to="/procesos/1/stencils"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center gap-2 rounded py-2 px-3 text-white-50 ${isActive ? "bg-primary text-white active" : "hover-bg-light"}`
          }
        >
          <Database size={18} />
          <span>Inventario Stencils</span>
        </NavLink>
        <NavLink
          to="/procesos/1/calibracion"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center gap-2 rounded py-2 px-3 text-white-50 ${isActive ? "bg-primary text-white active" : "hover-bg-light"}`
          }
        >
          <ClipboardList size={18} />
          <span>Presión de Rasquetas</span>
        </NavLink>
      </nav>
    </div>
  );
};

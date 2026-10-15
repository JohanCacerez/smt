import { NavLink } from "react-router-dom";
import { CircleGauge, PackageCheck, RobotArm, Database } from "lucide-react";

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
          <CircleGauge size={18} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/procesos/1/machines"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center gap-2 rounded py-2 px-3 text-white-50 ${isActive ? "bg-primary text-white active" : "hover-bg-light"}`
          }
        >
          <RobotArm size={18} />
          <span>Equipos</span>
        </NavLink>
        <NavLink
          to="/procesos/1/bd_herramental"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center gap-2 rounded py-2 px-3 text-white-50 ${isActive ? "bg-primary text-white active" : "hover-bg-light"}`
          }
        >
          <Database size={18} />
          <span>BD de herramental</span>
        </NavLink>
        <NavLink
          to="/procesos/1/gheekra"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center gap-2 rounded py-2 px-3 text-white-50 ${isActive ? "bg-primary text-white active" : "hover-bg-light"}`
          }
        >
          <PackageCheck size={18} />
          <span>E/S de herramental</span>
        </NavLink>
      </nav>
    </div>
  );
};

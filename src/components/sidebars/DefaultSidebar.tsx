import { NavLink, useParams } from "react-router-dom";
import { HelpCircle, ArrowLeft } from "lucide-react";

export const DefaultSidebar = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div
      className="bg-dark text-white p-3 d-flex flex-column h-100 shadow"
      style={{ width: "260px", minHeight: "calc(100vh - 56px)" }}
    >
      <div className="mb-4 pb-2 border-bottom border-secondary">
        <span className="text-muted small text-uppercase">Proceso SMT</span>
        <h5 className="fw-bold mb-0 text-warning">Módulo #{id}</h5>
      </div>
      <nav className="nav flex-column gap-2 flex-grow-1">
        <NavLink
          to={`/procesos/${id}`}
          end
          className={({ isActive }) =>
            `nav-link d-flex align-items-center gap-2 rounded py-2 px-3 text-white-50 ${isActive ? "bg-primary text-white active" : "hover-bg-light"}`
          }
        >
          <HelpCircle size={18} />
          <span>En Desarrollo</span>
        </NavLink>
      </nav>
      <div className="pt-2 border-top border-secondary">
        <NavLink
          to="/procesos"
          className="nav-link d-flex align-items-center gap-2 text-muted py-2"
        >
          <ArrowLeft size={16} />
          <span className="small text-white-50">Volver a Procesos</span>
        </NavLink>
      </div>
    </div>
  );
};

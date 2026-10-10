import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Ajusta la ruta

interface UserTable {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  role_id: number;
}

interface EditUserModalProps {
  show: boolean;
  user: UserTable | null; // El usuario seleccionado para editar
  onClose: () => void;
  onUserUpdated: () => void; // Para refrescar la tabla principal al terminar
}

export const EditUser = ({
  show,
  user,
  onClose,
  onUserUpdated,
}: EditUserModalProps) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [roleId, setRoleId] = useState<string>("1");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Efecto para rellenar el formulario con los datos del usuario cuando se abre el modal
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(user.name);
      setEmail(user.email);
      setRoleId(user.role_id.toString());
      setIsActive(user.is_active);
      setErrorMsg(null);
    }
  }, [user, show]);

  if (!show || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Actualizar los datos en la tabla pública de usuarios
      const { error: dbError } = await supabase
        .from("users")
        .update({
          name,
          email,
          role_id: parseInt(roleId),
          is_active: isActive,
        })
        .eq("id", user.id); // Filtra por el ID del usuario seleccionado

      if (dbError) throw dbError;

      onUserUpdated(); // Recarga la tabla de la vista principal
      onClose(); // Cierra el modal
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || "Ocurrió un error al actualizar el usuario");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop oscuro */}
      <div className="modal-backdrop fade show" onClick={onClose}></div>

      <div className="modal fade show d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              <h5 className="modal-title">Editar Usuario (ID: {user.id})</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {errorMsg && (
                  <div className="alert alert-danger" role="alert">
                    {errorMsg}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Nombre Completo</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Rol del Usuario</label>
                  <select
                    className="form-select"
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                  >
                    <option value="1">Visitante</option>
                    <option value="2">Técnico</option>
                    <option value="3">Ingeniero</option>
                    <option value="4">Administrador</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label d-block">
                    Estado del Usuario
                  </label>
                  <div className="form-check form-switch mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="isActiveSwitch"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="isActiveSwitch"
                    >
                      {isActive ? "Usuario Activo" : "Usuario Inactivo"}
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

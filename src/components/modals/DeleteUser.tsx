import { useState } from "react";
import { supabase } from "../../supabaseClient"; // Ajusta la ruta

interface UserTable {
  id: number;
  name: string;
  email: string;
}

interface DeleteUserModalProps {
  show: boolean;
  user: UserTable | null; // El usuario seleccionado para eliminar
  onClose: () => void;
  onUserDeleted: () => void; // Para refrescar la tabla principal
}

export const DeleteUser = ({
  show,
  user,
  onClose,
  onUserDeleted,
}: DeleteUserModalProps) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!show || !user) return null;

  const handleDelete = async () => {
    setSubmitting(true);
    setErrorMsg(null);

    try {
      // Eliminamos de la tabla pública 'users' usando el email como identificador
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("email", user.email);

      if (error) throw error;

      onUserDeleted(); // Recarga la tabla de la vista principal
      onClose(); // Cierra el modal
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "Ocurrió un error al eliminar el usuario");
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
            <div className="modal-header d-flex justify-content-between align-items-center bg-danger text-white">
              <h5 className="modal-title">Confirmar Eliminación</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body my-2">
              {errorMsg && (
                <div className="alert alert-danger" role="alert">
                  {errorMsg}
                </div>
              )}
              <p className="fs-5">
                ¿Estás seguro de que deseas eliminar al usuario{" "}
                <strong>{user.name}</strong>?
              </p>
              <p className="text-muted small">
                Esta acción eliminará de forma permanente al usuario con el
                correo <strong>{user.email}</strong> de la base de datos y de
                los registros de autenticación de Supabase. Esta acción no se
                puede deshacer.
              </p>
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
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={submitting}
              >
                {submitting ? "Eliminando..." : "Eliminar Permanentemente"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

import React, { useState } from "react";
import { supabase } from "../../supabaseClient"; // Ajusta la ruta

interface AddUserModalProps {
  show: boolean;
  onClose: () => void;
  onUserAdded: () => void; // Para recargar la tabla principal al terminar
}

export const AddUser = ({ show, onClose, onUserAdded }: AddUserModalProps) => {
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [roleId, setRoleId] = useState<string>("1"); // ID por defecto (ej. visitante)
  const [password, setPassword] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Opcional: Registrar en Supabase Auth si necesitas que inicien sesión
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Insertar el registro en tu tabla de base de datos 'users'
      // Usamos el ID ingresado manualmente (o puedes usar authData.user?.id si prefieres el UUID autogenerado)
      const { error: dbError } = await supabase.from("users").insert([
        {
          id: parseInt(id) || authData.user?.id, // Usa el entero ingresado o el UUID de auth
          name,
          email,
          role_id: parseInt(roleId),
          is_active: true,
        },
      ]);

      if (dbError) throw dbError;

      // Limpiar formulario y cerrar modal exitosamente
      setId("");
      setName("");
      setEmail("");
      setPassword("");
      setRoleId("1");
      onUserAdded(); // Recarga la tabla de la vista principal
      onClose(); // Cierra el modal
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || "Ocurrió un error al registrar el usuario");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop oscuro para simular el comportamiento de Bootstrap */}
      <div className="modal-backdrop fade show" onClick={onClose}></div>

      <div className="modal fade show d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              <h5 className="modal-title">Agregar Nuevo Usuario</h5>
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
                  <label className="form-label">ID de Usuario (Numérico)</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="Ej. 12345"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Nombre Completo</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
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
                    placeholder="correo@ejemplo.com"
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
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                  />
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
                  className="btn btn-success"
                  disabled={submitting}
                >
                  {submitting ? "Guardando..." : "Registrar Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

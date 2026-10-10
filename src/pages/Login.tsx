import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Si utilizas react-router para navegar
import { supabase } from "../supabaseClient"; // Ajusta la ruta
import { useAuthStore } from "../store/useAuthStore"; // Ajusta la ruta

export const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Autenticar en Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw authError;

      if (authData?.user && authData.session) {
        const userEmail = authData.user.email;

        // 2. Obtener los datos personalizados de la tabla 'users'
        const { data: dbData, error: dbError } = await supabase
          .from("users")
          .select(
            `
      id,
      name,
      email,
      is_active,
      role_id,
      roles (
        name
      )
    `,
          )
          .eq("email", userEmail)
          .single();

        if (dbError) throw dbError;

        if (dbData && !dbData.is_active) {
          throw new Error(
            "Tu cuenta está inhabilitada temporalmente. Contacta al administrador.",
          );
        }

        if (dbData) {
          // Manejo seguro del tipado del rol retornado como arreglo u objeto por Supabase
          const rawRoles = dbData.roles;
          const roleName = Array.isArray(rawRoles)
            ? rawRoles[0]?.name
            : // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (rawRoles as any)?.name;

          const userProfile = {
            id: dbData.id,
            name: dbData.name,
            email: dbData.email,
            is_active: dbData.is_active,
            role_id: dbData.role_id,
            role_name: roleName || "Sin Rol",
          };

          // 4. Guardar datos en el Store de Zustand
          loginStore(userProfile, authData.session.access_token);

          // 5. Redireccionar al usuario
          navigate("/dashboard");
        }
      }
    } catch (err) {
      const error = err as Error;
      setErrorMsg(
        error.message || "Error al iniciar sesión. Revisa tus credenciales.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ width: "400px", borderRadius: "12px" }}
      >
        <div className="card-body">
          <h2 className="card-title text-center mb-4 font-weight-bold">
            Iniciar Sesión
          </h2>

          {errorMsg && (
            <div className="alert alert-danger" role="alert">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Correo Electrónico</label>
              <input
                type="email"
                className="form-control"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mt-3 py-2"
              disabled={loading}
            >
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : null}
              {loading ? "Cargando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

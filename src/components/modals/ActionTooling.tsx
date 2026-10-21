import { useState, type FormEvent, type ChangeEvent } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { Trash2, AlertTriangle, ShieldAlert, Archive, X } from "lucide-react";
import { supabase } from "../../supabaseClient"; // Ajusta la ruta a tu cliente de Supabase
import { toast } from "react-hot-toast";

interface ActionToolingModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess?: () => void;
}

export default function ActionTooling({
  show,
  onHide,
  onSuccess,
}: ActionToolingModalProps) {
  const [dmc, setDmc] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"scrap" | "delete" | null>(null);

  // Limpiar estados al cerrar el modal
  const handleClose = () => {
    setDmc("");
    setActionType(null);
    onHide();
  };

  const handleAction = async (e: FormEvent) => {
    e.preventDefault();
    if (!dmc.trim() || !actionType) return;
    setIsSubmitting(true);

    const ejecutarAccion = async () => {
      // 1. Validar primero si el herramental existe
      const { data: existCheck, error: fetchError } = await supabase
        .from("tooling")
        .select("id")
        .eq("dmc", dmc.trim())
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!existCheck)
        throw new Error("El código DMC ingresado no existe en el inventario.");

      // 2. Ejecutar según acción seleccionada
      if (actionType === "scrap") {
        const { error } = await supabase
          .from("tooling")
          .update({ status: "Scrap" })
          .eq("dmc", dmc.trim());
        if (error) throw error;
        return "scrap";
      } else {
        const { error } = await supabase
          .from("tooling")
          .delete()
          .eq("dmc", dmc.trim());
        if (error) throw error;
        return "delete";
      }
    };

    // ⚡ Mostramos una notificación dinámica de carga/éxito/error
    toast.promise(ejecutarAccion(), {
      loading: "Procesando solicitud en la base de datos...",
      success: (res) =>
        res === "scrap"
          ? "El herramental se marcó como Scrap con éxito"
          : "Registro eliminado permanentemente del sistema",
      error: (err) => `${err.message}`,
    });

    try {
      await ejecutarAccion();
      if (onSuccess) onSuccess();
      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop={isSubmitting ? "static" : true}
    >
      <Modal.Header closeButton={!isSubmitting} className="bg-light">
        <Modal.Title className="fw-bold fs-5 d-flex align-items-center gap-2 text-danger">
          <Trash2 size={20} />
          Dar de Baja / Eliminar Herramental
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleAction}>
        <Modal.Body>
          <p className="text-muted small">
            Por favor escanea o ingresa el DMC del herramental que deseas
            procesar y selecciona la acción correspondiente.
          </p>

          {/* Campo de lectura del DMC */}
          <Form.Group className="mb-3" controlId="actionFormDmc">
            <Form.Label className="fw-semibold">
              Código DMC / Número de Serie
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Escanee o escriba el código..."
              value={dmc}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDmc(e.target.value)
              }
              required
              autoFocus
              disabled={isSubmitting}
            />
          </Form.Group>

          {/* Selector visual de Acción */}
          <div className="mb-3">
            <Form.Label className="fw-semibold d-block">
              Selecciona la Acción:
            </Form.Label>

            <div className="d-flex gap-2">
              <Button
                type="button"
                variant={actionType === "scrap" ? "warning" : "outline-warning"}
                className={`flex-fill d-flex flex-column align-items-center p-3 gap-1 ${
                  actionType === "scrap" ? "text-dark fw-bold" : "text-dark"
                }`}
                onClick={() => setActionType("scrap")}
                disabled={isSubmitting}
              >
                <Archive size={24} />
                Marcar como Scrap
              </Button>

              <Button
                type="button"
                variant={actionType === "delete" ? "danger" : "outline-danger"}
                className={`flex-fill d-flex flex-column align-items-center p-3 gap-1 ${
                  actionType === "delete" ? "fw-bold" : ""
                }`}
                onClick={() => setActionType("delete")}
                disabled={isSubmitting}
              >
                <AlertTriangle size={24} />
                Eliminar Registro
              </Button>
            </div>
          </div>

          {/* Alertas dinámicas según la opción elegida */}
          {actionType === "scrap" && (
            <Alert
              variant="warning"
              className="d-flex gap-2 align-items-center py-2 mb-0"
            >
              <ShieldAlert size={20} className="flex-shrink-0" />
              <div className="small">
                <strong>Efecto:</strong> El herramental permanecerá en el
                sistema pero su estado cambiará a <strong>Scrap</strong>. Útil
                para historial de calidad.
              </div>
            </Alert>
          )}

          {actionType === "delete" && (
            <Alert
              variant="danger"
              className="d-flex gap-2 align-items-center py-2 mb-0"
            >
              <ShieldAlert size={20} className="flex-shrink-0" />
              <div className="small">
                <strong>Efecto crítico:</strong> El registro se borrará{" "}
                <strong>permanentemente</strong> de Supabase. Útil para corregir
                errores de captura de serie.
              </div>
            </Alert>
          )}
        </Modal.Body>

        <Modal.Footer className="bg-light">
          <Button
            variant="outline-secondary"
            onClick={handleClose}
            className="d-flex align-items-center gap-1"
            disabled={isSubmitting}
          >
            <X size={16} />
            Cancelar
          </Button>

          <Button
            variant={actionType === "delete" ? "danger" : "primary"}
            type="submit"
            className="d-flex align-items-center gap-1"
            disabled={isSubmitting || !actionType || !dmc.trim()}
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" />
                Procesando...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Confirmar Acción
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

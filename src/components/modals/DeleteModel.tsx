import { useState, type FormEvent, type ChangeEvent } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { Trash2, AlertTriangle, ShieldAlert, X } from "lucide-react";
import { supabase } from "../../supabaseClient"; // Ajusta la ruta a tu cliente de Supabase
import { toast } from "react-hot-toast";

interface DeleteModelProps {
  show: boolean;
  onHide: () => void;
  onSuccess?: () => void;
}

export default function DeleteModel({
  show,
  onHide,
  onSuccess,
}: DeleteModelProps) {
  const [modelName, setModelName] = useState<string>("");
  const [confirmationName, setConfirmationName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Limpiar el estado al cerrar
  const handleClose = () => {
    setModelName("");
    setConfirmationName("");
    onHide();
  };

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    const targetModel = modelName.trim().toUpperCase();
    const confirmedName = confirmationName.trim().toUpperCase();

    if (!targetModel || targetModel !== confirmedName) return;

    setIsSubmitting(true);

    // ⚡ Definimos la función de borrado de red único
    const eliminarModeloYSetup = async () => {
      // 1. Validar primero si el modelo existe en la base de datos y obtener su ID
      const { data: modelData, error: fetchError } = await supabase
        .from("models")
        .select("id")
        .eq("name", targetModel)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!modelData) {
        throw new Error(`El modelo "${targetModel}" no existe en el catálogo.`);
      }

      // 2. ELIMINACIÓN DEL SETUP (Si es que tiene uno configurado)
      const { error: setupDeleteError } = await supabase
        .from("setups")
        .delete()
        .eq("model_id", modelData.id);

      if (setupDeleteError) throw setupDeleteError;

      // 3. ELIMINACIÓN DEL MODELO
      const { error: modelDeleteError } = await supabase
        .from("models")
        .delete()
        .eq("id", modelData.id);

      if (modelDeleteError) throw modelDeleteError;

      return targetModel;
    };

    // ⚡ Lanzamos la promesa una sola vez
    const promesaUnica = eliminarModeloYSetup();

    toast.promise(promesaUnica, {
      loading: "Procesando baja del modelo y recetas asociadas...",
      success: (name) =>
        `Modelo "${name}" y su setup asociados eliminados con éxito. 🗑️`,
      error: (err) => `${err.message || err}`,
    });

    try {
      await promesaUnica;
      if (onSuccess) onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error al eliminar modelo en Supabase:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Comprobar si el texto de confirmación coincide exactamente para habilitar el botón
  const isButtonDisabled =
    isSubmitting ||
    !modelName.trim() ||
    modelName.trim().toUpperCase() !== confirmationName.trim().toUpperCase();

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
          Eliminar Modelo de PCB
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleDelete}>
        <Modal.Body>
          <Alert
            variant="danger"
            className="d-flex gap-2 align-items-start py-2 small mb-3"
          >
            <AlertTriangle size={24} className="flex-shrink-0 text-danger" />
            <div>
              <strong>¡Advertencia Crítica de Trazabilidad!</strong>
              <div className="text-muted">
                Esta acción borrará permanentemente el modelo y la receta de su
                <strong> setup de SMT</strong> asociado de forma automática.
              </div>
            </div>
          </Alert>

          {/* Campo 1: Modelo a eliminar */}
          <Form.Group className="mb-3" controlId="deleteFormModelName">
            <Form.Label className="fw-semibold">
              Modelo / Número de Parte a eliminar
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: PP89-A, 2345..."
              value={modelName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setModelName(e.target.value.toUpperCase())
              }
              required
              autoFocus
              disabled={isSubmitting}
            />
          </Form.Group>

          {/* Campo 2: Confirmación de Seguridad */}
          <Form.Group className="mb-3" controlId="deleteFormConfirm">
            <Form.Label className="fw-semibold text-danger d-flex align-items-center gap-1">
              <ShieldAlert size={16} />
              Escribe el nombre del modelo para confirmar:
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Escribe exactamente el mismo nombre de arriba..."
              value={confirmationName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setConfirmationName(e.target.value.toUpperCase())
              }
              required
              disabled={isSubmitting || !modelName.trim()}
              autoComplete="off" // Deshabilita el autocompletado para forzar la escritura real
            />
          </Form.Group>
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
            variant="danger"
            type="submit"
            className="d-flex align-items-center gap-1"
            disabled={isButtonDisabled} // Habilitado solo si los textos coinciden exactamente
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Confirmar Eliminación
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

import { useState, type FormEvent, type ChangeEvent } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { FolderKanban, Save, X, Type } from "lucide-react";
import { supabase } from "../../supabaseClient"; // Ajusta la ruta a tu cliente de Supabase
import { toast } from "react-hot-toast";

interface AddFamilyProps {
  show: boolean;
  onHide: () => void;
  onSuccess?: () => void; // Para avisar al padre que refresque si es necesario
}

export default function AddFamily({ show, onHide, onSuccess }: AddFamilyProps) {
  const [familyName, setFamilyName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Manejar el cambio de valores forzando mayúsculas para estandarizar (ej: FED, PP)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFamilyName(e.target.value.toUpperCase());
  };

  // Cierre y limpieza del formulario
  const handleClose = () => {
    setFamilyName("");
    onHide();
  };

  // Guardar Familia en Supabase con validación de duplicados (Llamada única controlada)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanName = familyName.trim();
    if (!cleanName) return;

    setIsSubmitting(true);

    // 1. Definimos la lógica asíncrona de inserción
    const guardarFamilia = async () => {
      // Validar si ya existe una familia con ese mismo nombre
      const { data: existingFamily, error: fetchError } = await supabase
        .from("families")
        .select("id")
        .eq("name", cleanName)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingFamily) {
        throw new Error(`La familia "${cleanName}" ya está registrada.`);
      }

      // Si no existe, procedemos a insertar el registro de forma única
      const { data, error: insertError } = await supabase
        .from("families")
        .insert([{ name: cleanName }])
        .select();

      if (insertError) throw insertError;
      return data;
    };

    // 2. Iniciamos el envío de red UNA sola vez y guardamos la referencia de la promesa
    const promesaUnica = guardarFamilia();

    // 3. Vinculamos el Toaster a esa única promesa activa
    toast.promise(promesaUnica, {
      loading: "Validando y registrando familia...",
      success: "¡Nueva familia registrada con éxito! 📂",
      error: (err) => `${err.message || err}`,
    });

    try {
      // Esperamos que la promesa única resuelva de forma exitosa
      await promesaUnica;
      if (onSuccess) onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error al registrar familia en Supabase:", error);
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
        <Modal.Title className="fw-bold fs-5 d-flex align-items-center gap-2">
          <FolderKanban size={20} className="text-primary" />
          Nueva Familia de PCBs
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <p className="text-muted small">
            Define una nueva categoría o familia para agrupar tus modelos de
            tarjetas electrónicas en producción (ej: FED, PP, WL).
          </p>

          {/* Campo Nombre de Familia */}
          <Form.Group className="mb-3" controlId="formFamilyName">
            <Form.Label className="fw-semibold d-flex align-items-center gap-1">
              <Type size={16} className="text-muted" />
              Nombre de la Familia
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: FED, PP, WSE..."
              value={familyName}
              onChange={handleChange}
              required
              autoFocus
              disabled={isSubmitting}
            />
            <Form.Text className="text-muted">
              El nombre se guardará automáticamente en letras mayúsculas para
              estandarización.
            </Form.Text>
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
            variant="primary"
            type="submit"
            className="d-flex align-items-center gap-1"
            disabled={isSubmitting || !familyName.trim()}
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={16} />
                Guardar Familia
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

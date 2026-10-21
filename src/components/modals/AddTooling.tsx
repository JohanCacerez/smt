import { useState, type FormEvent, type ChangeEvent } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { Wrench, Hash, Save, X } from "lucide-react";
import { supabase } from "../../supabaseClient"; // Ajusta la ruta según tu estructura de archivos
import { toast } from "react-hot-toast";

// Definimos la estructura de los datos que captura el formulario
export interface HerramentalFormData {
  dmc: string;
  tipo: string;
}

// Propiedades que recibirá este componente
interface AddToolingProps {
  show: boolean;
  onHide: () => void;
  onSuccess?: () => void; // Callback opcional para avisar al padre que se guardó un registro y refrescar la tabla
}

export default function AddTooling({
  show,
  onHide,
  onSuccess,
}: AddToolingProps) {
  // Estado local fuertemente tipado
  const [formData, setFormData] = useState<HerramentalFormData>({
    dmc: "",
    tipo: "",
  });

  // Estado para controlar el envío a la base de datos
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Manejar el cambio de valores con tipado de eventos de React
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar el cierre y limpieza del formulario
  const handleClose = () => {
    setFormData({ dmc: "", tipo: "" });
    onHide();
  };

  // Manejar el envío con llamada directa a Supabase
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ⚡ Definimos la promesa de guardado en Supabase
    const guardarPromesa = async () => {
      const { data, error } = await supabase
        .from("tooling")
        .insert([
          { dmc: formData.dmc, type: formData.tipo, status: "Almacenado" },
        ])
        .select();

      if (error) throw error;
      return data;
    };

    // ⚡ Ejecutamos toast.promise para manejar los 3 estados automáticamente
    toast.promise(guardarPromesa(), {
      loading: "Registrando herramental en la base de datos...",
      success: "¡Herramental registrado con éxito!",
      error: (err) => `Error al registrar: ${err.message || err}`,
    });

    try {
      await guardarPromesa();
      if (onSuccess) onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error al registrar en Supabase:", error);
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
          <Wrench size={20} className="text-primary" />
          Registrar Nuevo Herramental
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <p className="text-muted small">
            Por favor escanea o ingresa el DMC único y selecciona el tipo de
            herramental para su registro en el inventario.
          </p>

          {/* Campo DMC */}
          <Form.Group className="mb-3" controlId="formDmc">
            <Form.Label className="fw-semibold d-flex align-items-center gap-1">
              <Hash size={16} className="text-muted" />
              Código DMC / Número de Serie
            </Form.Label>
            <Form.Control
              type="text"
              name="dmc"
              placeholder="Escanee o escriba el código..."
              value={formData.dmc}
              onChange={handleChange}
              required
              autoFocus
              disabled={isSubmitting} // Deshabilitado durante la subida
            />
          </Form.Group>

          {/* Campo Tipo de Herramental */}
          <Form.Group className="mb-3" controlId="formTipoHerramental">
            <Form.Label className="fw-semibold">Tipo de Herramental</Form.Label>
            <Form.Select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              disabled={isSubmitting} // Deshabilitado durante la subida
            >
              <option value="">Selecciona una opción...</option>
              <option value="estencil">Esténcil</option>
              <option value="base">Base</option>
              <option value="navaja">Navaja</option>
              <option value="pasta">Pasta</option>
            </Form.Select>
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
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" />
                Registrando...
              </>
            ) : (
              <>
                <Save size={16} />
                Guardar Registro
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

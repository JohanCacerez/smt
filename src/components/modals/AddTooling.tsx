import { useState, type FormEvent, type ChangeEvent } from "react";
import { Modal, Button, Form, Spinner, Row, Col } from "react-bootstrap";
import { Wrench, Hash, Save, X, MapPin } from "lucide-react";
import { supabase } from "../../supabaseClient"; // Ajusta la ruta según tu estructura de archivos
import { toast } from "react-hot-toast";

// Definimos la estructura de los datos que captura el formulario
export interface HerramentalFormData {
  dmc: string;
  tipo: string;
  rack: string; // ⚡ Nuevo campo
  position: string; // ⚡ Nuevo campo
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
  // Estado local fuertemente tipado con los nuevos campos
  const [formData, setFormData] = useState<HerramentalFormData>({
    dmc: "",
    tipo: "",
    rack: "", // Inicializamos vacíos
    position: "",
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
    setFormData({ dmc: "", tipo: "", rack: "", position: "" });
    onHide();
  };

  // Manejar el envío con llamada directa a Supabase
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Creamos la función que realiza la llamada ÚNICA a Supabase
    const registrarHerramental = async () => {
      const cleanDmc = formData.dmc.trim().toUpperCase();

      // Validación preventiva de duplicado (Local, antes de mandar el INSERT)
      const { data: existCheck, error: fetchError } = await supabase
        .from("tooling")
        .select("id")
        .eq("dmc", cleanDmc)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (existCheck) {
        throw new Error(
          `El código DMC "${cleanDmc}" ya existe en el inventario.`,
        );
      }

      // Inserción ÚNICA
      const { data, error } = await supabase
        .from("tooling")
        .insert([
          {
            dmc: cleanDmc,
            type: formData.tipo,
            status: "Almacenado",
            rack: formData.rack.trim().toUpperCase(),
            position: formData.position.trim().toUpperCase(),
          },
        ])
        .select();

      if (error) throw error;
      return data;
    };

    // 2. Guardamos la ejecución de la promesa en una variable para dispararla UNA sola vez
    const promesaUnica = registrarHerramental();

    // 3. Pasamos esa promesa única tanto a toast.promise como al bloque try/await
    toast.promise(promesaUnica, {
      loading: "Registrando herramental en la base de datos...",
      success: "¡Herramental registrado con éxito! 🎉",
      error: (err) => `${err.message || err}`,
    });

    try {
      // Esperamos la resolución de la promesa única que ya se está ejecutando
      await promesaUnica;

      if (onSuccess) onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error en el registro único de Supabase:", error);
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
            Por favor escanea o ingresa el DMC único, selecciona el tipo de
            herramental y su ubicación en el inventario.
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

          {/* ⚡ SECCIÓN VISUAL DE UBICACIÓN (RACK Y POSICIÓN) */}
          <hr className="my-3 text-muted opacity-25" />
          <Form.Label className="fw-semibold d-flex align-items-center gap-1 text-primary mb-3">
            <MapPin size={18} />
            Ubicación de Almacenamiento
          </Form.Label>

          <Row>
            {/* Campo Rack */}
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formRack">
                <Form.Label className="small fw-semibold text-secondary">
                  Rack
                </Form.Label>
                <Form.Control
                  type="text"
                  name="rack"
                  placeholder="Ej: Rack A, Rack B"
                  value={formData.rack}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </Form.Group>
            </Col>

            {/* Campo Posición */}
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formPosition">
                <Form.Label className="small fw-semibold text-secondary">
                  Posición / Slot
                </Form.Label>
                <Form.Control
                  type="text"
                  name="position"
                  placeholder="Ej: 30T, 12B"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </Form.Group>
            </Col>
          </Row>
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

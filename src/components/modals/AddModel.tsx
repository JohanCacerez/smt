import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { Cpu, Save, X, Hash, FolderKanban } from "lucide-react";
import { supabase } from "../../supabaseClient"; // Ajusta la ruta a tu cliente de Supabase
import { toast } from "react-hot-toast";

// Interfaces de tipos
interface FamilyItem {
  id: number;
  name: string;
}

interface AddModelProps {
  show: boolean;
  onHide: () => void;
  onSuccess?: () => void;
}

export default function AddModel({ show, onHide, onSuccess }: AddModelProps) {
  // Estados para el formulario
  const [modelName, setModelName] = useState<string>("");
  const [selectedFamilyId, setSelectedTypeFamilyId] = useState<string>("");

  // Estados de carga e inventario de familias
  const [families, setFamilies] = useState<FamilyItem[]>([]);
  const [loadingFamilies, setLoadingFamilies] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // ⚡ Cargar las familias de Supabase para llenar la lista desplegable
  const fetchFamilies = async () => {
    setLoadingFamilies(true);
    try {
      const { data, error } = await supabase
        .from("families")
        .select("id, name")
        .order("name", { ascending: true });

      if (error) throw error;
      setFamilies(data || []);
    } catch (error: unknown) {
      console.error("Error al obtener familias:", error);
      toast.error(
        `Error al cargar familias: ${(error as Error).message || error}`,
      );
    } finally {
      setLoadingFamilies(false);
    }
  };

  // Cargar familias automáticamente al abrir el modal
  useEffect(() => {
    if (show) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchFamilies();
    }
  }, [show]);

  // Limpiar formulario al cerrar
  const handleClose = () => {
    setModelName("");
    setSelectedTypeFamilyId("");
    onHide();
  };

  // Guardar nuevo modelo con validación de duplicados
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanModelName = modelName.trim().toUpperCase(); // Forzar mayúsculas para estandarización
    const familyId = Number(selectedFamilyId);

    if (!cleanModelName || isNaN(familyId)) return;

    setIsSubmitting(true);

    const guardarModeloPromesa = async () => {
      // 1. Validar que no exista otro modelo con el mismo nombre
      const { data: existingModel, error: fetchError } = await supabase
        .from("models")
        .select("id")
        .eq("name", cleanModelName)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingModel) {
        throw new Error(
          `El modelo / número de parte "${cleanModelName}" ya está registrado.`,
        );
      }

      // 2. Insertar en la tabla 'models'
      const { data, error: insertError } = await supabase
        .from("models")
        .insert([
          {
            name: cleanModelName,
            id_family: familyId,
          },
        ])
        .select();

      if (insertError) throw insertError;
      return data;
    };

    toast.promise(guardarModeloPromesa(), {
      loading: "Validando y registrando modelo...",
      success: "¡Nuevo modelo registrado con éxito!",
      error: (err) => `${err.message || err}`,
    });

    try {
      await guardarModeloPromesa();
      if (onSuccess) onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error al registrar modelo en Supabase:", error);
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
          <Cpu size={20} className="text-primary" />
          Registrar Nuevo Modelo (PCB)
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <p className="text-muted small">
            Registra un nuevo número de parte para tus tarjetas electrónicas de
            SMT y asígnalo a su correspondiente familia.
          </p>

          {/* Campo: Número de Parte del Modelo */}
          <Form.Group className="mb-3" controlId="formModelName">
            <Form.Label className="fw-semibold d-flex align-items-center gap-1">
              <Hash size={16} className="text-muted" />
              Número de Parte del Modelo
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: 2345, PP89-A..."
              value={modelName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setModelName(e.target.value.toUpperCase())
              }
              required
              autoFocus
              disabled={isSubmitting}
            />
            <Form.Text className="text-muted">
              Permite caracteres alfanuméricos y letras. Se guardará en
              mayúsculas.
            </Form.Text>
          </Form.Group>

          {/* Campo: Selector de Familia */}
          <Form.Group className="mb-3" controlId="formSelectedFamily">
            <Form.Label className="fw-semibold d-flex align-items-center gap-1">
              <FolderKanban size={16} className="text-muted" />
              Asignar a Familia
            </Form.Label>
            <div className="position-relative">
              <Form.Select
                value={selectedFamilyId}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setSelectedTypeFamilyId(e.target.value)
                }
                required
                disabled={isSubmitting || loadingFamilies}
              >
                <option value="">Selecciona una familia...</option>
                {families.map((family) => (
                  <option key={family.id} value={family.id}>
                    {family.name}
                  </option>
                ))}
              </Form.Select>
              {loadingFamilies && (
                <div className="position-absolute top-50 end-0 translate-middle-y me-4 pe-2">
                  <Spinner animation="border" size="sm" variant="primary" />
                </div>
              )}
            </div>
            {families.length === 0 && !loadingFamilies && (
              <Form.Text className="text-danger fw-semibold d-block mt-1">
                ⚠️ No hay familias registradas. Por favor crea una familia
                primero.
              </Form.Text>
            )}
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
            disabled={
              isSubmitting ||
              loadingFamilies ||
              !modelName.trim() ||
              !selectedFamilyId
            }
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={16} />
                Guardar Modelo
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

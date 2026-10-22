import { useState, type FormEvent, type ChangeEvent } from "react";
import { Modal, Button, Form, Spinner, Row, Col, Alert } from "react-bootstrap";
import { Edit, Hash, Save, MapPin, Search, AlertCircle } from "lucide-react";
import { supabase } from "../../supabaseClient"; // Ajusta la ruta a tu cliente de Supabase
import { toast } from "react-hot-toast";

interface EditToolingProps {
  show: boolean;
  onHide: () => void;
  onSuccess?: () => void;
}

export default function EditTooling({
  show,
  onHide,
  onSuccess,
}: EditToolingProps) {
  // Estado para la búsqueda inicial
  const [searchDmc, setSearchDmc] = useState<string>("");
  const [isSearching, setIsSubmittingSearch] = useState<boolean>(false);
  const [recordFound, setRecordFound] = useState<boolean>(false);
  const [originalId, setOriginalId] = useState<number | null>(null);

  // Estados para los campos editables del formulario
  const [formData, setFormData] = useState({
    dmc: "",
    tipo: "", // Solo lectura para mantener coherencia, pero se muestra como referencia
    status: "",
    rack: "",
    position: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleClose = () => {
    setSearchDmc("");
    setRecordFound(false);
    setOriginalId(null);
    setFormData({ dmc: "", tipo: "", status: "", rack: "", position: "" });
    onHide();
  };

  // ⚡ Buscar herramental por DMC en Supabase
  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchDmc.trim()) return;

    setIsSubmittingSearch(true);
    try {
      const { data, error } = await supabase
        .from("tooling")
        .select("id, dmc, type, status, rack, position")
        .eq("dmc", searchDmc.trim())
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast.error("No se encontró ningún herramental con ese DMC.");
        setRecordFound(false);
        return;
      }

      // Cargamos los datos en el formulario
      setOriginalId(data.id);
      setFormData({
        dmc: data.dmc,
        tipo: data.type || "",
        status: data.status || "Almacenado",
        rack: data.rack || "",
        position: data.position || "",
      });
      setRecordFound(true);
      toast.success("¡Herramental encontrado!");
    } catch (error) {
      console.error("Error al buscar herramental:", error);
      toast.error(`Error de búsqueda: ${(error as Error).message || error}`);
    } finally {
      setIsSubmittingSearch(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ⚡ Guardar los cambios actualizados en Supabase
  const handleSubmitUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!originalId) return;

    setIsSubmitting(true);

    const actualizarPromesa = async () => {
      const { data, error } = await supabase
        .from("tooling")
        .update({
          dmc: formData.dmc.trim(),
          status: formData.status,
          rack: formData.rack.trim().toUpperCase(),
          position: formData.position.trim().toUpperCase(),
        })
        .eq("id", originalId)
        .select();

      if (error) throw error;
      return data;
    };

    toast.promise(actualizarPromesa(), {
      loading: "Guardando cambios en la base de datos...",
      success: "¡Herramental actualizado con éxito! 🛠️",
      error: (err) => `Error al actualizar: ${err.message || err}`,
    });

    try {
      await actualizarPromesa();
      if (onSuccess) onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error al actualizar en Supabase:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop={isSubmitting || isSearching ? "static" : true}
    >
      <Modal.Header
        closeButton={!isSubmitting && !isSearching}
        className="bg-light"
      >
        <Modal.Title className="fw-bold fs-5 d-flex align-items-center gap-2">
          <Edit size={20} className="text-warning" />
          Editar Herramental Existente
        </Modal.Title>
      </Modal.Header>

      {/* FASE 1: BÚSQUEDA DEL HERRAMENTAL */}
      {!recordFound ? (
        <Form onSubmit={handleSearch}>
          <Modal.Body>
            <p className="text-muted small">
              Por favor, escanea o escribe el código DMC del herramental que
              deseas modificar para cargar su información.
            </p>
            <Form.Group className="mb-3" controlId="searchDmcInput">
              <Form.Label className="fw-semibold">
                Código DMC actual a buscar
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Escanee o escriba para buscar..."
                value={searchDmc}
                onChange={(e) => setSearchDmc(e.target.value)}
                required
                autoFocus
                disabled={isSearching}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button
              variant="outline-secondary"
              onClick={handleClose}
              disabled={isSearching}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isSearching || !searchDmc.trim()}
            >
              {isSearching ? (
                <>
                  <Spinner animation="border" size="sm" className="me-1" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search size={16} className="me-1" />
                  Buscar Herramental
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      ) : (
        /* FASE 2: FORMULARIO DE EDICIÓN (UNA VEZ ENCONTRADO) */
        <Form onSubmit={handleSubmitUpdate}>
          <Modal.Body>
            <Alert
              variant="info"
              className="py-2 d-flex align-items-center gap-2 small"
            >
              <AlertCircle size={18} className="text-info" />
              <span>
                Modificando herramental tipo:{" "}
                <strong className="text-capitalize">{formData.tipo}</strong>
              </span>
            </Alert>

            {/* Editar DMC */}
            <Form.Group className="mb-3" controlId="editDmc">
              <Form.Label className="fw-semibold d-flex align-items-center gap-1">
                <Hash size={16} className="text-muted" />
                Código DMC / Número de Serie
              </Form.Label>
              <Form.Control
                type="text"
                name="dmc"
                value={formData.dmc}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </Form.Group>

            {/* Editar Estatus */}
            <Form.Group className="mb-3" controlId="editStatus">
              <Form.Label className="fw-semibold">
                Estatus de Herramental
              </Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              >
                <option value="Almacenado">Almacenado</option>
                <option value="En Línea">En Línea</option>
                <option value="Scrap">Scrap</option>
              </Form.Select>
            </Form.Group>

            {/* Editar Ubicación */}
            <hr className="my-3 text-muted opacity-25" />
            <Form.Label className="fw-semibold d-flex align-items-center gap-1 text-primary mb-3">
              <MapPin size={18} />
              Ubicación de Almacenamiento
            </Form.Label>

            <Row>
              {/* Rack */}
              <Col md={6}>
                <Form.Group className="mb-3" controlId="editRack">
                  <Form.Label className="small fw-semibold text-secondary">
                    Rack
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="rack"
                    value={formData.rack}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </Form.Group>
              </Col>

              {/* Posición */}
              <Col md={6}>
                <Form.Group className="mb-3" controlId="editPosition">
                  <Form.Label className="small fw-semibold text-secondary">
                    Posición / Ranura
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="position"
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
              onClick={() => setRecordFound(false)} // Permite regresar a buscar otro código
              disabled={isSubmitting}
            >
              Regresar
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Guardar Cambios
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      )}
    </Modal>
  );
}

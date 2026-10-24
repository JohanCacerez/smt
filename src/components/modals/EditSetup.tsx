import { useState, type FormEvent } from "react";
import {
  Modal,
  Button,
  Form,
  Spinner,
  InputGroup,
  Alert,
} from "react-bootstrap";
import { Edit, Save, Search, Check, Trash2, ShieldAlert } from "lucide-react";
import { supabase } from "../../supabaseClient";
import { toast } from "react-hot-toast";

interface EditSetupProps {
  show: boolean;
  onHide: () => void;
  onSuccess?: () => void;
}

export default function EditSetup({ show, onHide, onSuccess }: EditSetupProps) {
  // --- Estados de Búsqueda ---
  const [searchModel, setSearchModel] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [setupFound, setSetupFound] = useState<boolean>(false);
  const [setupId, setSetupId] = useState<number | null>(null);

  // --- Datos de Referencia (Lectura Únicamente) ---
  const [familyName, setFamilyName] = useState<string>("");
  const [modelName, setModelName] = useState<string>("");

  // --- Campos de Edición del Setup ---
  const [stencilTop, setStencilTop] = useState<string>("");
  const [stencilTopBks, setStencilTopBks] = useState<string[]>([]);
  const [isStencilTopValid, setIsStencilTopValid] = useState<boolean | null>(
    true,
  );

  const [stencilBottom, setStencilBottom] = useState<string>("");
  const [stencilBottomBks, setStencilBottomBks] = useState<string[]>([]);
  const [isStencilBottomValid, setIsStencilBottomValid] = useState<
    boolean | null
  >(true);

  const [squeegeeFront, setSqueegeeFront] = useState<string>("");
  const [squeegeeFrontBks, setSqueegeeFrontBks] = useState<string[]>([]);
  const [isSqueegeeFrontValid, setIsSqueegeeFrontValid] = useState<
    boolean | null
  >(true);

  const [squeegeeRear, setSqueegeeRear] = useState<string>("");
  const [squeegeeRearBks, setSqueegeeRearBks] = useState<string[]>([]);
  const [isSqueegeeRearValid, setIsSqueegeeRearValid] = useState<
    boolean | null
  >(true);

  const [base, setBase] = useState<string>("");
  const [baseBks, setBaseBks] = useState<string[]>([]);
  const [isBaseValid, setIsBaseValid] = useState<boolean | null>(true);

  const [paste, setPaste] = useState<string>("");
  const [isPasteValid, setIsPasteValid] = useState<boolean | null>(true);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Cerrar y limpiar estados
  const handleClose = () => {
    setSearchModel("");
    setSetupFound(false);
    setSetupId(null);
    setFamilyName("");
    setModelName("");
    setStencilTop("");
    setStencilTopBks([]);
    setIsStencilTopValid(true);
    setStencilBottom("");
    setStencilBottomBks([]);
    setIsStencilBottomValid(true);
    setSqueegeeFront("");
    setSqueegeeFrontBks([]);
    setIsSqueegeeFrontValid(true);
    setSqueegeeRear("");
    setSqueegeeRearBks([]);
    setIsSqueegeeRearValid(true);
    setBase("");
    setBaseBks([]);
    setIsBaseValid(true);
    setPaste("");
    setIsPasteValid(true);
    onHide();
  };

  // ⚡ Buscar Setup activo por Modelo
  const handleSearchSetup = async (e: FormEvent) => {
    e.preventDefault();
    const cleanSearch = searchModel.trim().toUpperCase();
    if (!cleanSearch) return;

    setIsSearching(true);
    try {
      // 1. Obtener el ID del modelo
      const { data: modelData, error: modelError } = await supabase
        .from("models")
        .select("id, name, families(name)")
        .eq("name", cleanSearch)
        .maybeSingle();

      if (modelError) throw modelError;

      if (!modelData) {
        toast.error(`El modelo "${cleanSearch}" no existe en el catálogo.`);
        setIsSearching(false);
        return;
      }

      // 2. Obtener el Setup asociado a este modelo
      const { data: setupData, error: setupError } = await supabase
        .from("setups")
        .select("*")
        .eq("model_id", modelData.id)
        .maybeSingle();

      if (setupError) throw setupError;

      if (!setupData) {
        toast.error(
          `El modelo "${cleanSearch}" no tiene configurada ninguna receta de setup.`,
        );
        setIsSearching(false);
        return;
      }

      // Cargar información del setup en los estados del formulario
      setSetupId(setupData.id);

      setFamilyName(
        Array.isArray(modelData.families)
          ? modelData.families[0]?.name
          : // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (modelData.families as any)?.name || "N/A",
      );
      setModelName(modelData.name);

      setStencilTop(setupData.stencil_top);
      setStencilTopBks(
        [
          setupData.stencil_top_bk1,
          setupData.stencil_top_bk2,
          setupData.stencil_top_bk3,
        ].filter(Boolean),
      );

      setStencilBottom(setupData.stencil_bottom);
      setStencilBottomBks(
        [
          setupData.stencil_bottom_bk1,
          setupData.stencil_bottom_bk2,
          setupData.stencil_bottom_bk3,
        ].filter(Boolean),
      );

      setSqueegeeFront(setupData.squeegee_front);
      setSqueegeeFrontBks(
        [
          setupData.squeegee_front_bk1,
          setupData.squeegee_front_bk2,
          setupData.squeegee_front_bk3,
        ].filter(Boolean),
      );

      setSqueegeeRear(setupData.squeegee_rear);
      setSqueegeeRearBks(
        [
          setupData.squeegee_rear_bk1,
          setupData.squeegee_rear_bk2,
          setupData.squeegee_rear_bk3,
        ].filter(Boolean),
      );

      setBase(setupData.base);
      setBaseBks(
        [setupData.base_bk1, setupData.base_bk2, setupData.base_bk3].filter(
          Boolean,
        ),
      );

      setPaste(setupData.paste);

      setSetupFound(true);
      toast.success("¡Receta de setup localizada!");
    } catch (error: unknown) {
      console.error(error);
      toast.error(`Error en la consulta: ${(error as Error).message}`);
    } finally {
      setIsSearching(false);
    }
  };

  // ⚡ Validar existencia de herramental por DMC
  const validateTooling = async (
    dmc: string,
    expectedType: string,
    setValid: (v: boolean | null) => void,
  ) => {
    if (!dmc.trim()) {
      setValid(null);
      return;
    }
    const { data } = await supabase
      .from("tooling")
      .select("id")
      .eq("dmc", dmc.trim().toUpperCase())
      .eq("type", expectedType)
      .neq("status", "Scrap")
      .maybeSingle();

    setValid(data !== null);
  };

  // Manejo de Backups (Máximo 3)
  const addBackup = (bksList: string[], setBksList: (l: string[]) => void) => {
    if (bksList.length < 3) setBksList([...bksList, ""]);
  };

  const updateBackupValue = (
    index: number,
    val: string,
    bksList: string[],
    setBksList: (l: string[]) => void,
  ) => {
    const updated = [...bksList];
    updated[index] = val.toUpperCase();
    setBksList(updated);
  };

  const removeBackup = (
    index: number,
    bksList: string[],
    setBksList: (l: string[]) => void,
  ) => {
    setBksList(bksList.filter((_, i) => i !== index));
  };

  // ⚡ Actualizar receta de Setup
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!setupId) return;

    if (
      !isStencilTopValid ||
      !isStencilBottomValid ||
      !isSqueegeeFrontValid ||
      !isSqueegeeRearValid ||
      !isBaseValid ||
      !isPasteValid
    ) {
      toast.error(
        "Por favor, asegúrate de que todos los herramentales principales estén validados en verde.",
      );
      return;
    }

    setIsSubmitting(true);

    const guardarCambios = async () => {
      const { error } = await supabase
        .from("setups")
        .update({
          stencil_top: stencilTop.trim().toUpperCase(),
          stencil_top_bk1: stencilTopBks[0] || null,
          stencil_top_bk2: stencilTopBks[1] || null,
          stencil_top_bk3: stencilTopBks[2] || null,
          stencil_bottom: stencilBottom.trim().toUpperCase(),
          stencil_bottom_bk1: stencilBottomBks[0] || null,
          stencil_bottom_bk2: stencilBottomBks[1] || null,
          stencil_bottom_bk3: stencilBottomBks[2] || null,
          squeegee_front: squeegeeFront.trim().toUpperCase(),
          squeegee_front_bk1: squeegeeFrontBks[0] || null,
          squeegee_front_bk2: squeegeeFrontBks[1] || null,
          squeegee_front_bk3: squeegeeFrontBks[2] || null,
          squeegee_rear: squeegeeRear.trim().toUpperCase(),
          squeegee_rear_bk1: squeegeeRearBks[0] || null,
          squeegee_rear_bk2: squeegeeRearBks[1] || null,
          squeegee_rear_bk3: squeegeeRearBks[2] || null,
          base: base.trim().toUpperCase(),
          base_bk1: baseBks[0] || null,
          base_bk2: baseBks[1] || null,
          base_bk3: baseBks[2] || null,
          paste: paste.trim().toUpperCase(),
        })
        .eq("id", setupId);

      if (error) throw error;
    };

    const promesaUnica = guardarCambios();

    toast.promise(promesaUnica, {
      loading: "Actualizando receta de setup en Supabase...",
      success: "¡Setup actualizado con éxito! ⚙️",
      error: (err) => `${err.message || err}`,
    });

    try {
      await promesaUnica;
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getValidationClass = (isValid: boolean | null) => {
    if (isValid === true) return "is-valid border-success";
    if (isValid === false) return "is-invalid border-danger";
    return "";
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      scrollable
      backdrop={isSubmitting || isSearching ? "static" : true}
    >
      <Modal.Header
        closeButton={!isSubmitting && !isSearching}
        className="bg-light"
      >
        <Modal.Title className="fw-bold fs-5 d-flex align-items-center gap-2">
          <Edit size={20} className="text-warning" />
          Editar Receta de Setup
        </Modal.Title>
      </Modal.Header>

      {!setupFound ? (
        /* FASE 1: BÚSQUEDA DEL SETUP */
        <Form onSubmit={handleSearchSetup}>
          <Modal.Body>
            <p className="text-muted small">
              Por favor escanea o ingresa el número de Modelo (PCB) al que le
              deseas modificar su configuración de setup.
            </p>
            <Form.Group className="mb-3" controlId="searchSetupModel">
              <Form.Label className="fw-semibold">
                Modelo / Número de Parte
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: 2345, PP89-A..."
                value={searchModel}
                onChange={(e) => setSearchModel(e.target.value.toUpperCase())}
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
              disabled={isSearching || !searchModel.trim()}
            >
              {isSearching ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <Search size={16} />
              )}{" "}
              Buscar Receta
            </Button>
          </Modal.Footer>
        </Form>
      ) : (
        /* FASE 2: EDICIÓN DE LA RECETA DE SETUP */
        <Form onSubmit={handleUpdate}>
          <Modal.Body className="p-4" style={{ maxHeight: "70vh" }}>
            <Alert
              variant="info"
              className="py-2 d-flex align-items-center gap-2 small"
            >
              <ShieldAlert size={20} className="text-info" />
              <span>
                Editando setup de la Familia: <strong>{familyName}</strong> |
                Modelo: <strong>{modelName}</strong> (Bloqueados para edición).
              </span>
            </Alert>

            {/* ESTENCIL TOP */}
            <div className="mb-4">
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Esténcil TOP Principal
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={stencilTop}
                    onChange={(e) => {
                      setStencilTop(e.target.value.toUpperCase());
                      setIsStencilTopValid(null);
                    }}
                    onBlur={() =>
                      validateTooling(
                        stencilTop,
                        "estencil",
                        setIsStencilTopValid,
                      )
                    }
                    className={getValidationClass(isStencilTopValid)}
                    required
                  />
                  {isStencilTopValid === true && (
                    <InputGroup.Text className="bg-success text-white">
                      <Check size={16} />
                    </InputGroup.Text>
                  )}
                  {isStencilTopValid === false && (
                    <InputGroup.Text className="bg-danger text-white">
                      X
                    </InputGroup.Text>
                  )}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => addBackup(stencilTopBks, setStencilTopBks)}
                  >
                    + Backup
                  </Button>
                </InputGroup>
              </Form.Group>
              {stencilTopBks.map((bk, i) => (
                <InputGroup className="mt-2 ms-4 w-75" key={i}>
                  <Form.Control
                    type="text"
                    placeholder={`Backup ${i + 1}`}
                    value={bk}
                    onChange={(e) =>
                      updateBackupValue(
                        i,
                        e.target.value,
                        stencilTopBks,
                        setStencilTopBks,
                      )
                    }
                  />
                  <Button
                    variant="outline-danger"
                    onClick={() =>
                      removeBackup(i, stencilTopBks, setStencilTopBks)
                    }
                  >
                    <Trash2 size={16} />
                  </Button>
                </InputGroup>
              ))}
            </div>

            {/* ESTENCIL BOTTOM */}
            <div className="mb-4">
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Esténcil BOTTOM Principal
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={stencilBottom}
                    onChange={(e) => {
                      setStencilBottom(e.target.value.toUpperCase());
                      setIsStencilBottomValid(null);
                    }}
                    onBlur={() =>
                      validateTooling(
                        stencilBottom,
                        "estencil",
                        setIsStencilBottomValid,
                      )
                    }
                    className={getValidationClass(isStencilBottomValid)}
                    required
                  />
                  {isStencilBottomValid === true && (
                    <InputGroup.Text className="bg-success text-white">
                      <Check size={16} />
                    </InputGroup.Text>
                  )}
                  {isStencilBottomValid === false && (
                    <InputGroup.Text className="bg-danger text-white">
                      X
                    </InputGroup.Text>
                  )}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() =>
                      addBackup(stencilBottomBks, setStencilBottomBks)
                    }
                  >
                    + Backup
                  </Button>
                </InputGroup>
              </Form.Group>
              {stencilBottomBks.map((bk, i) => (
                <InputGroup className="mt-2 ms-4 w-75" key={i}>
                  <Form.Control
                    type="text"
                    placeholder={`Backup ${i + 1}`}
                    value={bk}
                    onChange={(e) =>
                      updateBackupValue(
                        i,
                        e.target.value,
                        stencilBottomBks,
                        setStencilBottomBks,
                      )
                    }
                  />
                  <Button
                    variant="outline-danger"
                    onClick={() =>
                      removeBackup(i, stencilBottomBks, setStencilBottomBks)
                    }
                  >
                    <Trash2 size={16} />
                  </Button>
                </InputGroup>
              ))}
            </div>

            {/* NAVAJA FRONT */}
            <div className="mb-4">
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Navaja FRONT Principal
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={squeegeeFront}
                    onChange={(e) => {
                      setSqueegeeFront(e.target.value.toUpperCase());
                      setIsSqueegeeFrontValid(null);
                    }}
                    onBlur={() =>
                      validateTooling(
                        squeegeeFront,
                        "navaja",
                        setIsSqueegeeFrontValid,
                      )
                    }
                    className={getValidationClass(isSqueegeeFrontValid)}
                    required
                  />
                  {isSqueegeeFrontValid === true && (
                    <InputGroup.Text className="bg-success text-white">
                      <Check size={16} />
                    </InputGroup.Text>
                  )}
                  {isSqueegeeFrontValid === false && (
                    <InputGroup.Text className="bg-danger text-white">
                      X
                    </InputGroup.Text>
                  )}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() =>
                      addBackup(squeegeeFrontBks, setSqueegeeFrontBks)
                    }
                  >
                    + Backup
                  </Button>
                </InputGroup>
              </Form.Group>
              {squeegeeFrontBks.map((bk, i) => (
                <InputGroup className="mt-2 ms-4 w-75" key={i}>
                  <Form.Control
                    type="text"
                    placeholder={`Backup ${i + 1}`}
                    value={bk}
                    onChange={(e) =>
                      updateBackupValue(
                        i,
                        e.target.value,
                        squeegeeFrontBks,
                        setSqueegeeFrontBks,
                      )
                    }
                  />
                  <Button
                    variant="outline-danger"
                    onClick={() =>
                      removeBackup(i, squeegeeFrontBks, setSqueegeeFrontBks)
                    }
                  >
                    <Trash2 size={16} />
                  </Button>
                </InputGroup>
              ))}
            </div>

            {/* NAVAJA REAR */}
            <div className="mb-4">
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Navaja REAR Principal
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={squeegeeRear}
                    onChange={(e) => {
                      setSqueegeeRear(e.target.value.toUpperCase());
                      setIsSqueegeeRearValid(null);
                    }}
                    onBlur={() =>
                      validateTooling(
                        squeegeeRear,
                        "navaja",
                        setIsSqueegeeRearValid,
                      )
                    }
                    className={getValidationClass(isSqueegeeRearValid)}
                    required
                  />
                  {isSqueegeeRearValid === true && (
                    <InputGroup.Text className="bg-success text-white">
                      <Check size={16} />
                    </InputGroup.Text>
                  )}
                  {isSqueegeeRearValid === false && (
                    <InputGroup.Text className="bg-danger text-white">
                      X
                    </InputGroup.Text>
                  )}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() =>
                      addBackup(squeegeeRearBks, setSqueegeeRearBks)
                    }
                  >
                    + Backup
                  </Button>
                </InputGroup>
              </Form.Group>
              {squeegeeRearBks.map((bk, i) => (
                <InputGroup className="mt-2 ms-4 w-75" key={i}>
                  <Form.Control
                    type="text"
                    placeholder={`Backup ${i + 1}`}
                    value={bk}
                    onChange={(e) =>
                      updateBackupValue(
                        i,
                        e.target.value,
                        squeegeeRearBks,
                        setSqueegeeRearBks,
                      )
                    }
                  />
                  <Button
                    variant="outline-danger"
                    onClick={() =>
                      removeBackup(i, squeegeeRearBks, setSqueegeeRearBks)
                    }
                  >
                    <Trash2 size={16} />
                  </Button>
                </InputGroup>
              ))}
            </div>

            {/* BASE */}
            <div className="mb-4">
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Base de Soporte Principal
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={base}
                    onChange={(e) => {
                      setBase(e.target.value.toUpperCase());
                      setIsBaseValid(null);
                    }}
                    onBlur={() => validateTooling(base, "base", setIsBaseValid)}
                    className={getValidationClass(isBaseValid)}
                    required
                  />
                  {isBaseValid === true && (
                    <InputGroup.Text className="bg-success text-white">
                      <Check size={16} />
                    </InputGroup.Text>
                  )}
                  {isBaseValid === false && (
                    <InputGroup.Text className="bg-danger text-white">
                      X
                    </InputGroup.Text>
                  )}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => addBackup(baseBks, setBaseBks)}
                  >
                    + Backup
                  </Button>
                </InputGroup>
              </Form.Group>
              {baseBks.map((bk, i) => (
                <InputGroup className="mt-2 ms-4 w-75" key={i}>
                  <Form.Control
                    type="text"
                    placeholder={`Backup ${i + 1}`}
                    value={bk}
                    onChange={(e) =>
                      updateBackupValue(i, e.target.value, baseBks, setBaseBks)
                    }
                  />
                  <Button
                    variant="outline-danger"
                    onClick={() => removeBackup(i, baseBks, setBaseBks)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </InputGroup>
              ))}
            </div>

            {/* PASTA */}
            <div className="mb-3">
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Pasta de Soldadura
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={paste}
                    onChange={(e) => {
                      setPaste(e.target.value.toUpperCase());
                      setIsPasteValid(null);
                    }}
                    onBlur={() =>
                      validateTooling(paste, "pasta", setIsPasteValid)
                    }
                    className={getValidationClass(isPasteValid)}
                    required
                  />
                  {isPasteValid === true && (
                    <InputGroup.Text className="bg-success text-white">
                      <Check size={16} />
                    </InputGroup.Text>
                  )}
                  {isPasteValid === false && (
                    <InputGroup.Text className="bg-danger text-white">
                      X
                    </InputGroup.Text>
                  )}
                </InputGroup>
              </Form.Group>
            </div>
          </Modal.Body>

          <Modal.Footer className="bg-light">
            <Button
              variant="outline-secondary"
              onClick={() => setSetupFound(false)}
              disabled={isSubmitting}
            >
              Regresar
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <Save size={16} />
              )}{" "}
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Form>
      )}
    </Modal>
  );
}

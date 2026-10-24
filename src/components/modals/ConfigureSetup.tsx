import { useState, useEffect, type FormEvent } from "react";
import {
  Modal,
  Button,
  Form,
  Spinner,
  Row,
  Col,
  InputGroup,
  Card,
} from "react-bootstrap";
import { Settings, Save, X, Check, Plus, Trash2 } from "lucide-react";
import { supabase } from "../../supabaseClient";
import { toast } from "react-hot-toast";

interface FamilyItem {
  id: number;
  name: string;
}

interface ConfigureSetupProps {
  show: boolean;
  onHide: () => void;
  onSuccess?: () => void;
}

export default function ConfigureSetup({
  show,
  onHide,
  onSuccess,
}: ConfigureSetupProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // --- Familias ---
  const [families, setFamilies] = useState<FamilyItem[]>([]);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>("");
  const [isFamilyValid, setIsFamilyValid] = useState<boolean | null>(null);

  // --- Búsqueda de Modelos (Autocompletado con Supabase) ---
  const [modelSearch, setModelNameSearch] = useState<string>("");
  const [modelSuggestions, setModelSuggestions] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [isModelValid, setIsModelValid] = useState<boolean | null>(null);

  // --- Datos del Formulario ---
  const [stencilTop, setStencilTop] = useState<string>("");
  const [stencilTopBks, setStencilTopBks] = useState<string[]>([]);
  const [isStencilTopValid, setIsStencilTopValid] = useState<boolean | null>(
    null,
  );

  const [stencilBottom, setStencilBottom] = useState<string>("");
  const [stencilBottomBks, setStencilBottomBks] = useState<string[]>([]);
  const [isStencilBottomValid, setIsStencilBottomValid] = useState<
    boolean | null
  >(null);

  const [squeegeeFront, setSqueegeeFront] = useState<string>("");
  const [squeegeeFrontBks, setSqueegeeFrontBks] = useState<string[]>([]);
  const [isSqueegeeFrontValid, setIsSqueegeeFrontValid] = useState<
    boolean | null
  >(null);

  const [squeegeeRear, setSqueegeeRear] = useState<string>("");
  const [squeegeeRearBks, setSqueegeeRearBks] = useState<string[]>([]);
  const [isSqueegeeRearValid, setIsSqueegeeRearValid] = useState<
    boolean | null
  >(null);

  const [base, setBase] = useState<string>("");
  const [baseBks, setBaseBks] = useState<string[]>([]);
  const [isBaseValid, setIsBaseValid] = useState<boolean | null>(null);

  // Cargar Familias al iniciar
  useEffect(() => {
    if (show) {
      const getFamilies = async () => {
        const { data } = await supabase
          .from("families")
          .select("id, name")
          .order("name");
        setFamilies(data || []);
      };
      getFamilies();
    }
  }, [show]);

  // Validar selección de familia
  const handleFamilyChange = (id: string) => {
    setSelectedFamilyId(id);
    setIsFamilyValid(id !== "");
  };

  // --- Lógica de Búsqueda de Modelos con Supabase ---
  useEffect(() => {
    if (!modelSearch.trim() || selectedFamilyId === "") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setModelSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      const { data } = await supabase
        .from("models")
        .select("id, name")
        .eq("id_family", Number(selectedFamilyId))
        .ilike("name", `%${modelSearch}%`)
        .limit(5);

      setModelSuggestions(data || []);
    }, 300); // 300ms de retraso para no saturar la base de datos

    return () => clearTimeout(delayDebounce);
  }, [modelSearch, selectedFamilyId]);

  const selectModel = (id: number, name: string) => {
    setSelectedModelId(id);
    setModelNameSearch(name);
    setIsModelValid(true);
    setModelSuggestions([]);
  };

  // --- Validador Genérico de Herramental en Supabase (DMC y Tipo) ---
  const validateTooling = async (
    dmc: string,
    expectedType: string,
    setValid: (v: boolean | null) => void,
  ) => {
    if (!dmc.trim()) {
      setValid(null);
      return;
    }
    try {
      const { data } = await supabase
        .from("tooling")
        .select("id, status")
        .eq("dmc", dmc.trim().toUpperCase())
        .eq("type", expectedType)
        .neq("status", "Scrap") // No permitir herramental dañado
        .maybeSingle();

      setValid(data !== null);
    } catch {
      setValid(false);
    }
  };

  // Manejo dinámico de Backups (Máximo 3)
  const addBackup = (bksList: string[], setBksList: (l: string[]) => void) => {
    if (bksList.length < 3) {
      setBksList([...bksList, ""]);
    } else {
      toast.error("Máximo permitido: 3 herramentales de repuesto (backups).");
    }
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
    const updated = bksList.filter((_, i) => i !== index);
    setBksList(updated);
  };

  const handleClose = () => {
    setSelectedFamilyId("");
    setIsFamilyValid(null);
    setModelNameSearch("");
    setSelectedModelId(null);
    setIsModelValid(null);

    setStencilTop("");
    setStencilTopBks([]);
    setIsStencilTopValid(null);
    setStencilBottom("");
    setStencilBottomBks([]);
    setIsStencilBottomValid(null);
    setSqueegeeFront("");
    setSqueegeeFrontBks([]);
    setIsSqueegeeFrontValid(null);
    setSqueegeeRear("");
    setSqueegeeRearBks([]);
    setIsSqueegeeRearValid(null);
    setBase("");
    setBaseBks([]);
    setIsBaseValid(null);

    onHide();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !selectedFamilyId ||
      !selectedModelId ||
      !isStencilTopValid ||
      !isStencilBottomValid ||
      !isSqueegeeFrontValid ||
      !isSqueegeeRearValid ||
      !isBaseValid
    ) {
      toast.error(
        "Por favor, asegúrate de que todos los herramentales principales estén validados en verde.",
      );
      return;
    }

    setIsSubmitting(true);

    const guardarSetup = async () => {
      // Validar si el modelo ya tiene un setup
      const { data: existingSetup } = await supabase
        .from("setups")
        .select("id")
        .eq("model_id", selectedModelId)
        .maybeSingle();

      if (existingSetup) {
        throw new Error(
          "Este modelo ya cuenta con una configuración de setup registrada.",
        );
      }

      const { error } = await supabase.from("setups").insert([
        {
          id_family: Number(selectedFamilyId),
          model_id: selectedModelId,
          stencil_top: stencilTop.toUpperCase(),
          stencil_top_bk1: stencilTopBks[0] || null,
          stencil_top_bk2: stencilTopBks[1] || null,
          stencil_top_bk3: stencilTopBks[2] || null,
          stencil_bottom: stencilBottom.toUpperCase(),
          stencil_bottom_bk1: stencilBottomBks[0] || null,
          stencil_bottom_bk2: stencilBottomBks[1] || null,
          stencil_bottom_bk3: stencilBottomBks[2] || null,
          squeegee_front: squeegeeFront.toUpperCase(),
          squeegee_front_bk1: squeegeeFrontBks[0] || null,
          squeegee_front_bk2: squeegeeFrontBks[1] || null,
          squeegee_front_bk3: squeegeeFrontBks[2] || null,
          squeegee_rear: squeegeeRear.toUpperCase(),
          squeegee_rear_bk1: squeegeeRearBks[0] || null,
          squeegee_rear_bk2: squeegeeRearBks[1] || null,
          squeegee_rear_bk3: squeegeeRearBks[2] || null,
          base: base.toUpperCase(),
          base_bk1: baseBks[0] || null,
          base_bk2: baseBks[1] || null,
          base_bk3: baseBks[2] || null,
        },
      ]);

      if (error) throw error;
    };

    toast.promise(guardarSetup(), {
      loading: "Guardando configuración de setup...",
      success: "¡Setup configurado con éxito! ⚙️",
      error: (err) => `${err.message || err}`,
    });

    try {
      await guardarSetup();
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función de ayuda para dar estilos de validación a los inputs de Bootstrap
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
      backdrop={isSubmitting ? "static" : true}
    >
      <Modal.Header closeButton={!isSubmitting} className="bg-light">
        <Modal.Title className="fw-bold fs-5 d-flex align-items-center gap-2">
          <Settings size={20} className="text-primary" />
          Configurar Setup SMT
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4" style={{ maxHeight: "70vh" }}>
          {/* SECCIÓN 1: JERARQUÍA MAESTRA */}
          <Card className="border-0 bg-light p-3 mb-4 rounded-3">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="setupFamily">
                  <Form.Label className="fw-semibold">
                    1. Seleccionar Familia
                  </Form.Label>
                  <InputGroup>
                    <Form.Select
                      value={selectedFamilyId}
                      onChange={(e) => handleFamilyChange(e.target.value)}
                      className={getValidationClass(isFamilyValid)}
                      required
                    >
                      <option value="">Selecciona...</option>
                      {families.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </Form.Select>
                    {isFamilyValid && (
                      <InputGroup.Text className="bg-success text-white">
                        <Check size={16} />
                      </InputGroup.Text>
                    )}
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={6} className="position-relative">
                <Form.Group className="mb-3" controlId="setupModel">
                  <Form.Label className="fw-semibold">
                    2. Número de Modelo (Búsqueda)
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Escribe el modelo..."
                      value={modelSearch}
                      onChange={(e) => {
                        setModelNameSearch(e.target.value.toUpperCase());
                        setIsModelValid(null);
                        setSelectedModelId(null);
                      }}
                      className={getValidationClass(isModelValid)}
                      disabled={!selectedFamilyId}
                      required
                      autoComplete="off"
                    />
                    {isModelValid && (
                      <InputGroup.Text className="bg-success text-white">
                        <Check size={16} />
                      </InputGroup.Text>
                    )}
                  </InputGroup>

                  {/* Sugerencias de búsqueda de modelo */}
                  {modelSuggestions.length > 0 && (
                    <ul
                      className="list-group position-absolute w-100 z-3 shadow"
                      style={{ maxHeight: "150px", overflowY: "auto" }}
                    >
                      {modelSuggestions.map((m) => (
                        <li
                          key={m.id}
                          className="list-group-item list-group-item-action cursor-pointer"
                          onClick={() => selectModel(m.id, m.name)}
                        >
                          {m.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Card>

          {/* SECCIÓN 2: HERRAMENTAL */}
          <h6
            className="fw-bold mb-3 text-secondary text-uppercase tracking-wider"
            style={{ fontSize: "0.8rem" }}
          >
            Configuración de Componentes de Impresión
          </h6>

          {/* ESTENCIL TOP */}
          <div className="mb-4">
            <Form.Group>
              <Form.Label className="fw-semibold">
                Esténcil TOP Principal
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Escanee o ingrese DMC de Esténcil..."
                  value={stencilTop}
                  onChange={(e) => setStencilTop(e.target.value)}
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
                  <Plus size={16} /> Backup
                </Button>
              </InputGroup>
            </Form.Group>

            {stencilTopBks.map((bk, i) => (
              <InputGroup className="mt-2 ms-4 w-75" key={i}>
                <Form.Control
                  type="text"
                  placeholder={`Esténcil TOP Backup ${i + 1}`}
                  value={bk}
                  onChange={(e) =>
                    updateBackupValue(
                      i,
                      e.target.value,
                      stencilTopBks,
                      setStencilTopBks,
                    )
                  }
                  className="small"
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
                  placeholder="Escanee o ingrese DMC de Esténcil..."
                  value={stencilBottom}
                  onChange={(e) => setStencilBottom(e.target.value)}
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
                  <Plus size={16} /> Backup
                </Button>
              </InputGroup>
            </Form.Group>

            {stencilBottomBks.map((bk, i) => (
              <InputGroup className="mt-2 ms-4 w-75" key={i}>
                <Form.Control
                  type="text"
                  placeholder={`Esténcil BOTTOM Backup ${i + 1}`}
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
                  placeholder="Escanee o ingrese DMC de Navaja..."
                  value={squeegeeFront}
                  onChange={(e) => setSqueegeeFront(e.target.value)}
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
                  <Plus size={16} /> Backup
                </Button>
              </InputGroup>
            </Form.Group>

            {squeegeeFrontBks.map((bk, i) => (
              <InputGroup className="mt-2 ms-4 w-75" key={i}>
                <Form.Control
                  type="text"
                  placeholder={`Navaja FRONT Backup ${i + 1}`}
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
                  placeholder="Escanee o ingrese DMC de Navaja..."
                  value={squeegeeRear}
                  onChange={(e) => setSqueegeeRear(e.target.value)}
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
                  onClick={() => addBackup(squeegeeRearBks, setSqueegeeRearBks)}
                >
                  <Plus size={16} /> Backup
                </Button>
              </InputGroup>
            </Form.Group>

            {squeegeeRearBks.map((bk, i) => (
              <InputGroup className="mt-2 ms-4 w-75" key={i}>
                <Form.Control
                  type="text"
                  placeholder={`Navaja REAR Backup ${i + 1}`}
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
                  placeholder="Escanee o ingrese DMC de la Base..."
                  value={base}
                  onChange={(e) => setBase(e.target.value)}
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
                  <Plus size={16} /> Backup
                </Button>
              </InputGroup>
            </Form.Group>

            {baseBks.map((bk, i) => (
              <InputGroup className="mt-2 ms-4 w-75" key={i}>
                <Form.Control
                  type="text"
                  placeholder={`Base Backup ${i + 1}`}
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
        </Modal.Body>

        <Modal.Footer className="bg-light">
          <Button
            variant="outline-secondary"
            onClick={handleClose}
            className="d-flex align-items-center gap-1"
            disabled={isSubmitting}
          >
            <X size={16} /> Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="d-flex align-items-center gap-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" /> Guardando...
              </>
            ) : (
              <>
                <Save size={16} /> Registrar Setup
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

import { useParams } from "react-router-dom";
// Importamos la página de desarrollo y la página dedicada del Proceso 1
import { InDevelopment } from "./processes/InDevelopment";
import { SPP } from "./processes/SPP";

// 1. Mapeo dinámico de componentes por ID de proceso
const paginasDeProcesos: Record<string, React.ComponentType> = {
  "1": SPP, // Si el ID es 1, carga el componente ImpresionSoldadura
  // "2": ComponenteDeSPI,  -- Cuando lo crees en el futuro, solo debes importarlo y añadirlo aquí
  // "3": ComponenteDePickAndPlace,
};

// 2. Diccionario de nombres de procesos (como fallback para la vista de desarrollo)
const nombresDeProcesos: Record<string, string> = {
  "1": "Impresión de Soldadura",
  "2": "SPI (Solder Paste Inspection)",
  "3": "Pick and Place (Montaje)",
  "4": "Horno de Reflujo",
};

export const ProcessDetail = () => {
  const { id } = useParams<{ id: string }>();

  // Validamos si el ID es correcto y existe en nuestros parámetros
  const idProceso = id || "";

  // 3. Verificamos si existe un componente dedicado para el ID seleccionado
  const ComponenteDedicado = paginasDeProcesos[idProceso];

  if (ComponenteDedicado) {
    // Si existe, lo renderizamos dinámicamente
    return <ComponenteDedicado />;
  }

  // 4. Si no existe, cargamos la interfaz elegante de "En desarrollo"
  const nombreProceso =
    nombresDeProcesos[idProceso] || `Proceso SMT #${idProceso}`;
  return <InDevelopment processName={nombreProceso} />;
};

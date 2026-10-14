# 🛠️ Guía Técnica: Registro de un Nuevo Proceso SMT

Esta guía detalla los pasos y reglas técnicas necesarias para dar de alta un nuevo proceso de SMT en el sistema, asegurando la correcta integración entre la base de datos de **Supabase** y el frontend en **React**.

---

## 📌 Resumen del Flujo de Trabajo

Para añadir un proceso completo, deberás realizar tres acciones:

1. Registrar el proceso en la base de datos (**Supabase**).
2. Crear el componente visual de la página (**React**).
3. Registrar e importar el componente en el enrutador dinámico (**`ProcessDetail.tsx`**).

---

## ⚙️ Pasos a Seguir

### 1. Registro en la Base de Datos (Supabase)

El primer paso es registrar el proceso en la tabla `process_types` de **Supabase**. Asegúrate de llenar estrictamente las siguientes columnas:

- **`id`** _(Número)_: El identificador único del proceso.  
  _Ejemplo: `1300`_
- **`name`** _(Texto)_: El nombre técnico del proceso.  
  _Ejemplo: `Solder Paste Printer`_
- **`description`** _(Texto)_: Una breve explicación de la función del proceso en la línea.
- **`image`** _(Texto)_: El nombre del archivo de imagen asignado.

> ⚠️ **REGLA CRÍTICA DE ASSETS:**  
> El archivo de imagen física debe guardarse en la ruta:  
> `src/assets/process/nombre.webp`  
> Es **obligatorio** que la imagen esté optimizada en formato **`.webp`**. En la columna de Supabase solo se escribe el nombre del archivo (ej: `solder_printer.webp`).

---

### 2. Creación del Componente de la Página

Debes crear el archivo del componente React para la vista específica del proceso.

- **Ruta destino:** `src/pages/processes/`
- **Nombre del archivo:** Debe coincidir con el nombre de tu proceso o su acrónimo en formato PascalCase (ej: `SPP.tsx`).

---

### 3. Registro en `ProcessDetail.tsx`

Para que el sistema renderice tu nueva página cuando el usuario haga clic en el proceso, debes registrarlo en el archivo central.

📝 **Archivo a modificar:** `src/pages/ProcessDetail.tsx`

Sigue este orden dentro del archivo:

#### A. Importar el componente creado

Agrega la importación de tu nuevo componente en la sección de _imports_ superiores:

```tsx
import { SPP } from "./processes/SPP";
// Importa aquí tu nuevo componente:
// import { NuevoComponente } from "./processes/NuevoComponente";

// 1. Mapeo dinámico de componentes por ID de proceso
const paginasDeProcesos: Record<string, React.ComponentType> = {
  "1": SPP, // Si el ID en Supabase es "1", carga el componente SPP

  // 💡 Ejemplo de cómo añadir el tuyo en el futuro:
  // "1300": NuevoComponente,
};
// 2. Diccionario de nombres de procesos (como fallback para la vista de desarrollo)
const nombresDeProcesos: Record<string, string> = {
  "1": "Impresión de Soldadura",
  "2": "SPI (Solder Paste Inspection)",
  "3": "Pick and Place (Montaje)",
  "4": "Horno de Reflujo",
  // "1300": "Nombre del Nuevo Proceso",
};
```

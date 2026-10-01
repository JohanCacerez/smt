# 🚗 Sistema de Gestión de Mantenimiento y Líneas de Producción

> Plataforma web corporativa para el monitoreo de maquinaria, control de inventario/repuestos, gestión de tickets de fallas y trazabilidad de rutinas de mantenimiento en plantas de manufactura automotriz.

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Stack Tecnológico](#-stack-tecnológico)
- [Paquetes y Dependencias](#-paquetes-y-dependencias)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Variables de Entorno](#-variables-de-entorno)
- [Ejecución en Desarrollo](#-ejecución-en-desarrollo)
- [Control de Roles y Accesos](#-control-de-roles-y-accesos)

---

## 📖 Descripción General

Este sistema centraliza las operaciones de mantenimiento en planta automotriz, permitiendo:

- **Gestión de Tickets de Falla:** Reporte y seguimiento en tiempo real con niveles de severidad (`Paro de Línea`, `Crítica`, `Alta`, `Media`, `Baja`).
- **Mantenimiento Preventivo y Correctivo:** Programación de rutinas, bitácora histórica y cálculo de tiempo fuera de servicio (_downtime_).
- **Líneas y Celdas de Trabajo:** Asociación jerárquica de máquinas por línea de producción.
- **Inventario de Repuestos:** Control de refacciones utilizadas por intervención técnica.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 18+ con Vite
- **UI & Diseño:** Bootstrap 5 & React-Bootstrap
- **Gestión de Estado:** Zustand
- **Backend / DB:** Supabase (PostgreSQL, Supabase Auth, Row Level Security, Realtime)
- **Despliegue:** Vercel

---

## 📦 Paquetes y Dependencias

### Instalación Rápida

```bash
npm install @supabase/supabase-js zustand react-bootstrap bootstrap bootstrap-icons react-router-dom lucide-react date-fns
```

### Desglose de Paquetes de Producción

| Paquete                     | Versión Sugerida | Rol / Propósito en la Arquitectura                                                                                                                               |
| :-------------------------- | :--------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`@supabase/supabase-js`** |     `^2.40+`     | Cliente oficial para autenticación (Supabase Auth), consultas PostgreSQL, suscripciones en tiempo real (`Realtime`) y subida de archivos/evidencias (`Storage`). |
| **`zustand`**               |     `^4.5+`      | Gestor de estado global ligero y reactivo para sesiones, filtros dinámicos de tickets y caché de maquinaria.                                                     |
| **`react-bootstrap`**       |     `^2.10+`     | Componentes listos para React (Modales de fallas, Badges de severidad, Tablas responsivas y Formularios de captura).                                             |
| **`bootstrap`**             |     `^5.3+`      | Sistema de grid, utilidades CSS y hojas de estilo oficiales requeridas por React-Bootstrap.                                                                      |
| **`bootstrap-icons`**       |     `^1.11+`     | Conjunto de iconos estándar para controles de interfaz y tablas de datos.                                                                                        |
| **`react-router-dom`**      |     `^6.22+`     | Enrutamiento SPA, layouts modulares y rutas protegidas por roles de usuario.                                                                                     |
| **`lucide-react`**          |    `^0.350+`     | Iconografía técnica industrial limpia (motores, alertas, herramientas, calendario).                                                                              |
| **`date-fns`**              |     `^3.5+`      | Formateo ligero de fechas, cálculo de tiempo de paro (_downtime_), timestamps y cronogramas.                                                                     |

---

## 📂 Estructura del Proyecto

```text
src/
├── assets/            # Recursos estáticos (logos, diagramas, SVGs)
├── components/        # Componentes UI reutilizables (Navbar, Sidebar, Badges, Modales)
├── features/          # Módulos clave de la aplicación
│   ├── auth/          # Login, recuperación de contraseña y perfiles
│   ├── lines/         # Configuración y visualización de líneas de ensamble
│   ├── machines/      # Inventario y ficha técnica de maquinaria
│   ├── maintenance/   # Programación de preventivos y bitácoras
│   └── tickets/       # Flujo de captura, asignación y cierre de tickets
├── hooks/             # Hooks personalizados de React
├── layouts/           # Envoltorios de interfaz (AuthLayout, DashboardLayout)
├── lib/               # Clientes externos (supabaseClient.js)
├── routes/            # Configuración de React Router y Guardas de Rutas
├── store/             # Stores de Zustand (useAuthStore.js, useTicketStore.js)
├── utils/             # Funciones de cálculo de downtime, formateadores y constantes
├── App.jsx            # Punto de entrada de componentes y enrutador
└── main.jsx           # Render raíz e importación de estilos globales
```

---

## ⚙️ Requisitos Previos

- **Node.js:** Versión `18.x` o superior.
- **NPM:** Versión `9.x` o superior (o `yarn` / `pnpm`).
- **Cuenta en Supabase:** Proyecto creado con base de datos PostgreSQL.
- **Cuenta en Vercel:** Para vinculación con repositorio Git y despliegue continuo.

---

## 🚀 Instalación y Configuración

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/tu-organizacion/mantenimiento-automotriz.git
   cd mantenimiento-automotriz
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Copia el archivo de plantilla:
   ```bash
   cp .env.example .env.local
   ```

---

## 🔑 Variables de Entorno

Define los siguientes parámetros en tu archivo `.env.local`:

```env
# Configuración del Proyecto Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-llave-anonima-publica
```

> **Aviso de Seguridad:** Nunca agregues la `SUPABASE_SERVICE_ROLE_KEY` al frontend; solo debe usarse la clave pública anónima junto con políticas de seguridad **Row Level Security (RLS)** activadas.

---

## 💻 Ejecución en Desarrollo

Inicia el servidor local de desarrollo:

```bash
npm run dev
```

La aplicación estará accesible por defecto en `http://localhost:5173`.

Para compilar la aplicación para producción:

```bash
npm run build
```

---

## 👥 Control de Roles y Accesos

| Rol                           | Permisos Principales                                                                                |
| :---------------------------- | :-------------------------------------------------------------------------------------------------- |
| **Operador de Línea**         | Reporte inmediato de tickets de falla, visualización del estado de su línea asignada.               |
| **Técnico de Mantenimiento**  | Aceptación de tickets, registro de refacciones usadas, documentación de bitácoras y cierre técnico. |
| **Supervisor de Producción**  | Monitoreo global de _downtime_, aprobación de intervenciones mayores y auditoría de tiempos.        |
| **Administrador del Sistema** | Alta/baja de usuarios, configuración de líneas/máquinas y parametrización de catálogos.             |

# IngresoXpress

Proyecto web de panel administrativo orientado a la gestión ágil de ingresos y asistencia (personal / visitantes). IngresoXpress ofrece una interfaz liviana y modular para administrar departamentos, permisos de asistencia y vistas de control, pensada para despliegues rápidos con Vite y contenedores Docker.

## Propósito y funcionalidad

IngresoXpress está diseñado como un dashboard administrativo para gestionar y visualizar registros de ingreso/entrada y la estructura organizacional asociada (departamentos, permisos de asistencia, etc.). Sus objetivos principales son:

- Registrar y consultar eventos de ingreso/ asistencia de usuarios.
- Organizar y administrar departamentos y permisos relacionados con la asistencia.
- Ofrecer vistas de tablero (dashboard) y listados tabulares con componentes reutilizables.

Aunque el repositorio contiene principalmente la aplicación cliente (React + TypeScript), la estructura es adecuada para integrarse con APIs backend y despliegues en contenedores.

## Tecnologías y herramientas principales

- React (con TypeScript) — interfaz de usuario y componentes.
- Vite — herramienta de bundling y desarrollo rápido.
- pnpm — gestor de paquetes.
- React Router — enrutamiento y configuración de rutas (ver `react-router.config.ts` y `app/routes.ts`).
- Docker — configuración de contenedor (ver `Dockerfile`).
- Estructura de proyecto modular basada en carpetas por características (feature folders).

## Arquitectura y componentes centrales

El proyecto sigue una arquitectura orientada a componentes y a características:

- app/root.tsx — Punto de entrada principal de la aplicación; configura el layout y el proveedor de rutas.
- app/dashboard.tsx — Vista del tablero principal con resúmenes y componentes clave.
- app/routes.ts y react-router.config.ts — Definen y organizan las rutas de la aplicación.
- app/components — Biblioteca de componentes reutilizables de UI; incluye subcomponentes en `app/components/ui` como `sidebar.tsx`, `table.tsx` y `separator.tsx`.
- app/features — Carpeta para módulos por característica (por ejemplo `departments`, `attendance_permissions`) que agrupan vistas y lógica relacionada.
- app/lib — Lugar previsto para utilidades y abstracciones compartidas (utils, hooks, adaptadores).

Esta separación favorece el aislamiento de responsabilidades y permite escalar el código conforme crece el producto.

## Patrones de diseño y buenas prácticas

- Feature-based organization: el código se organiza por dominio/funcionalidad, facilitando la localización y el trabajo en equipos.
- Component-driven UI: componentes pequeños y reutilizables (UI primitives) como tablas y barras laterales para mantener consistencia y facilitar pruebas.
- Separation of concerns: la carpeta `components` contiene elementos puramente visuales, mientras que `features` agrupa vistas y lógica de dominio.
- Static typing: TypeScript aporta seguridad de tipos y documentación implícita en las APIs internas.
- CI/CD / container readiness: presencia de `Dockerfile` y configuración de Vite facilitan despliegues contenedorizados.

## Características y módulos destacados

- Sidebar y navegación: `app/components/ui/sidebar.tsx` provee la estructura de navegación y el menú lateral.
- Componentes de tabla: `app/components/ui/table.tsx` es una implementación reutilizable para listados y tablas.
- Separadores y utilidades UI: `app/components/ui/separator.tsx` y `app/components/SidebarMenu.tsx` muestran el enfoque en componentes reutilizables y composables.
- Vistas de dominio dentro de `app/features` (departments, attendance_permissions): diseño pensado para agregar fácilmente CRUD y pantallas de administración.

## Aspectos distintivos

- Enfoque en rapidez y ligereza: el uso de Vite y pnpm apunta a tiempos de arranque y builds rápidos, ideal para prototipos y despliegues iterativos.
- Organización modular por características: facilita mostrar trabajo en un portafolio porque cada módulo refleja una unidad de funcionalidad clara y testeable.
- Preparado para contenedores: `Dockerfile` incluido para empaquetar la aplicación cliente en entornos de producción.

## Estructura del proyecto (quick reference)

- /app
  - /components — Componentes UI reutilizables (sidebar, table, separator)
  - /features — Módulos por funcionalidad (departments, attendance_permissions, ...)
  - root.tsx, dashboard.tsx, routes.ts — Entradas y rutas principales
- /public — Archivos estáticos
- Dockerfile — Imagen y pasos para contenedor
- vite.config.ts, tsconfig.json — Configuración de build y TypeScript
- package.json, pnpm-lock.yaml — Dependencias y lockfile

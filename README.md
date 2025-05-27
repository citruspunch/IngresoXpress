# IngresoXpress

IngresoXpress es una aplicación diseñada para gestionar jornadas laborales, empleados, permisos de asistencia y reportes de entradas y salidas. Este sistema permite a las empresas llevar un control eficiente de los horarios de trabajo y la asistencia de sus empleados.

## Tecnologías Utilizadas

El proyecto utiliza las siguientes tecnologías:

- **Desarrollo**
  - **TypeScript**: Lenguaje de programación tipado para JavaScript.
  - **Vite**: Herramienta de construcción rápida para proyectos web.
  - **pnpm**: Gestor de paquetes rápido y eficiente.
  
- **Frontend**:
  - **React**: Biblioteca para construir interfaces de usuario.
  - **React Hook Form**: Manejo de formularios con validación.
  - **Zod**: Validación de esquemas de datos.
  - **TailwindCSS**: Framework de estilos CSS para diseño responsivo.
  - **ShadCN**: Componentes accesibles y personalizables.
  - **Lucide Icons**: Iconos modernos y personalizables.

- **Backend**:
  - **Supabase**: Soporte para renderizado del lado del servidor con Supabase. Base de datos basada en PostgreSQL.
  - **React Router**: Manejo de rutas en la aplicación.

- **Otros**:
  - **Sonner**: Notificaciones para la interfaz de usuario.
  - **Date-fns**: Manejo de fechas y horas (ya mencionado).
  - **@formkit/tempo**: Herramienta para manejar formatos de tiempo.

- **PDF y Reportes**
  - **@react-pdf/renderer**: Generación de documentos PDF directamente desde React.
  - **React PDF Tailwind**: Integración de TailwindCSS con la generación de PDFs.

## Funcionalidades Principales

### 1. **Gestión de Jornadas Laborales**
   - Crear, editar y eliminar jornadas laborales.
   - Configurar horarios de entrada y salida.
   - Seleccionar días laborales.

### 2. **Gestión de Empleados**
   - Registrar nuevos empleados.
   - Asignar departamentos y jornadas laborales.
   - Editar y eliminar información de empleados.

### 3. **Permisos de Asistencia**
   - Otorgar permisos de ausencia, entrada tarde o salida temprano.
   - Registrar motivos y fechas específicas para los permisos.

### 4. **Reportes de Entradas y Salidas**
   - Generar reportes detallados en formato PDF.
   - Consultar entradas y salidas de empleados en un rango de fechas.
   - Visualizar información como horas trabajadas, permisos y observaciones.

### 5. **Interfaz de Usuario**
   - Navegación intuitiva con un menú lateral.
   - Formularios dinámicos con validación en tiempo real.
   - Notificaciones para confirmar acciones realizadas.

## Manual de Usuario

### **Gestión de Jornadas Laborales**
1. Ve a la sección "Jornadas Laborales" desde el menú lateral.
2. Haz clic en "Añadir Jornada Laboral" para crear una nueva jornada.
3. Completa el formulario con el nombre, horario y días laborales.
4. Para editar o eliminar una jornada, utiliza las opciones disponibles en la tabla.

### **Gestión de Empleados**
1. Ve a la sección "Empleados" desde el menú lateral.
2. Haz clic en "Añadir Empleado" para registrar un nuevo empleado.
3. Completa el formulario con el nombre, departamento y jornada laboral asignada.
4. Para editar o eliminar un empleado, utiliza las opciones disponibles en la tabla.

### **Permisos de Asistencia**
1. Ve a la sección "Permisos" desde el menú lateral.
2. Selecciona un empleado y completa el formulario con la fecha, tipo de permiso y motivo.
3. Confirma la acción para registrar el permiso.

### **Generación de Reportes**
1. Ve a la sección "Reportes" desde el menú lateral.
2. Selecciona un empleado y un rango de fechas.
3. Haz clic en "Generar Reporte" para visualizar los datos.
4. Descarga el reporte en formato PDF si es necesario.

### **Gestión de Jornadas Laborales**
1. Ve a la sección "Jornadas Laborales" desde el menú lateral.
2. Haz clic en "Añadir" para crear una nueva jornada.
3. Completa el formulario con el nombre, horario y días laborales.
4. Para editar o eliminar una jornada, utiliza las opciones disponibles en la tabla.

### **Visualización de Entradas y Salidas**
1. Ve a la sección "Entradas y Salidas" desde el menú lateral.
2. Ahi podrás ver un listado de todas las entradas y salidas registradas en tiempo real.

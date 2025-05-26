import { CalendarIcon, FileTextIcon } from '@radix-ui/react-icons'
import { Marquee } from 'components/magicui/marquee'
import { BookCheck, Share2Icon } from 'lucide-react'
import { Calendar } from './components/ui/calendar'
import { BentoCard, BentoGrid } from 'components/magicui/bento-grid'
import AnimatedBeamMultipleOutput from 'components/magicui/AnimatedBeam'
import { AnimatedListNotification } from 'components/magicui/AnimatedList'
import { cn } from './lib/utils'
import { TypingAnimation } from 'components/magicui/typing-animation'
import { appRoute } from './routes'

const pdfColumns = [
  {
    name: 'Fecha',
    body: 'Contiene la fecha del registro de asistencia de cada empleado. Permite identificar el día exacto de cada registro.',
  },
  {
    name: 'Entrada',
    body: 'Hora exacta de entrada registrada por el empleado. Refleja el momento en que inicia su jornada laboral.',
  },
  {
    name: 'Salida',
    body: 'Hora exacta de salida registrada por el empleado. Indica cuándo finalizó su jornada ese día.',
  },
  {
    name: 'Entrada tarde',
    body: 'Minutos de retraso en la entrada respecto al horario establecido. Útil para el control de puntualidad.',
  },
  {
    name: 'Salida temprana',
    body: 'Minutos de salida antes del horario de salida programado. Ayuda a detectar salidas anticipadas.',
  },
  {
    name: 'Horas trabajadas',
    body: 'Cantidad total de horas trabajadas en la jornada. Calculado automáticamente según los registros.',
  },
  {
    name: 'Observaciones',
    body: 'Observaciones relevantes como “No marcó entrada” o “No marcó salida”. Incluye incidencias especiales.',
  },
  {
    name: 'Permisos',
    body: 'Permisos otorgados al empleado en la fecha correspondiente. Puede incluir ausencias justificadas.',
  },
  {
    name: 'Motivo del permiso',
    body: 'Motivo detallado del permiso solicitado por el empleado. Especifica la razón de la ausencia o permiso.',
  },
]

const features = [
  {
    Icon: FileTextIcon,
    name: 'Reportes de Asistencia',
    description: 'Genera y descarga reportes detallados de entradas y salidas de empleados en PDF.',
    href: appRoute.reports,
    cta: 'Ver reportes',
    className: 'col-span-3 lg:col-span-1',
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
      >
        {pdfColumns.map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              'relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4',
              'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
              'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]',
              'transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none'
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white ">
                  {f.name}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-xs">{f.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
   {
    Icon: BookCheck,
    name: 'Vista de Entradas y Salidas',
    description: 'Consulta todas las marcas de asistencia: hora de marcaje, tipo de marca (entrada/salida) y el empleado que realizó la acción.',
    href: '#',
    cta: 'Ver marcajes',
    className: 'col-span-3 lg:col-span-2',
    background: (
      <AnimatedListNotification className="absolute right-2 top-4 h-[300px] w-full scale-75 border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90" />
    ),
  },
  {
    Icon: Share2Icon,
    name: 'Integración con Departamentos',
    description: 'Gestiona empleados y permisos por departamento para un control más eficiente.',
    href: appRoute.departments,
    cta: 'Ver departamentos',
    className: 'col-span-3 lg:col-span-2',
    background: (
      <AnimatedBeamMultipleOutput className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
    ),
  },
  {
    Icon: CalendarIcon,
    name: 'Permisos de Asistencia',
    description: 'Añade y gestiona permisos de asistencia para fechas específicas de manera sencilla.',
    className: 'col-span-3 lg:col-span-1',
    href: appRoute.permissions,
    cta: 'Añadir permiso',
    background: (
      <Calendar
        mode="single"
        selected={new Date()}
        className="absolute right-0 top-10 origin-top scale-75 rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-90"
      />
    ),
  },
]

export function Dashboard() {
  return (
    <>
      <TypingAnimation className="text-center mt-5 text-4xl font-semibold px-5">{`¡Hola! Bienvenido a IngresoXpress.`}</TypingAnimation>
      <BentoGrid className="py-8 px-5">
        {features.map((feature, idx) => (
          <BentoCard key={idx} {...feature} />
        ))}
      </BentoGrid>
    </>
  )
}

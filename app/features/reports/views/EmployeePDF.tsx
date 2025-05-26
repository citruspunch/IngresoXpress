import { Document, Page, Text, View } from '@react-pdf/renderer'
import { tw } from './pdfStyles'
import { format } from '@formkit/tempo'

type Props = {
  data: {
    date: string
    check_in: string
    check_out: string
    late_check_in: string
    early_check_out: string
    total_work_time: string
    permissions: string
    reason: string
    observations: string
  }[]
  employeeName: string
  employeeId: string
  workDay: string
  workingDays: string
  dateRange: string
  department: string
  departmentId: string
}

export const EmployeePDF = ({
  data,
  employeeName,
  employeeId,
  workDay,
  workingDays,
  dateRange,
  department,
  departmentId,
}: Props) => (
  <Document>
    <Page
      size="A4"
      orientation="landscape"
      style={tw('p-6 font-sans')}
      wrap
    >
      <Text style={tw('text-4xl font-extrabold mt-2 leading-5')}>
        Reporte de Entradas y Salidas
      </Text>
      <Text style={tw('text-3xl mb-1 mt-2 leading-5')}>{dateRange}</Text>
      <Text style={tw('text-sm font-medium my-1')}>
        Generado el {format(new Date(), 'full', 'es')} a las{' '}
        {new Date().toLocaleTimeString('es-ES')}
      </Text>
      <Text style={tw('text-[11px] font-light mb-1 mt-4')}>
        Empleado: {employeeName} (ID: {employeeId})
      </Text>
      <Text style={tw('text-[11px] font-light mb-1')}>
        Departamento: {department} (ID: {departmentId})
      </Text>
      <Text style={tw('text-[11px] font-light mb-1')}>Jornada Laboral: {workDay}</Text>
      <Text style={tw('text-[11px] font-light mb-8')}>Días Laborales: {workingDays}</Text>

      <View style={tw('flex flex-row border border-gray-300 bg-gray-100')} fixed>
        <Text
          style={tw(
            'w-[13%] px-1 py-2 text-xs font-bold border-r border-gray-300'
          )}
        >
          Fecha
        </Text>
        <Text
          style={tw(
            'w-[7%] px-1 py-2 text-xs font-bold border-r border-gray-300'
          )}
        >
          Entrada
        </Text>
        <Text
          style={tw(
            'w-[7%] px-1 py-2 text-xs font-bold border-r border-gray-300'
          )}
        >
          Salida
        </Text>
        <Text
          style={tw(
            'w-[10%] px-1 py-2 text-xs font-bold border-r border-gray-300'
          )}
        >
          Entrada Tarde
        </Text>
        <Text
          style={tw(
            'w-[11%] px-1 py-2 text-xs font-bold border-r border-gray-300'
          )}
        >
          Salida Temprano
        </Text>
        <Text
          style={tw(
            'w-[12%] px-1 py-2 text-xs font-bold border-r border-gray-300'
          )}
        >
          Horas Trabajadas
        </Text>
        <Text
          style={tw(
            'w-[12%] px-1 py-2 text-xs font-bold border-r border-gray-300'
          )}
        >
          Permisos
        </Text>
        <Text
          style={tw(
            'w-[16%] px-1 py-2 text-xs font-bold border-r border-gray-300'
          )}
        >
          Motivo
        </Text>
        <Text style={tw('w-[12%] px-1 py-2 text-xs font-bold')}>
          Observaciones
        </Text>
      </View>
      <View wrap>
        {data.map((row, idx) => (
          <View
            key={idx}
            style={tw(
              `flex flex-row border-l border-r border-b border-gray-300 ${
                idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'
              }`
            )}
            break
          >
            <Text style={tw('w-[13%] px-1 py-2 text-xs text-gray-900')}>
              {row.date}
            </Text>
            <Text style={tw('w-[7%] px-1 py-2 text-xs text-gray-900')}>
              {row.check_in}
            </Text>
            <Text style={tw('w-[7%] px-1 py-2 text-xs text-gray-900')}>
              {row.check_out}
            </Text>
            <Text style={tw('w-[10%] px-1 py-2 text-xs text-gray-900')}>
              {row.late_check_in}
            </Text>
            <Text style={tw('w-[11%] px-1 py-2 text-xs text-gray-900')}>
              {row.early_check_out}
            </Text>
            <Text style={tw('w-[12%] px-1 py-2 text-xs text-gray-900')}>
              {row.total_work_time}
            </Text>
            <Text style={tw('w-[12%] px-1 py-2 text-xs text-gray-900')}>
              {row.permissions}
            </Text>
            <Text style={tw('w-[16%] px-1 py-2 text-xs text-gray-900')}>
              {row.reason}
            </Text>
            <Text
              style={tw('w-[12%] px-1 py-2 text-xs text-gray-900 text-left')}
            >
              {row.observations}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
)

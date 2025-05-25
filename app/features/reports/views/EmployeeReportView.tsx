import { format } from '@formkit/tempo'
import { SortVertical } from '@solar-icons/react/ssr'
import type { ColumnDef } from '@tanstack/react-table'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { FileDown, Repeat2 } from 'lucide-react'
import type { ComponentProps } from 'react'
import { DataTable } from '~/components/data-table'
import { Button } from '~/components/ui/button'
import {
  getWorkingDaysInSpanish,
  type EmployeeReport,
  type employeeReportHeader,
} from '~/lib/utils'

const columns: ColumnDef<EmployeeReport>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        variant="ghost"
        className="p-0 has-[>svg]:px-0"
      >
        Fecha <SortVertical />
      </Button>
    ),
  },
  {
    accessorKey: 'check_in',
    header: 'Entrada',
  },
  {
    accessorKey: 'check_out',
    header: 'Salida',
  },
  {
    accessorKey: 'late_check_in',
    header: 'Entrada Tarde',
  },
  {
    accessorKey: 'early_check_out',
    header: 'Salida Temprana',
  },
  {
    accessorKey: 'total_work_time',
    header: 'Horas Trabajadas',
  },
  {
    accessorKey: 'permissions',
    header: 'Permisos',
  },
  {
    accessorKey: 'observations',
    header: 'Observaciones',
  },
]

type EmployeeReportViewProps = {
  employeeHeader: employeeReportHeader
  employeeReportEntries: Record<string, EmployeeReport[]>
}

const EmployeeReportView = ({
  employeeHeader,
  employeeReportEntries,
  ...props
}: EmployeeReportViewProps & ComponentProps<'div'>) => {
  const flatData = Object.entries(employeeReportEntries).flatMap(
    ([date, reports]) =>
      reports.map((report) => ({
        ...report,
        date: format(date, 'long', 'es'),
      }))
  )
  const fromDate = format(employeeHeader.from, 'long', 'es')
  const toDate = format(employeeHeader.to, 'long', 'es')

  const checkInTime = employeeHeader.work_day.check_in_time.split('-')[0]
  const checkOutTime = employeeHeader.work_day.check_out_time.split('-')[0]
  const checkInTimeFormatted = `${checkInTime.split(':')[0]}:${
    checkInTime.split(':')[1]
  }`
  const checkOutTimeFormatted = `${checkOutTime.split(':')[0]}:${
    checkOutTime.split(':')[1]
  }`

  const workingDays = getWorkingDaysInSpanish(
    employeeHeader.work_day.working_days
  ).join(', ')


  return (
    <div id="reporte" className="w-5xl mx-auto space-y-8" {...props}>
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <Repeat2 size={40} />
          <h2 className="font-bold text-4xl mb-3">
            Reportes Entradas y Salidas
          </h2>
          <h3 className="text-xl font-semibold">
            Del {fromDate} al {toDate}
          </h3>
          <p className="text-muted-foreground">
            {`Empleado: ${employeeHeader.employee_name}`}
            <br />
            {`Departamento: ${employeeHeader.department}`}
            <br />
            {`Jornada Laboral: ${employeeHeader.work_day.name} (${checkInTimeFormatted} - ${checkOutTimeFormatted})`}
            <br />
            {`Dias Laborales: ${workingDays}`}
          </p>
        </div>
        <Button variant="outline">
          <FileDown />
          Descargar PDF
        </Button>
      </div>
      <DataTable data={flatData} columns={columns} selectionActive={false} />
    </div>
  )
}
export default EmployeeReportView

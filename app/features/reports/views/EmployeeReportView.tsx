import { format } from '@formkit/tempo'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { SortVertical } from '@solar-icons/react/ssr'
import type { ColumnDef } from '@tanstack/react-table'
import { FileDown, Repeat2 } from 'lucide-react'
import type { ComponentProps } from 'react'
import React, { useEffect, useState } from 'react'
import { DataTable } from '~/components/data-table'
import { Button } from '~/components/ui/button'
import {
  getWorkingDaysInSpanish,
  type EmployeeReport,
  type employeeReportHeader,
} from '~/lib/utils'
import { EmployeePDF } from './EmployeePDF'
import { toast } from 'sonner'

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
    accessorKey: 'observations',
    header: 'Observaciones',
  },
  {
    accessorKey: 'permissions',
    header: 'Permisos',
    
  },
  {
    accessorKey: 'reason',
    header: 'Motivo de Permiso',
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

  const workDayFormat = `${employeeHeader.work_day.name} (${checkInTimeFormatted} - ${checkOutTimeFormatted})`

  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="max-w-5xl mx-auto space-y-8" {...props}>
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
            {`Jornada Laboral: ${workDayFormat}`}
            <br />
            {`Dias Laborales: ${workingDays}`}
          </p>
        </div>
        {isClient && (
          <PDFDownloadLink
            document={
              <EmployeePDF
                data={flatData}
                employeeName={employeeHeader.employee_name}
                employeeId={employeeHeader.employee_id}
                workDay={workDayFormat}
                workingDays={workingDays}
                dateRange={`Del ${fromDate} al ${toDate}`}
                department={employeeHeader.department}
                departmentId={employeeHeader.department_id}
              />
            }
            fileName={`reporte_${employeeHeader.employee_name}.pdf`}
          >
            {({ loading }) =>
              loading ? (
                <Button variant="outline" disabled>
                  Generando PDF...
                </Button>
              ) : (
                <Button variant="outline" onClick={() => toast.success('PDF generado')}>
                  <FileDown className="mr-2" />
                  Descargar PDF
                </Button>
              )
            }
          </PDFDownloadLink>
        )}
      </div>
      <DataTable data={flatData} columns={columns} selectionActive={false} />
    </div>
  )
}
export default EmployeeReportView

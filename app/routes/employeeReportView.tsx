import { createClient } from '~/lib/supabase/server'
import type { Route } from './+types/employeeReportView'
import EmployeeReportView from '~/features/reports/views/EmployeeReportView'
import { redirect } from 'react-router'
import { appRoute } from '~/routes'
import {
  convertToTime,
  getPassTypesInSpanish,
  getTotalTime,
  groupByDate,
  type EmployeeReport,
  type employeeReportHeader,
} from '~/lib/utils'
import { toast } from 'sonner'

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { supabase } = createClient(request)
  const { employee_id, date_range } = params
  const parsedDateRange = JSON.parse(date_range)
  console.log('Employee ID:', employee_id)
  console.log('from:', parsedDateRange.from)
  console.log('to:', parsedDateRange.to)
  const { data, error } = await supabase
    .from('entry')
    .select('*, employee(*, department(*), pass(*), work_day(*))')
    .eq('employee', employee_id)
    .gte('created_at', parsedDateRange.from)
    .lte('created_at', parsedDateRange.to)
    .order('created_at', { ascending: true })

  if (error) {
    console.error(error)
    return redirect(appRoute.reports)
  }

  if (data.length === 0) {
    console.warn('No data found for the given employee ID and date range.')
    return {
      error:
        'No se encontraron registros para el empleado seleccionado en el rango de fechas especificado.',
      employeeReportEntries: {} as Record<string, EmployeeReport[]>,
      employeeHeader: {} as employeeReportHeader,
    }
  }
  const employeeReportEntries: Record<string, EmployeeReport[]> = {}
  const employeeHeader: employeeReportHeader = {
    employee_id: data[0].id,
    employee_name: data[0].employee.name,
    department: data[0].employee.department.name,
    department_id: data[0].employee.department.id,
    from: parsedDateRange.from,
    to: parsedDateRange.to,
    work_day: data[0].employee.work_day,
  }

  const employeeWorkEntries = groupByDate(data)

  const todayDate = new Date().toISOString().split('T')[0]

  Object.entries(employeeWorkEntries).forEach(([date, entries]) => {
    // Si no existe la fecha en employeeReportEntries, inicializarla
    if (!employeeReportEntries[date]) {
      employeeReportEntries[date] = []
    }

    let passPermissions = ''
    let passPermissionsReason = ''
    console.log('date', date)
    if (data[0].employee.pass.length > 0) {
      data[0].employee.pass.map((pass) => {
        if (pass.date === date) {
          const type = getPassTypesInSpanish(pass.type)
          passPermissions += `${type} `
          passPermissionsReason += `${pass.reason} `
        }
      })
    }
    // Filtrar las entradas por tipo
    const checkInEntry = entries.find((entry) => entry.type === 'check in')
    const checkOutEntry = entries.find((entry) => entry.type === 'check out')

    // Verificar que existan ambas entradas
    if (checkInEntry && checkOutEntry) {
      const checkInDate = checkInEntry.created_at
      const checkOutDate = checkOutEntry.created_at

      const checkInHour = (checkInDate.split('T')[1].split('+')[0]).split('.')[0]
      const checkOutHour = (checkOutDate.split('T')[1].split('+')[0]).split('.')[0]

      // Convertir las fechas a milisegundos
      const checkInTime = new Date(checkInDate).getTime()
      const checkOutTime = new Date(checkOutDate).getTime()

      // Calcular late_check_in
      const workScheduleCheckInTime = convertToTime(
        checkInDate,
        checkInEntry.employee.work_day.check_in_time
      )
      const lateCheckInDifference = checkInTime - workScheduleCheckInTime

      const late_check_in =
        lateCheckInDifference > 0
          ? getTotalTime(lateCheckInDifference)
          : '0 min'

      // Calcular early_check_out
      const workScheduleCheckOutTime = convertToTime(
        checkOutDate,
        checkOutEntry.employee.work_day.check_out_time
      )
      const earlyCheckOutDifference =
        (workScheduleCheckOutTime - checkOutTime) / (1000 * 60)
      const early_check_out =
        earlyCheckOutDifference > 0
          ? getTotalTime(earlyCheckOutDifference)
          : '0 min'

      // Calcular total_work_time
      const totalWorkTimeInMs = checkOutTime - checkInTime
      const total_work_time = getTotalTime(totalWorkTimeInMs)

      // Agregar los datos a employeeReportEntries
      employeeReportEntries[date].push({
        check_in: checkInHour,
        check_out: checkOutHour,
        late_check_in,
        early_check_out,
        total_work_time,
        permissions: passPermissions ? passPermissions : '-',
        reason: passPermissionsReason ? passPermissionsReason : '-',
        observations: '',
      })
    } else if (checkInEntry && !checkOutEntry) {
      // Si solo hay check-in, agregarlo a la lista
      const checkInDate = checkInEntry.created_at
      const checkInTime = new Date(checkInDate).getTime()

      const checkInHour = (checkInDate.split('T')[1].split('+')[0]).split('.')[0]

      // Calcular late_check_in
      const workScheduleCheckInTime = convertToTime(
        checkInDate,
        checkInEntry.employee.work_day.check_in_time
      )
      const lateCheckInDifference = checkInTime - workScheduleCheckInTime
      const late_check_in =
        lateCheckInDifference > 0
          ? getTotalTime(lateCheckInDifference)
          : '0 min'

      employeeReportEntries[date].push({
        check_in: checkInHour,
        check_out: '',
        late_check_in,
        early_check_out: '',
        total_work_time: date === todayDate ? '' : '*',
        permissions: passPermissions ? passPermissions : '-',
        reason: passPermissionsReason ? passPermissionsReason : '-',
        observations:
          date === todayDate ? 'No ha marcado salida' : 'No marcó salida',
      })
    } else if (!checkInEntry && checkOutEntry) {
      // Si solo hay check-out, agregarlo a la lista
      const checkOutDate = checkOutEntry.created_at
      const checkOutHour = (checkOutDate.split('T')[1].split('+')[0]).split('.')[0]
      const checkOutTime = new Date(checkOutDate).getTime()
      const workScheduleCheckOutTime = convertToTime(
        checkOutDate,
        checkOutEntry.employee.work_day.check_out_time
      )
      const earlyCheckOutDifference = workScheduleCheckOutTime - checkOutTime
      const early_check_out =
        earlyCheckOutDifference > 0
          ? getTotalTime(earlyCheckOutDifference)
          : '0 min'
      employeeReportEntries[date].push({
        check_in: '',
        check_out: checkOutHour,
        late_check_in: '',
        early_check_out,
        total_work_time: '*',
        permissions: passPermissions ? passPermissions : '-',
        reason: passPermissionsReason ? passPermissionsReason : '-',
        observations: 'No marcó entrada',
      })
    } else {
      employeeReportEntries[date].push({
        check_in: 'no data',
        check_out: 'no data',
        late_check_in: 'no data',
        early_check_out: 'no data',
        total_work_time: 'no data',
        permissions: 'no data',
        reason: 'no data',
        observations: 'no data',
      })
    }
  })
  return { employeeReportEntries, employeeHeader }
}

export const clientLoader = async ({
  serverLoader,
}: Route.ClientLoaderArgs) => {
  const serverData = await serverLoader()
  if (serverData.error) {
    toast.error(serverData.error)
    return redirect(appRoute.reports)
  }
  return { ...serverData }
}

const Component = ({ loaderData }: Route.ComponentProps) => {
  return (
    <EmployeeReportView
      employeeHeader={loaderData.employeeHeader}
      employeeReportEntries={loaderData.employeeReportEntries}
    />
  )
}

export default Component

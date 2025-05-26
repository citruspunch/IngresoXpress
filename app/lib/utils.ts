import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Tables } from './supabase/types'
import { createClient } from './supabase/server'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetchEmployeesWithDepartments = async (request: Request) => {
  const { supabase } = createClient(request)
  const { data, error } = await supabase
    .from('employee')
    .select('*, department(name)')
    .order('department', { ascending: true })
    .order('name', { ascending: true })

  if (error !== null) return {}
  const departmentEmployees: Record<string, Tables<'employee'>[]> = {}
  data.forEach((employee) => {
    if (employee.department) {
      // If the department is not already in the object, create an empty array
      if (!departmentEmployees[employee.department.name]) {
        departmentEmployees[employee.department.name] = []
      }
      // Push the employee to the corresponding department array
      departmentEmployees[employee.department.name].push(employee)
    }
  })
  return departmentEmployees
}

export type employeeReportHeader = {
  employee_id: string
  employee_name: string
  department: string
  department_id: string
  from: string
  to: string
  work_day: Tables<'work_day'>
}

export type EmployeeReport = {
  check_in: string
  check_out: string
  late_check_in: string
  early_check_out: string
  total_work_time: string
  permissions: string
  reason: string
  observations: string
}

export const convertToTime = (
  dateInTimestamptz: string,
  dateInTimetz: string
): number => {
  const checkDate = new Date(dateInTimestamptz)
  // Set the check-in time to the same date as the entry as it is in timetz format
  const extractedDate = dateInTimetz.split('-')[0] 
  const [entryHours, entryMinutes, entrySeconds] = extractedDate.split(':')
  checkDate.setUTCHours(
    parseInt(entryHours),
    parseInt(entryMinutes),
    parseInt(entrySeconds)
  )
  return checkDate.getTime()
}

export const getTimeDifference = (
  startTime: string,
  endTime: string
): string => {
  const start = new Date(startTime)
  const end = new Date(endTime)

  const diffInMs = end.getTime() - start.getTime()
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60))

  return `${diffInHours}h ${diffInMinutes}m`
}

export type EntryWithRelations = Tables<'entry'> & {
  employee: Tables<'employee'> & {
    department: Tables<'department'>
    pass: Tables<'pass'>[]
    work_day: Tables<'work_day'>
  }
}

export const groupByDate = (
  data: EntryWithRelations[]
): Record<string, EntryWithRelations[]> => {
  const grouped = data.reduce((acc, item) => {
    const date = item.created_at.split('T')[0]
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(item)
    return acc
  }, {} as Record<string, EntryWithRelations[]>)
  console.log('Grouped data:', grouped)
  return grouped
}

export const getWorkingDaysInSpanish = (days: string[]): string[] => {
  const daysInSpanish: Record<string, string> = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo',
  }
  return days.map((day) => daysInSpanish[day])
}

export const getPassTypesInSpanish = (types: string): string => {
  const typesInSpanish: Record<string, string> = {
    'absence': 'Ausencia',
    'late check in': 'Entrada Tarde',
    'early check out': 'Salida Temprana',
  }
  return typesInSpanish[types] || types
}

export const getTotalTime = (timeInMs: number): string => {
  const totalMinutes = Math.floor(timeInMs / (1000 * 60))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0 && minutes === 0) return '0 minutos'
  if (hours === 0) return `${minutes} minutos`
  if (minutes === 0) return `${hours} horas`

  return `${hours}h ${minutes}m`
}
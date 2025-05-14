import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Tables } from './supabase/types'
import { createClient } from './supabase/server'
import type { Table } from '@tanstack/react-table'

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

export type EmployeeReport =
  | {
      check_in: string
      check_out: string
      late_check_in: string
      early_check_out: string
      total_work_time: string
      permission: Tables<'pass'>
    }
  | {
      employee_id: string
      employee_name: string
      department: string
      department_id: string
      work_day: string
    }



import { PostgrestError } from '@supabase/supabase-js'
import { toast } from 'sonner'
import Loader from '~/components/loader'
import EmployeesView from '~/features/employees/views/EmployeesView'
import { createClient } from '~/lib/supabase/server'
import type { Tables } from '~/lib/supabase/types'
import type { Route } from './+types/employees'

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase } = createClient(request)
  const employeesResult = await supabase.from('employee').select('*')
  const departmentsResult = await supabase.from('department').select('*')
  const workDaysResult = await supabase.from('work_day').select('*')
  const error =
    employeesResult.error ?? departmentsResult.error ?? workDaysResult.error
  return {
    error: error,
    employees: employeesResult.data,
    departments: departmentsResult.data,
    workDays: workDaysResult.data,
  }
}

export const clientLoader = async ({
  serverLoader,
}: Route.ClientLoaderArgs) => {
  const { employees, departments, workDays, error } = await serverLoader()
  if (error !== null) {
    toast.error('Ocurrió un error cargando los empleados. Inténtalo de nuevo.')
    toast.info(error.toString())
  }
  return {
    employees: employees ?? [],
    departments: departments ?? [],
    workDays: workDays ?? [],
  }
}

export const HydrateFallback = () => <Loader />

clientLoader.hydrate = true as const

export enum EmployeeAction {
  create,
  edit,
  delete,
}

export type EmployeeUpdate = {
  action: EmployeeAction.edit
} & Pick<Tables<'employee'>, 'id'> &
  Partial<Omit<Tables<'employee'>, 'created_at' | 'id'>>

export type EmployeeFormData =
  | EmployeeUpdate
  | { action: EmployeeAction.delete; employees: Tables<'employee'>[] }
  | ({ action: EmployeeAction.create } & Omit<
      Tables<'employee'>,
      'id' | 'created_at'
    >)

export const action = async ({ request }: Route.ActionArgs) => {
  const { supabase } = createClient(request)
  const data: EmployeeFormData = await request.clone().json()
  let error: PostgrestError | null
  switch (data.action) {
    case EmployeeAction.create: {
      error = (
        await supabase.from('employee').insert({
          name: data.name,
          department: data.department,
          work_day: data.work_day,
        })
      ).error
      break
    }
    case EmployeeAction.edit: {
      error = (
        await supabase
          .from('employee')
          .update({
            name: data.name,
            department: data.department,
            work_day: data.work_day,
          })
          .eq('id', data.id)
      ).error
      break
    }
    case EmployeeAction.delete: {
      error = (
        await supabase
          .from('employee')
          .delete()
          .in(
            'id',
            data.employees.map((e) => e.id)
          )
      ).error
      break
    }
  }
  if (error !== null) console.error(error)
  return error === null
}

const Component = ({ loaderData }: Route.ComponentProps) => (
  <EmployeesView {...loaderData} />
)

export default Component

import { redirect } from 'react-router'
import { toast } from 'sonner'
import SidebarMenu from '~/components/sidebarmenu'
import type { AttendancePermissionFormData } from '~/features/attendance_permissions/views/AttendancePermissionForm'
import AttendancePermissionView from '~/features/attendance_permissions/views/AttendancePermissionView'
import { createClient } from '~/lib/supabase/server'
import type { Tables } from '~/lib/supabase/types'
import { appRoute } from '~/routes'
import type { Route } from './+types/permissions'

export const loader = async ({ request }: Route.LoaderArgs) => {
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
  console.log('departmentEmployees', departmentEmployees)
  return departmentEmployees
}

export const action = async ({ request }: Route.ActionArgs) => {
  const { supabase } = createClient(request)
  const { date, employee, reason, type }: AttendancePermissionFormData =
    await request.clone().json()
  const { error } = await supabase.from('pass').insert({
    date: date,
    employee: employee,
    type: type,
    reason: reason,
  })
  if (error !== null) {
    toast.error('Error registrando el permiso. Intenta nuevamente')
    console.error(error)
    return
  }
  toast.success('El permiso fue registrado correctamente')
  return redirect(appRoute.dashboard)
}

const Component = ({ loaderData }: Route.ComponentProps) => (
  <SidebarMenu>
    <AttendancePermissionView employees={loaderData!} />
  </SidebarMenu>
)

export default Component

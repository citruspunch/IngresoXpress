import AttendancePermissionView from '~/features/attendance_permissions/views/AttendancePermissionView'
import type { Route } from './+types/permissions'
import { createClient } from '~/lib/supabase/server'
import type { Tables } from '~/lib/supabase/types'
import { redirect } from 'react-router'
import { toast } from 'sonner'
import { appRoute } from '~/routes'
import SidebarMenu from '~/components/SidebarMenu'

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase } = createClient(request)
  const { data, error } = await supabase
    .from('employee')
    .select('*, department(name)')
    .order('department', { ascending: true })
    .order('name', { ascending: true })
  console.log('data', data)
  if (data) {
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
  return []
}

export const action = async ({ request }: Route.ActionArgs) => {
  const { supabase } = createClient(request)
  const formData = await request.formData()
  const employee = formData.get('employee')
  const date = formData.get('date')
  const reason = formData.get('reason')
  const type = formData.get('type')

  if (employee && date && reason && type) {
    // const result1 = await supabase.from('pass').insert({
    //   date: 'sadas',
    //   employee: 'asdas',
    //   type: 'asdas',
    //   reason: 'asdsa',
    // })

    const result = await supabase
      .from('pass')
      .insert({
        date: 'hola',
        employee: 'ineunt',
        type: 'absence',
        reason: 'heunt',
      })
    if (result.error !== null) {
      toast.error('Error registrando el permiso. Intenta nuevamente')
      console.error(result.error)
      return
    }
    toast.success('El permiso fue registrado correctamente')
    return redirect(appRoute.dashboard)
  }
}

const Component = ({ loaderData }: Route.ComponentProps) => (
  <SidebarMenu>
    <AttendancePermissionView employees={loaderData!} />
  </SidebarMenu>
)

export default Component

import { redirect } from 'react-router'
import { toast } from 'sonner'
import type { AttendancePermissionFormData } from '~/features/attendance_permissions/views/AttendancePermissionForm'
import AttendancePermissionView from '~/features/attendance_permissions/views/AttendancePermissionView'
import { createClient } from '~/lib/supabase/server'
import { appRoute } from '~/routes'
import type { Route } from './+types/permissions'
import { fetchEmployeesWithDepartments } from '~/lib/utils'

export const loader = async ({ request }: Route.LoaderArgs) => {
  return fetchEmployeesWithDepartments(request)
}

export const action = async ({ request }: Route.ActionArgs) => {
  const { supabase } = createClient(request)
  const { date, employee, reason, type, action }: AttendancePermissionFormData =
    await request.clone().json()
  switch (action) {
    case 'create': {
      const { error } = await supabase.from('pass').insert({
        date: date,
        employee: employee,
        type: type,
        reason: reason,
      })
      if (error !== null) console.error(error)
      return error === null
    }
    case 'update': {
      const { error } = await supabase.from('pass').update({
        date: date,
        employee: employee,
        type: type,
        reason: reason,
      })
      if (error !== null) console.error(error)
      return error === null
    }
    default:
      throw new Error('Invalid action')
  }
}

export const clientAction = async ({
  serverAction,
}: Route.ClientActionArgs) => {
  const wasSuccessful = await serverAction()
  if (wasSuccessful) {
    toast.success('El permiso fue registrado correctamente')
    return redirect(appRoute.dashboard)
  } else {
    toast.error('Error registrando el permiso. Intenta nuevamente')
  }
}

const Component = ({ loaderData }: Route.ComponentProps) => (
  <AttendancePermissionView employees={loaderData!} />
)

export default Component

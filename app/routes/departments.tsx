import { toast } from 'sonner'
import SidebarMenu from '~/components/SidebarMenu'
import DepartmentsView from '~/features/departments/views/DepartmentsView'
import { createClient } from '~/lib/supabase/server'
import type { Tables } from '~/lib/supabase/types'
import type { Route } from './+types/departments'

export enum DepartmentsAction {
  edit,
  create,
  delete,
}

type a = Pick<Tables<'department'>, 'id'>['id']

export type DepartmentFormData =
  | ({
      action: DepartmentsAction.create
    } & Pick<Tables<'department'>, 'name'>)
  | {
      action: DepartmentsAction.delete
      ids: Pick<Tables<'department'>, 'id'>['id'][]
    }
  | ({
      action: DepartmentsAction.edit
    } & Pick<Tables<'department'>, 'id' | 'name'>)

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase } = createClient(request)
  const { data } = await supabase.from('department').select('*')
  return data ?? []
}

export const action = async ({ request }: Route.ActionArgs) => {
  const { supabase } = createClient(request)
  const formData: DepartmentFormData = await request.clone().json()
  const collection = supabase.from('department')
  switch (formData.action) {
    case DepartmentsAction.create: {
      const { error } = await collection.insert({ name: formData.name })
      console.error(error)
      return { error, action: formData.action }
    }
    case DepartmentsAction.delete: {
      const { error } = await collection.delete().in('id', formData.ids)
      console.error(error)
      return { error, action: formData.action }
    }
    case DepartmentsAction.edit: {
      const { error } = await collection
        .update({ name: formData.name })
        .eq('id', formData.id)
      console.error(error)
      return { error, action: formData.action }
    }
  }
}

export const clientAction = async ({
  serverAction,
}: Route.ClientActionArgs) => {
  const { error, action } = await serverAction()
  if (error !== null && error.code === '23503') {
    toast.error('Departamento no eliminado', {
      description:
        'Elimina todos los empleados asignados a este departamento y vuelve a intentarlo.',
    })
    return
  }
  if (error !== null) {
    toast.error('Ocurrió un error. Inténtalo de nuevo.')
    return
  }
  switch (action) {
    case DepartmentsAction.create:
      toast.success('Departamento creado')
      break
    case DepartmentsAction.edit:
      toast.success('Departamento actualizado')
      break
    case DepartmentsAction.delete:
      toast.info('Departamentos eliminados')
      break
  }
}

const Component = ({ loaderData }: Route.ComponentProps) => (
  <SidebarMenu>
    <DepartmentsView departments={loaderData} />
  </SidebarMenu>
)

export default Component

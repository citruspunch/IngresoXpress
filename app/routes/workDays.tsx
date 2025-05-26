import SidebarMenu from '~/components/SidebarMenu'
import { createClient } from '~/lib/supabase/server'
import WorkDaysTableView from '~/features/work_days/views/WorkDaysTableView'
import type { Route } from './+types/workDays'
import { EmptyState } from '~/components/ui/empty-state'
import { ClockPlus, Files, FileText } from 'lucide-react'
import type { Tables } from '~/lib/supabase/types'
import { toast } from 'sonner'

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase } = createClient(request)
  const { data, error } = await supabase.from('work_day').select('*')

  if (error) {
    return []
  }
  if (data.length === 0) {
    return []
  }
  return data
}

export enum WorkDaysAction {
  edit,
  create,
  delete,
}

export type WorkDayFormData =
  | ({
      action: WorkDaysAction.create
    } & Pick<Tables<'work_day'>, 'name' | 'check_in_time' | 'check_out_time' | 'working_days'>)
  | {
      action: WorkDaysAction.delete
      ids: Pick<Tables<'work_day'>, 'id'>['id'][]
    }
  | ({
      action: WorkDaysAction.edit
    } & Pick<Tables<'work_day'>, 'id' | 'name' | 'check_in_time' | 'check_out_time' | 'working_days'>)

export const action = async ({ request }: Route.ActionArgs) => {
  const { supabase } = createClient(request)
  const formData: WorkDayFormData = await request.clone().json()
  const collection = supabase.from('work_day')
  switch (formData.action) {
    case WorkDaysAction.create: {
      const { error } = await collection.insert({ name: formData.name, check_in_time: formData.check_in_time, check_out_time: formData.check_out_time, working_days: formData.working_days })
      console.error(error)
      return { error, action: formData.action }
    }
    case WorkDaysAction.delete: {
      const { error } = await collection.delete().in('id', formData.ids)
      console.error(error)
      return { error, action: formData.action }
    }
    case WorkDaysAction.edit: {
      const { error } = await collection
        .update({ name: formData.name, check_in_time: formData.check_in_time, check_out_time: formData.check_out_time, working_days: formData.working_days })
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
    toast.error('Jornada laboral no eliminada', {
      description:
        'Elimina todos los registros asociados a esta jornada laboral y vuelve a intentarlo.',
    })
    return
  }
  if (error !== null) {
    toast.error('Ocurrió un error. Inténtalo de nuevo.')
    return
  }
  switch (action) {
    case WorkDaysAction.create:
      toast.success('Jornada laboral creada')
      break
    case WorkDaysAction.edit:
      toast.success('Jornada laboral actualizada')
      break
    case WorkDaysAction.delete:
      toast.info('Jornadas laborales eliminadas')
      break
  }
}

const Component = ({ loaderData }: Route.ComponentProps) => (
  <SidebarMenu>
    {loaderData && loaderData.length > 0 ? (
      <WorkDaysTableView workDays={loaderData} />
    ) : (
      <EmptyState
        title="No hay jornadas laborales registradas"
        description="Por favor, crea una jornada laboral para comenzar a registrar entradas y salidas."
        icons={[FileText, ClockPlus, Files]}
        action={{
          label: 'Crear Jornada Laboral',
          onClick: () => {
            //TODO: Implement create work day action
          },
        }}
      />
    )}
  </SidebarMenu>
)

export default Component

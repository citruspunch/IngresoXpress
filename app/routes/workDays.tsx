import SidebarMenu from '~/components/SidebarMenu'
import { createClient } from '~/lib/supabase/server'
import { Separator } from '~/components/ui/separator'
import WorkDaysTableView from '~/features/work_days/views/WorkDaysTableView'
import type { Route } from './+types/workDays'
import { EmptyState } from '~/components/ui/empty-state'
import { ClockPlus, Files, FileText } from 'lucide-react'

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

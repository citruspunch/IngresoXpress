import SidebarMenu from '~/components/sidebarmenu'
import DepartmentsView from '~/features/departments/views/DepartmentsView'
import { createClient } from '~/lib/supabase/server'
import type { Route } from './+types/departments'

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase } = createClient(request)
  const { data } = await supabase.from('department').select('*')
  return data ?? []
}

const Component = ({ loaderData }: Route.ComponentProps) => (
  <SidebarMenu component={<DepartmentsView departments={loaderData} />} />
)

export default Component

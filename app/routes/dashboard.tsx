import { createClient } from '~/lib/supabase/server'
import type { Route } from './+types/dashboard'
import { Dashboard } from '~/dashboard'
import SidebarMenu from '~/components/sidebarmenu'

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase } = createClient(request)
  const { data } = await supabase.from('employee').select('*')
  console.table(data)
}

const Component = () => (
  <SidebarMenu>
    <Dashboard />
  </SidebarMenu>
)

export default Component

import DepartmentsListView from '~/features/departments/views/DepartmentsListView'
import { createClient } from '~/lib/supabase/server'
import type { Route } from './+types/departments'

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase } = createClient(request)
  const { data } = await supabase.from('department').select('*')
  return data ?? []
}

const Component = ({ loaderData }: Route.ComponentProps) => (
  <DepartmentsListView departments={loaderData} />
)

export default Component

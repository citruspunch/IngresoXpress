import { createClient } from '~/lib/supabase/server'
import type { Route } from './+types/dashboard'

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase } = createClient(request)
  const { data } = await supabase.from('employee').select('*')
  console.table(data)
}

const Component = () => <h1>Dashboard</h1>

export default Component

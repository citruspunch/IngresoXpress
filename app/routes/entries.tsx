import { toast } from 'sonner'
import Loader from '~/components/loader'
import EntriesView from '~/features/entries/views/EntriesView'
import { createClient } from '~/lib/supabase/server'
import type { Tables } from '~/lib/supabase/types'
import type { Route } from './+types/entries'

export type Entry = Omit<Tables<'entry'>, 'employee'> & {
  employee: Pick<Tables<'employee'>, 'id' | 'name'>
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase } = createClient(request)
  const result = await supabase.from('entry').select('*, employee(id, name)')
  return result
}

export const clientLoader = async ({
  serverLoader,
}: Route.ClientLoaderArgs) => {
  const { data, error } = await serverLoader()
  if (error !== null) {
    toast.error('Ocurrió un error. Inténtalo de nuevo.')
    return []
  }
  return data as Entry[]
}

export const HydrateFallback = () => <Loader />

clientLoader.hydrate = true as const

export const action = async () => {}

const Component = ({ loaderData }: Route.ComponentProps) => (
  <EntriesView entries={loaderData} />
)

export default Component

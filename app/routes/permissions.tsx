import AttendancePermissionView from "~/features/attendance_permissions/views/AttendancePermissionView";
import type { Route } from "./+types/permissions";
import { createClient } from "~/lib/supabase/server";
import SidebarMenu from "~/components/sidebarmenu";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase } = createClient(request)
  const { data } = await supabase.from('employee').select('*')
  return data ?? []
}
const Component = ({ loaderData } : Route.ComponentProps) => (
    <SidebarMenu component={<AttendancePermissionView employees={loaderData!} />} />
)

export default Component
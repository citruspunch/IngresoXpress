import SidebarMenu from '~/components/SidebarMenu'
import type { Route } from './+types/reports'
import AttendanceReportInput from '~/features/reports/views/AttendanceReportInput'
import { fetchEmployeesWithDepartments } from '~/lib/utils'

export const loader = async ({ request }: Route.LoaderArgs) => {
  return fetchEmployeesWithDepartments(request)
}

const Component = ({ loaderData }: Route.ComponentProps) => (
  <SidebarMenu>
    <AttendanceReportInput employees={loaderData!} />
  </SidebarMenu>
)

export default Component

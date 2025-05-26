import SidebarMenu from '~/components/SidebarMenu'
import type { Route } from './+types/reports'
import AttendanceReportInput from '~/features/reports/views/AttendanceReportInput'
import { fetchEmployeesWithDepartments } from '~/lib/utils'
import { Separator } from '~/components/ui/separator'

export const loader = async ({ request }: Route.LoaderArgs) => {
  return fetchEmployeesWithDepartments(request)
}

const Component = ({ loaderData }: Route.ComponentProps) => (
  <SidebarMenu>
    <h2 className="font-bold text-3xl mb-1">Reportes de Asistencia</h2>
    <Separator className="mb-1" />
    <AttendanceReportInput employees={loaderData!} />
  </SidebarMenu>
)

export default Component

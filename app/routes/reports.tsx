import type { Route } from './+types/reports'
import AttendanceReportInput from '~/features/reports/views/AttendanceReportInput'
import { fetchEmployeesWithDepartments } from '~/lib/utils'
import { Separator } from '~/components/ui/separator'

export const loader = async ({ request }: Route.LoaderArgs) => {
  return fetchEmployeesWithDepartments(request)
}

const Component = ({ loaderData }: Route.ComponentProps) => (
  <div
    className="w-5xl mt-5 mx-auto space-y-8 flex flex-col min-h-full"
  >
    <div className="flex justify-between items-end">
      <h2 className="font-bold text-5xl tracking-tighter">Reportes de Asistencia</h2>
    </div>
    <Separator className="mb-1" />
    <AttendanceReportInput employees={loaderData!} />
  </div>
)

export default Component

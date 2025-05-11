import { Buildings } from '@solar-icons/react/ssr'
import { type ComponentProps } from 'react'
import ModeToggle from '~/components/mode-toggle'
import type { Tables } from '~/lib/supabase/types'
import DepartmentsTableView from './DepartmentsTableView'
import EmptyDepartsmentView from './EmptyDepartmentsView'

type Props = {
  departments: Tables<'department'>[]
}

const DepartmentsView = ({
  departments,
  ...props
}: Props & ComponentProps<'div'>) => (
  <div className="w-3xl mx-auto space-y-8" {...props}>
    <ModeToggle />
    <div className="space-y-4">
      <Buildings size={38} />
      <h2 className="font-bold text-4xl">Departamentos</h2>
    </div>
    <DepartmentsTableView departments={departments} />
    {departments.length === 0 && <EmptyDepartsmentView />}
  </div>
)

export default DepartmentsView

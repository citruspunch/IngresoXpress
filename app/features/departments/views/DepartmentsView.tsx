import { AddCircle, Buildings } from '@solar-icons/react/ssr'
import { type ComponentProps } from 'react'
import { Button } from '~/components/ui/button'
import type { Tables } from '~/lib/supabase/types'
import DepartmentsTableView from './DepartmentsTableView'

type Props = {
  departments: Tables<'department'>[]
}

const DepartmentsView = ({
  departments,
  ...props
}: Props & ComponentProps<'div'>) => (
  <div className="w-3xl mx-auto space-y-8" {...props}>
    <div className="flex justify-between items-end">
      <div className="space-y-4">
        <Buildings size={40} />
        <h2 className="font-bold text-4xl">Departamentos</h2>
      </div>
      <Button variant="outline">
        <AddCircle />
        Añadir
      </Button>
    </div>
    <DepartmentsTableView departments={departments} />
  </div>
)

export default DepartmentsView

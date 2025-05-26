import NumberFlow from '@number-flow/react'
import { AddCircle, UserHands } from '@solar-icons/react/ssr'
import { useEffect, useState, type ComponentProps } from 'react'
import { Button } from '~/components/ui/button'
import type { Tables } from '~/lib/supabase/types'
import EmployeeFormView from './EmployeeFormView'
import EmployeesTableView from './EmployeesTableView'

type Props = {
  employees: Tables<'employee'>[]
  departments: Tables<'department'>[]
  workDays: Tables<'work_day'>[]
}

const EmployeesView = ({
  employees,
  departments,
  workDays,
  ...props
}: Props & ComponentProps<'div'>) => {
  const [employeesCount, setEmployeesCount] = useState(0)

  useEffect(() => {
    setTimeout(() => setEmployeesCount(employees.length), 500)
  }, [employees.length])

  return (
    <div
      className="w-3xl mx-auto space-y-8 flex flex-col min-h-full"
      {...props}
    >
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <UserHands size={40} />
          <h2 className="font-bold text-5xl tracking-tighter flex items-center gap-3">
            Empleados
            <NumberFlow value={employeesCount} prefix="(" suffix=")" />
          </h2>
        </div>
        <EmployeeFormView
          availableDepartments={departments}
          availableWorkDays={workDays}
        >
          <Button variant="outline">
            <AddCircle />
            Añadir
          </Button>
        </EmployeeFormView>
      </div>
      <EmployeesTableView
        employees={employees}
        departments={departments}
        workDays={workDays}
      />
    </div>
  )
}

export default EmployeesView

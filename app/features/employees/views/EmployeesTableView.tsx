import {
  Copy,
  MenuDotsCircle,
  Pen,
  SortVertical,
  TrashBin2,
} from '@solar-icons/react/ssr'
import { type ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useFetcher } from 'react-router'
import { toast } from 'sonner'
import { DataTable } from '~/components/data-table'
import Selector from '~/components/selector'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import type { Tables } from '~/lib/supabase/types'
import {
  EmployeeAction,
  type EmployeeFormData,
  type EmployeeUpdate,
} from '~/routes/employees'
import EmployeeFormView from './EmployeeFormView'

type Props = {
  employees: Tables<'employee'>[]
  departments: Tables<'department'>[]
  workDays: Tables<'work_day'>[]
}

const EmployeesTableView = ({ employees, departments, workDays }: Props) => {
  const fetcher = useFetcher<boolean>({ key: 'employees' })

  const updateEmployeeAttribute = async (
    data: Omit<EmployeeUpdate, 'action'>
  ) => {
    const toastId = toast.loading('Actualizando...', { duration: Infinity })
    await fetcher.submit(
      {
        ...data,
        action: EmployeeAction.edit,
      } satisfies EmployeeFormData,
      { method: 'post', encType: 'application/json' }
    )
    toast.dismiss(toastId)
    // Returned data from action indicates whether the operation was successful
    if (fetcher.data === true) toast.success('Información actualizada.')
    else toast.error('Ocurrió un error. Inténtalo de nuevo.')
  }

  const deleteEmployees = async (indexes: number[]) => {
    const selectedEmployees = employees.filter((_, index) =>
      indexes.includes(index)
    )
    const toastId = toast.loading('Eliminando...', { duration: Infinity })
    await fetcher.submit(
      {
        action: EmployeeAction.delete,
        employees: selectedEmployees,
      } satisfies EmployeeFormData,
      { method: 'post', encType: 'application/json' }
    )
    const wasSuccessful = fetcher.data === true
    if (wasSuccessful) {
      toast.dismiss(toastId)
      toast.info('Empleados eliminados.')
    } else {
      toast.error('Hubo un error al eliminar los empleados seleccionados.')
    }
  }

  const columns = useMemo(
    (): ColumnDef<Tables<'employee'>>[] => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
      },
      {
        accessorKey: 'id',
        header: 'Código',
      },
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            variant="ghost"
            className="p-0 has-[>svg]:px-0"
          >
            Nombre <SortVertical />
          </Button>
        ),
      },
      {
        accessorKey: 'department',
        header: 'Departamento',
        cell: ({ row }) => (
          <Selector
            key={row.original.id}
            values={departments}
            selectedId={row.original.department}
            onSelected={(department) =>
              updateEmployeeAttribute({
                id: row.original.id,
                department: department.id,
              })
            }
            searchText="Busca un departamento..."
          />
        ),
      },
      {
        accessorKey: 'work_day',
        header: 'Jornada',
        cell: ({ row }) => (
          <Selector
            key={row.original.id}
            values={workDays}
            selectedId={row.original.work_day}
            onSelected={(workDay) =>
              updateEmployeeAttribute({
                id: row.original.id,
                work_day: workDay.id,
              })
            }
            searchText="Busca una jornada..."
          />
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const employee = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menú</span>
                  <MenuDotsCircle className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={async () => {
                    await navigator.clipboard.writeText(employee.id)
                    toast.info('Código copiado.')
                  }}
                >
                  <Copy />
                  Copiar código
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <EmployeeFormView
                  employeeToEdit={row.original}
                  availableDepartments={departments}
                  availableWorkDays={workDays}
                >
                  <DropdownMenuItem
                    onSelect={(event) => event.preventDefault()}
                  >
                    <Pen />
                    Editar
                  </DropdownMenuItem>
                </EmployeeFormView>

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => deleteEmployees([row.index])}
                >
                  <TrashBin2 />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [departments, workDays]
  )

  return (
    <DataTable
      data={employees}
      columns={columns}
      columnToFilterBy={{ key: 'name', label: 'Nombre' }}
      key={employees.length}
    >
      {(selectedRowsIndexes) =>
        selectedRowsIndexes.length !== 0 && (
          <Button
            variant="destructive"
            onClick={() => deleteEmployees(selectedRowsIndexes)}
          >
            Eliminar empleados seleccionados
          </Button>
        )
      }
    </DataTable>
  )
}

export default EmployeesTableView

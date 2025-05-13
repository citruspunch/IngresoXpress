import {
  Copy,
  MenuDotsCircle,
  Pen,
  SortVertical,
  TrashBin2,
} from '@solar-icons/react/ssr'
import type { ColumnDef } from '@tanstack/react-table'
import { useFetcher } from 'react-router'
import { toast } from 'sonner'
import { DataTable } from '~/components/data-table'
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
  DepartmentsAction,
  type DepartmentFormData,
} from '~/routes/departments'

const columns: ColumnDef<Tables<'department'>>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    id: 'actions',
    cell: ({ row }) => {
      const department = row.original
      const fetcher = useFetcher()
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
                await navigator.clipboard.writeText(department.id)
                toast.info('Código copiado')
              }}
            >
              <Copy />
              Copiar código
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Pen />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() =>
                fetcher.submit(
                  {
                    action: DepartmentsAction.delete,
                    ids: [row.original.id],
                  } satisfies DepartmentFormData,
                  { method: 'post', encType: 'application/json' }
                )
              }
            >
              <TrashBin2 />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

type Props = {
  departments: Tables<'department'>[]
}

const DepartmentsTableView = ({ departments }: Props) => {
  const fetcher = useFetcher()

  const deleteDepartments = async (indexes: number[]) => {
    const selectedDepartmentsIds = departments
      .filter((_, index) => indexes.includes(index))
      .map((element) => element.id)
    fetcher.submit(
      {
        action: DepartmentsAction.delete,
        ids: selectedDepartmentsIds,
      } satisfies DepartmentFormData,
      { method: 'post', encType: 'application/json' }
    )
  }

  return (
    <DataTable
      data={departments}
      columns={columns}
      columnToFilterBy={{ key: 'name', label: 'Nombre' }}
      key={departments.length}
    >
      {(selectedRowsIndexes) =>
        selectedRowsIndexes.length !== 0 && (
          <Button
            variant="destructive"
            onClick={() => deleteDepartments(selectedRowsIndexes)}
          >
            Eliminar filas seleccionadas
          </Button>
        )
      }
    </DataTable>
  )
}

export default DepartmentsTableView

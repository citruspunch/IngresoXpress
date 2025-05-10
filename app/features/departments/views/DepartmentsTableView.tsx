import {
  Copy,
  MenuDotsCircle,
  Pen,
  SortVertical,
  TrashBin2,
} from '@solar-icons/react/ssr'
import type { ColumnDef } from '@tanstack/react-table'
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
    accessorKey: 'code',
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        variant="ghost"
      >
        Código <SortVertical />
      </Button>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const department = row.original
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
              onClick={() => navigator.clipboard.writeText(department.code)}
            >
              <Copy />
              Copiar código
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Pen />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
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

const DepartmentsTableView = ({ departments }: Props) => (
  <DataTable
    data={departments}
    columns={columns}
    columnToFilterBy={{ key: 'code', label: 'Código' }}
  />
)

export default DepartmentsTableView

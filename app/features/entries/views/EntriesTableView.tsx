import { format, parse } from '@formkit/tempo'
import { SortVertical } from '@solar-icons/react/ssr'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '~/components/data-table'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import type { Entry } from '~/routes/entries'

type Props = { entries: Entry[] }

const columns: ColumnDef<Entry>[] = [
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
    header: 'ID de marca',
  },
  {
    id: 'date',
    accessorKey: 'created_at',
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        variant="ghost"
        className="p-0 has-[>svg]:px-0"
      >
        Fecha de marca <SortVertical />
      </Button>
    ),
    cell: ({ row }) => format(parse(row.original.created_at), 'long', 'es'),
  },
  {
    id: 'hour',
    accessorKey: 'created_at',
    header: 'Hora de marca',

    cell: ({ row }) => parse(row.original.created_at).toLocaleTimeString(),
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row }) =>
      ({ 'check in': 'Entrada', 'check out': 'Salida' }[row.original.type] ||
      ''),
  },
  {
    accessorKey: 'employee.id',
    header: 'ID del empleado',
  },
  {
    id: 'employee.name',
    accessorKey: 'employee.name',
    header: 'Nombre del empleado',
  },
]

const EntriesTableView = ({ entries }: Props) => (
  <DataTable
    key={entries.length}
    data={entries}
    columns={columns}
    columnToFilterBy={{ key: 'employee.name', label: 'Empleado' }}
  ></DataTable>
)

export default EntriesTableView

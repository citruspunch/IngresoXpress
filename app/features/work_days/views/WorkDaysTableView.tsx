import {
  AddCircle,
  Copy,
  MenuDotsCircle,
  Pen,
  SortVertical,
  TrashBin2,
} from '@solar-icons/react/ssr'
import type { ColumnDef } from '@tanstack/react-table'
import { Clock } from 'lucide-react'
import type { ComponentProps } from 'react'
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
import { getWorkingDaysInSpanish } from '~/lib/utils'
import { WorkDaysAction, type WorkDayFormData } from '~/routes/workDays'
import WorkDayFormView from './WorkDayFormView'

const columns: ColumnDef<Tables<'work_day'>>[] = [
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
        Nombre de la Jornada <SortVertical />
      </Button>
    ),
  },
  {
    accessorKey: 'check_in_time',
    header: 'Hora de Entrada',
    cell: ({ row }) => {
      const checkInTime = row.getValue('check_in_time') as string
      return checkInTime.split('-')[0]
    },
  },
  {
    accessorKey: 'check_out_time',
    header: 'Hora de Salida',
    cell: ({ row }) => {
      const checkOutTime = row.getValue('check_out_time') as string
      return checkOutTime.split('-')[0]
    },
  },
  {
    accessorKey: 'working_days',
    header: 'Días Laborales',
    cell: ({ row }) => {
      const workingDays = row.getValue('working_days') as string[]
      return getWorkingDaysInSpanish(workingDays).join(', ')
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const work_day = row.original
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
                await navigator.clipboard.writeText(work_day.id)
                toast.info('Código copiado')
              }}
            >
              <Copy />
              Copiar código
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <WorkDayFormView workDayToEdit={work_day}>
              <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                <Pen />
                Editar
              </DropdownMenuItem>
            </WorkDayFormView>
            <DropdownMenuItem
              variant="destructive"
              onClick={() =>
                fetcher.submit(
                  {
                    action: WorkDaysAction.delete,
                    ids: [row.original.id],
                  } satisfies WorkDayFormData,
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
  workDays: Tables<'work_day'>[]
}

const WorkDaysTableView = ({
  workDays,
  ...props
}: Props & ComponentProps<'div'>) => {
  const fetcher = useFetcher()

  const deleteWorkDays = async (indexes: number[]) => {
    const selectedWorkDaysIds = workDays
      .filter((_, index) => indexes.includes(index))
      .map((element) => element.id)
    fetcher.submit(
      {
        action: WorkDaysAction.delete,
        ids: selectedWorkDaysIds,
      } satisfies WorkDayFormData,
      { method: 'post', encType: 'application/json' }
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8" {...props}>
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <Clock size={40} />
          <h2 className="font-bold text-5xl tracking-tighter">Jornadas Laborales</h2>
        </div>
        <WorkDayFormView>
          <Button variant="outline">
            <AddCircle />
            Añadir
          </Button>
        </WorkDayFormView>
      </div>
      <DataTable
        data={workDays}
        columns={columns}
        columnToFilterBy={{ key: 'name', label: 'Nombre' }}
        key={workDays.length}
      >
        {(selectedRowsIndexes) =>
          selectedRowsIndexes.length !== 0 && (
            <Button
              variant="destructive"
              onClick={() => deleteWorkDays(selectedRowsIndexes)}
            >
              Eliminar filas seleccionadas
            </Button>
          )
        }
      </DataTable>
    </div>
  )
}

export default WorkDaysTableView

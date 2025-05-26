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
import { DataTable } from '~/components/data-table'
import { Button } from '~/components/ui/button'
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

const columns: ColumnDef<Tables<'work_day'>>[] = [
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
              onClick={() => navigator.clipboard.writeText(work_day.id)}
            >
              <Copy />
              Copiar código
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Pen />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => {}}>
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

  return (
    <div className="max-w-5xl mx-auto space-y-8" {...props}>
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <Clock size={40} />
          <h2 className="font-bold text-4xl">Jornadas Laborales</h2>
        </div>
        <Button variant="outline">
          <AddCircle />
          Añadir
        </Button>
      </div>
      <DataTable
        data={workDays}
        columns={columns}
        columnToFilterBy={{ key: 'name', label: 'Nombre' }}
      />
    </div>
  )
}

export default WorkDaysTableView

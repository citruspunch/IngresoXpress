import { type ComponentProps } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import type { Tables } from '~/lib/supabase/types'

type Props = {
  departments: Tables<'department'>[]
}

const DepartmentsListView = ({
  departments,
  ...props
}: Props & ComponentProps<typeof Table>) => (
  <Table {...props}>
    <TableHeader>
      <TableRow>
        <TableHead>Código</TableHead>
        <TableHead>Nombre</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {departments.map((department) => (
        <TableRow key={department.id}>
          <TableCell className="font-medium">{department.code}</TableCell>
          <TableCell>{department.name}</TableCell>
        </TableRow>
      ))}
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell colSpan={3}>Total</TableCell>
        <TableCell className="text-right">{departments.length}</TableCell>
      </TableRow>
    </TableFooter>
  </Table>
)

export default DepartmentsListView

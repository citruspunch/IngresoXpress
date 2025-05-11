import type { ComponentProps } from 'react'
import { Separator } from '~/components/ui/separator'
import type { Table } from '~/components/ui/table'
import type { Tables } from '~/lib/supabase/types'
import AttendancePermissionForm from './AttendancePermissionForm'

export type AttendancePermissionViewProps = {
  employees: Record<string, Tables<'employee'>[]>
}

const AttendancePermissionView = ({
  employees,
  ...props
}: AttendancePermissionViewProps & ComponentProps<typeof Table>) => {
  return (
    <>
      <h2 className="font-bold text-3xl mb-1">Otorgar permisos</h2>
      <Separator className="mb-8" />
      <AttendancePermissionForm employees={employees} />
    </>
  )
}

export default AttendancePermissionView

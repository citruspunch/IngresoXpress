import { Separator } from '@radix-ui/react-separator'
import type { ComponentProps } from 'react'
import SidebarMenu from '~/components/sidebarmenu'
import type { Table } from '~/components/ui/table'
import type { Tables } from '~/lib/supabase/types'

type AttendancePermissionViewProps = {
  employees: Tables<'employee'>[]
}

const AttendancePermissionView = ({
  employees,
  ...props
}: AttendancePermissionViewProps & ComponentProps<typeof Table>) => {
  return (
    <>
      <h2 className="font-bold text-3xl mb-1">Otorgar permisos</h2>
      <Separator className="mb-8" />
    </>
  )
}

export default AttendancePermissionView

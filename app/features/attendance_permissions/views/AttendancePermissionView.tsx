import type { ComponentProps } from 'react'
import { Separator } from '~/components/ui/separator'
import type { Table } from '~/components/ui/table'
import type { Tables } from '~/lib/supabase/types'
import AttendancePermissionForm from './AttendancePermissionForm'
import { Accessibility } from '@solar-icons/react/ssr'

export type AttendancePermissionViewProps = {
  employees: Record<string, Tables<'employee'>[]>
}

const AttendancePermissionView = ({
  employees,
  ...props
}: AttendancePermissionViewProps & ComponentProps<typeof Table>) => {
  return (
    <div
      className="w-5xl mt-5 mx-auto space-y-8 flex flex-col min-h-full"
      {...props}
    >
      <div className="flex justify-between items-end">
          <h2 className="font-bold text-5xl tracking-tighter">
            Otorgar Permisos
          </h2>
      </div>
      <Separator className="mb-1" />

      <AttendancePermissionForm employees={employees} />
    </div>
  )
}

export default AttendancePermissionView

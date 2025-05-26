import { zodResolver } from '@hookform/resolvers/zod'
import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { useFetcher } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import Loader from '~/components/loader'
import Selector from '~/components/selector'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import type { Tables } from '~/lib/supabase/types'
import { EmployeeAction, type EmployeeFormData } from '~/routes/employees'

const formSchema = z.object({
  name: z
    .string({ required_error: 'Añade un nombre válido' })
    .trim()
    .min(2, 'Añade un nombre válido'),
  department: z
    .string({ required_error: 'Asigna un departamento a este empleado' })
    .trim(),
  workDay: z
    .string({ required_error: 'Asigna una jornada a este empleado' })
    .trim(),
})

type Props = {
  children: ReactNode
  employeeToEdit?: Tables<'employee'>
  availableDepartments: Tables<'department'>[]
  availableWorkDays: Tables<'work_day'>[]
}

const EmployeeFormView = ({
  children,
  employeeToEdit,
  availableDepartments,
  availableWorkDays,
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: employeeToEdit?.name,
      department: employeeToEdit?.department,
      workDay: employeeToEdit?.work_day,
    },
  })

  const fetcher = useFetcher<boolean>({ key: 'employees' })

  const [open, setOpen] = useState(false)

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const toastId = toast.loading(
      employeeToEdit !== null ? 'Actualizando...' : 'Creando',
      { duration: Infinity }
    )
    await fetcher.submit(
      (employeeToEdit
        ? {
            action: EmployeeAction.edit,
            id: employeeToEdit.id,
            name: values.name,
            department: values.department,
            work_day: values.workDay,
          }
        : {
            action: EmployeeAction.create,
            name: values.name,
            department: values.department,
            work_day: values.workDay,
          }) satisfies EmployeeFormData,
      {
        method: 'post',
        encType: 'application/json',
        action: '/employees',
      }
    )
    toast.dismiss(toastId)
    const wasSuccessful = fetcher.data === true
    if (wasSuccessful) {
      form.reset()
      toast.success(
        employeeToEdit !== null ? 'Actualización hecha.' : 'Empleado añadido.'
      )
      setOpen(false)
    } else {
      toast.error(
        employeeToEdit !== null
          ? 'Ocurrió un error al hacer la actualización.'
          : 'No fue posible agregar el empleado.'
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {employeeToEdit ? 'Actualizar' : 'Añadir'} empleado
          </DialogTitle>
          <DialogDescription>
            {employeeToEdit
              ? 'Actualiza la información del empleado.'
              : 'Añade toda la información del nuevo empleado. El código se generará automáticamente.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5 flex flex-col items-stretch"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej.: John Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento</FormLabel>
                  <FormControl>
                    <Selector
                      searchText="Busca un departamento..."
                      selectedId={field.value}
                      values={availableDepartments}
                      onSelected={(department) =>
                        form.setValue('department', department.id)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jornada</FormLabel>
                  <FormControl>
                    <Selector
                      searchText="Busca una jornada..."
                      selectedId={field.value}
                      values={availableWorkDays}
                      onSelected={(workDay) =>
                        form.setValue('workDay', workDay.id)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={fetcher.state !== 'idle'}>
              {fetcher.state !== 'idle' && <Loader />}
              {fetcher.state !== 'idle'
                ? employeeToEdit
                  ? 'Actualizando'
                  : 'Creando'
                : employeeToEdit
                ? 'Actualizar'
                : 'Crear'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EmployeeFormView

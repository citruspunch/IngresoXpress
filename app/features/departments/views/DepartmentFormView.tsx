import { zodResolver } from '@hookform/resolvers/zod'
import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { useFetcher } from 'react-router'
import { z } from 'zod'
import Loader from '~/components/loader'
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
import {
  DepartmentsAction,
  type DepartmentFormData,
} from '~/routes/departments'

const formSchema = z.object({
  name: z
    .string({ required_error: 'Añade un nombre válido' })
    .trim()
    .min(2, 'Añade un nombre válido'),
})

type Props = {
  children: ReactNode
  departmentToEdit?: Tables<'department'>
}

const DepartmentFormView = ({ children, departmentToEdit }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: departmentToEdit?.name,
    },
  })

  const fetcher = useFetcher()

  const [open, setOpen] = useState(false)

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await fetcher.submit(
      departmentToEdit
        ? ({
            action: DepartmentsAction.edit,
            id: departmentToEdit.id,
            name: values.name,
          } satisfies DepartmentFormData)
        : ({
            action: DepartmentsAction.create,
            name: values.name,
          } satisfies DepartmentFormData),
      {
        method: 'post',
        encType: 'application/json',
      }
    )
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir departamento</DialogTitle>
          <DialogDescription>
            Ingresa el nombre del nuevo departamento. El código se generará
            automáticamente.
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
                    <Input {...field} placeholder="Ej.: Recursos humanos" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={fetcher.state !== 'idle'}>
              {fetcher.state !== 'idle' && <Loader />}
              {fetcher.state !== 'idle' ? 'Creando' : 'Crear'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default DepartmentFormView

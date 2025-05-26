import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState, type ReactNode } from 'react'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import type { Tables } from '~/lib/supabase/types'
import workDayFormSchema from '../schemas/WorkDayFormSchema'
import { WorkDaysAction, type WorkDayFormData } from '~/routes/workDays'

import { Checkbox } from '~/components/ui/checkbox'
import { days, formatTime, formatToTimetz } from '~/lib/utils'

type Props = {
  children: ReactNode
  workDayToEdit?: Tables<'work_day'>
}

const WorkDayFormView = ({ children, workDayToEdit }: Props) => {
  const form = useForm<z.infer<typeof workDayFormSchema>>({
    resolver: zodResolver(workDayFormSchema),
    defaultValues: {
      name: workDayToEdit?.name || '',
      check_in_time: workDayToEdit ? formatTime(workDayToEdit?.check_in_time) : '',
      check_out_time: workDayToEdit ? formatTime(workDayToEdit?.check_out_time) : '',
      working_days: workDayToEdit?.working_days || [],
    },
  })
  
  const fetcher = useFetcher()

  const [open, setOpen] = useState(false)
  
  const handleSubmit = async (values: z.infer<typeof workDayFormSchema>) => {
    await fetcher.submit(
      workDayToEdit
        ? ({
            action: WorkDaysAction.edit,
            id: workDayToEdit.id,
            name: values.name,
            check_in_time: formatToTimetz(values.check_in_time),
            check_out_time: formatToTimetz(values.check_out_time),
            working_days: values.working_days as Pick<
              Tables<'work_day'>,
              'working_days'
            >['working_days'],
          } satisfies WorkDayFormData)
        : ({
            action: WorkDaysAction.create,
            name: values.name,
            check_in_time: formatToTimetz(values.check_in_time),
            check_out_time: formatToTimetz(values.check_out_time),
            working_days: values.working_days as Pick<
              Tables<'work_day'>,
              'working_days'
            >['working_days'],
          } satisfies WorkDayFormData),
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
          <DialogTitle>
            {workDayToEdit ? 'Actualizar' : 'Añadir'} jornada laboral
          </DialogTitle>
          <DialogDescription>
            {workDayToEdit
              ? 'Cambia el nombre, la hora de entrada, la hora de salida o los días laborales de la jornada laboral al nuevo valor.'
              : 'Ingresa los datos correspondientes de la nueva jornada laboral. El código se generará automáticamente.'}
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
                    <Input {...field} placeholder="Ej.: Matutina" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="check_in_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora de entrada</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" placeholder="Ej.: 08:00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="check_out_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora de salida</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" placeholder="Ej.: 17:00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="working_days"
              render={() => (
                <FormItem>
                  <div className="mb-1">
                    <FormLabel>Días laborales</FormLabel>
                    <FormDescription>
                      Selecciona los días laborales de la jornada laboral.
                    </FormDescription>
                  </div>
                  {days.map((day) => (
                    <FormField
                      key={day.id}
                      control={form.control}
                      name="working_days"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={day.id}
                            className="flex flex-row items-start space-x-2 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(day.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, day.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== day.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {day.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-2" disabled={fetcher.state !== 'idle'}>
              {fetcher.state !== 'idle' && <Loader />}
              {fetcher.state !== 'idle'
                ? workDayToEdit
                  ? 'Actualizando'
                  : 'Creando'
                : workDayToEdit
                ? 'Actualizar'
                : 'Crear'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default WorkDayFormView

'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { format } from '@formkit/tempo'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import attendanceFormSchema from '../schemas/AttendanceSchema'
import { PassType } from '~/lib/passTypes'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Calendar } from '~/components/ui/calendar'
import { es } from 'react-day-picker/locale'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import type { AttendancePermissionViewProps } from './AttendancePermissionView'

const Square = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => (
  <span
    data-square
    className={cn(
      'flex size-5 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground',
      className
    )}
    aria-hidden="true"
  >
    {children}
  </span>
)

const AttendancePermissionForm = ({
  employees,
}: AttendancePermissionViewProps) => {
  const form = useForm<z.infer<typeof attendanceFormSchema>>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      employee_id: '',
      date: new Date(),
      reason: '',
      type: undefined,
    },
  })

  const colors = [
    { bg: 'bg-indigo-400/20', text: 'text-indigo-500' },
    { bg: 'bg-purple-400/20', text: 'text-purple-500' },
    { bg: 'bg-rose-400/20', text: 'text-rose-500' },
    { bg: 'bg-green-400/20', text: 'text-green-500' },
    { bg: 'bg-yellow-400/20', text: 'text-yellow-500' },
  ]

  async function onSubmit(values: z.infer<typeof attendanceFormSchema>) {
    try {
      console.log(values)
      toast.success('El permiso fue registrado correctamente')
    } catch (error) {
      console.error('Error submitting contact form', error)
      toast.error('Error registrando el permiso. Intenta nuevamente')
    }
  }

  return (
    <div className="flex min-h-[60vh] h-full w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-md w-[500px]">
        <CardHeader>
          <CardTitle className="text-3xl">Permisos Laborales</CardTitle>
          <CardDescription>
            Completa el formulario para otorgar permisos de llegada tarde,
            salida temprano o ausencia justificada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
              <div className="grid gap-4">
                {/* Employee ID Field */}
                <FormField
                  control={form.control}
                  name="employee_id"
                  render={({ field }) => (
                    <FormItem className="grid gap-2 w-full">
                      <FormLabel htmlFor="name">Nombre del Empleado</FormLabel>
                      {!employees && (
                        <Input disabled placeholder="No hay empleados" />
                      )}
                      {employees && (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-[280px]">
                              <SelectValue placeholder="Selecciona a un empleado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(employees).map(
                              ([department, employeeList]) => (
                                <SelectGroup key={department}>
                                  <SelectLabel>{department}</SelectLabel>
                                  {employeeList.map((employee, index) => {
                                    const color = colors[index % colors.length]
                                    return (
                                      <SelectItem
                                        value={employee.id}
                                        key={employee.id}
                                      >
                                        <Square
                                          className={`${color.bg} ${color.text}`}
                                        >
                                          {employee.name[0].toUpperCase()}
                                        </Square>
                                        <span className="truncate">
                                          {employee.name}
                                        </span>
                                      </SelectItem>
                                    )
                                  })}
                                </SelectGroup>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />


                {/* Date Field */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'pl-3 text-left font-normal w-[280px]',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'long', 'es')
                              ) : (
                                <span>Selecciona una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date('1900-01-01')}
                            autoFocus
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                      {/* <FormDescription>
                        Selecciona la fecha en la que se le otorgará <br/> el permiso
                        al empleado
                      </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Permiso</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-[280px]'>
                            <SelectValue placeholder="Selecciona el tipo de permiso" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={PassType.Absence}>
                            Ausencia
                          </SelectItem>
                          <SelectItem value={PassType.Early}>
                            Salida Temprana
                          </SelectItem>
                          <SelectItem value={PassType.Late}>
                            Llegada Tarde
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Message Field */}
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="motivo">Motivo</FormLabel>
                      <FormControl>
                        <Textarea
                          id="motivo"
                          placeholder="Escribe el motivo del permiso"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Otorgar Permiso
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AttendancePermissionForm

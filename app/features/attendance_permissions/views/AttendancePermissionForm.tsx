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
import {
  BookX,
  CalendarIcon,
  Check,
  ChevronsUpDown,
  ClockArrowDown,
  ClockArrowUp,
} from 'lucide-react'
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '~/components/ui/command'
import React from 'react'
import { appRoute } from '~/routes'
import { useFetcher, useNavigate } from 'react-router'
import type { Tables } from '~/lib/supabase/types'

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

  const fetcher = useFetcher()

  type FetcherData = {
    employee: string
    date: string
    reason: string
    type: 'absence' | 'late check in' | 'early check out'
  }

  const onSubmit = async (values: z.infer<typeof attendanceFormSchema>) => {
    fetcher.submit(
      {
        employee: values.employee_id,
        date: values.date.toISOString(),
        reason: values.reason,
        type: values.type,
      } satisfies FetcherData,
      {
        method: 'post',
        action: appRoute.permissions,
      }
    )
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
                      <FormLabel htmlFor="employee">
                        Nombre del Empleado
                      </FormLabel>
                      {!employees && (
                        <Input disabled placeholder="No hay empleados" />
                      )}
                      {employees && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={field.value ? true : false}
                                className="w-[280px] justify-between"
                              >
                                {field.value
                                  ? Object.values(employees)
                                      .flat()
                                      .find(
                                        (employee) =>
                                          employee.id === field.value
                                      )!.name
                                  : 'Selecciona un empleado'}
                                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[280px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Buscar empleado..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>
                                  No se encontró ningún empleado.
                                </CommandEmpty>
                                {Object.entries(employees).map(
                                  ([department, employeeList]) => (
                                    <React.Fragment key={department}>
                                      <CommandGroup
                                        key={department}
                                        heading={department}
                                      >
                                        {employeeList.map((employee) => (
                                          <CommandItem
                                            key={employee.id}
                                            value={employee.name}
                                            onSelect={() =>
                                              field.onChange(employee.id)
                                            }
                                          >
                                            <Square
                                              className={`${
                                                colors[
                                                  employeeList.indexOf(
                                                    employee
                                                  ) % colors.length
                                                ].bg
                                              } ${
                                                colors[
                                                  employeeList.indexOf(
                                                    employee
                                                  ) % colors.length
                                                ].text
                                              }`}
                                            >
                                              {employee.name[0].toUpperCase()}
                                            </Square>
                                            <span className="truncate">
                                              {employee.name}
                                            </span>
                                            <Check
                                              className={cn(
                                                'ml-auto h-4 w-4',
                                                field.value === employee.id
                                                  ? 'opacity-100'
                                                  : 'opacity-0'
                                              )}
                                            />
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                      <CommandSeparator />
                                    </React.Fragment>
                                  )
                                )}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
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
                          <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Selecciona el tipo de permiso" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={PassType.Absence}>
                            <div className="flex items-center gap-2">
                              <BookX className="h-4 w-4 text-muted-foreground" />
                              Ausencia
                            </div>
                          </SelectItem>
                          <SelectItem value={PassType.Early}>
                            <div className="flex items-center gap-2">
                              <ClockArrowUp className="h-4 w-4 text-muted-foreground" />
                              Salida Temprana
                            </div>
                          </SelectItem>
                          <SelectItem value={PassType.Late}>
                            <div className="flex items-center gap-2">
                              <ClockArrowDown className="h-4 w-4 text-muted-foreground" />
                              Llegada Tarde
                            </div>
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

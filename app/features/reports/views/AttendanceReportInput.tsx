import { PopoverTrigger } from '@radix-ui/react-popover'
import { es } from 'date-fns/locale'
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '~/components/ui/command'
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
import { Popover, PopoverContent } from '~/components/ui/popover'
import { cn } from '~/lib/utils'
import reportInputFormSchema from '../schemas/ReportInputSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { format } from '@formkit/tempo'
import type { AttendancePermissionViewProps } from '~/features/attendance_permissions/views/AttendancePermissionView'
import Loader from '~/components/loader'
import Square, { colors } from '~/components/Square'
import { appRoute } from '~/routes'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

const AttendanceReportInput = ({
  employees,
}: AttendancePermissionViewProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof reportInputFormSchema>>({
    resolver: zodResolver(reportInputFormSchema),
    defaultValues: {
      employee_id: '',
      date_range: {
        from: undefined,
        to: undefined,
      },
    },
  })

  const onSubmit = async (values: z.infer<typeof reportInputFormSchema>) => {
    setIsLoading(true)
    await navigate(
      `${appRoute.reports}/${values.employee_id}/${JSON.stringify(
        values.date_range
      )}`
    )
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-[60vh] h-full w-full items-center justify-center mb-20 px-4">
      <Card className="mx-auto max-w-md w-[500px]">
        <CardHeader>
          <CardTitle className="text-3xl">Generar Reporte</CardTitle>
          <CardDescription>
            Genera un reporte de entradas y salidas de un empleado en un rango
            de fechas.
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
                                            <span>
                                              {employee.name} ({employee.id.substring(0, 6)})
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
                  name="date_range"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              id="date"
                              variant={'outline'}
                              className={cn(
                                'pl-3 text-left font-normal w-[280px]',
                                !field.value.from && 'text-muted-foreground'
                              )}
                            >
                              {field.value.from ? (
                                field.value.to ? (
                                  <>
                                    {format(field.value.from, 'medium', 'es')} -{' '}
                                    {format(field.value.to, 'medium', 'es')}
                                  </>
                                ) : (
                                  format(field.value.from, 'long', 'es')
                                )
                              ) : (
                                <span>Selecciona un intervalo de fechas</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            defaultMonth={field.value.from}
                            selected={{
                              from: field.value.from!,
                              to: field.value.to,
                            }}
                            onSelect={field.onChange}
                            autoFocus
                            numberOfMonths={1}
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Selecciona el intervalo de fechas en las que quieres
                        generar el reporte.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader /> : 'Generar Reporte'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AttendanceReportInput

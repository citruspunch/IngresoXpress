import { z } from 'zod'

const workDayFormSchema = z
  .object({
    name: z
      .string({ required_error: 'Añade un nombre válido' })
      .trim()
      .min(2, 'Añade un nombre válido'),
    check_in_time: z
      .string({
        required_error: 'Añade una hora de entrada válida',
      })
      .min(5, 'La hora de entrada debe tener al menos 5 caracteres'),
    check_out_time: z
      .string({
        required_error: 'Añade una hora de salida válida',
      })
      .min(5, 'La hora de salida debe tener al menos 5 caracteres'),
    working_days: z
      .array(z.string())
      .min(1, 'Selecciona al menos un día laboral'),
  })
  .refine(
    (data) => {
      // Validar que check_in_time < check_out_time
      const [checkInHours, checkInMinutes] = data.check_in_time
        .split(':')
        .map((value) => Number(value))
      const [checkOutHours, checkOutMinutes] = data.check_out_time
        .split(':')
        .map((value) => Number(value))

      // Convertir las horas y minutos a minutos totales para comparar
      const checkInTotalMinutes = checkInHours * 60 + checkInMinutes
      const checkOutTotalMinutes = checkOutHours * 60 + checkOutMinutes

      return checkInTotalMinutes < checkOutTotalMinutes // Validar que la hora de entrada sea menor
    },
    {
      message: 'La hora de entrada debe ser menor que la hora de salida',
      path: ['check_in_time'], // Asociar el error al campo check_in_time
    }
  )
export default workDayFormSchema

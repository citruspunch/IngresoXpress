import { z } from 'zod'
import { PassType } from '~/lib/passTypes'

const attendanceFormSchema = z.object({
  employee_id: z.string({
    required_error: 'Selecciona un empleado.',
  }),
  date: z.date({
    required_error:
      'Es necesaria la fecha en la que se va a otorgar el permiso.',
  }),
  reason: z
    .string()
    .min(10, { message: 'Debe contener al menos 10 caracteres' }),
  type: z.nativeEnum(PassType, {
    required_error: 'Selecciona el tipo de permiso.',
  }),
})

export default attendanceFormSchema

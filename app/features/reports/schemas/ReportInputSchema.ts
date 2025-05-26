import { z } from 'zod'

const DATE_REQUIRED_ERROR = "Es necesario el intervalo de fechas para el reporte.";

const reportInputFormSchema = z.object({
  employee_id: z.string({
    required_error: 'Selecciona un empleado.',
  }),
  date_range: z.object({
        from: z.date().optional(),
        to: z.date().optional(),
    }, {required_error: DATE_REQUIRED_ERROR}).refine((date) => {
        return !!date.from;
    }, DATE_REQUIRED_ERROR),

})

export default reportInputFormSchema

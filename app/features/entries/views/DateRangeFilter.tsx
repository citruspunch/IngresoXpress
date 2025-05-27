import { format } from '@formkit/tempo'
import { es } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { cn } from '~/lib/utils'

type Props = {
  startDate: Date | undefined
  endDate: Date | undefined
  setStartDate: (value: Date | undefined) => void
  setEndDate: (value: Date | undefined) => void
}

const DateRangeFilter = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={'outline'}
          className={cn('pl-3 text-left font-normal')}
        >
          {startDate ? (
            endDate ? (
              <>
                {format(startDate, 'medium', 'es')} -{' '}
                {format(endDate, 'medium', 'es')}
              </>
            ) : (
              format(startDate, 'long', 'es')
            )
          ) : (
            <span>Filtra un intervalo de fechas</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={new Date()}
          selected={{
            from: startDate,
            to: endDate,
          }}
          onSelect={(value) => {
            setStartDate(value?.from)
            setEndDate(value?.to)
          }}
          autoFocus
          numberOfMonths={1}
          locale={es}
        />
      </PopoverContent>
    </Popover>
  )
}

export default DateRangeFilter

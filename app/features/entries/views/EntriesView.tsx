import { parse } from '@formkit/tempo'
import NumberFlow from '@number-flow/react'
import { ClockFading } from 'lucide-react'
import { useEffect, useState, type ComponentProps } from 'react'
import { useFetcher } from 'react-router'
import { Button } from '~/components/ui/button'
import { createClient } from '~/lib/supabase/client'
import type { Entry } from '~/routes/entries'
import DateRangeFilter from './DateRangeFilter'
import EntriesTableView from './EntriesTableView'

type Props = { entries: Entry[] } & ComponentProps<'div'>

const EntriesView = ({ entries, ...props }: Props) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>([])

  const fetcher = useFetcher()

  useEffect(() => {
    const channel = createClient()
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'entry' },
        (_) => fetcher.submit({}, { method: 'post' })
      )
      .subscribe()
    return () => {
      channel.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (startDate === undefined || endDate === undefined) {
      setFilteredEntries(entries)
      return
    }
    const _entries = entries.filter((value) => {
      const entryDate = parse(value.created_at)
      return (
        entryDate.getTime() >= startDate!.getTime() &&
        entryDate.getTime() <= endDate!.getTime()
      )
    })
    _entries.forEach(console.log)
    setFilteredEntries(_entries)
  }, [startDate, endDate])

  return (
    <div
      className="w-5xl mx-auto space-y-8 flex flex-col min-h-full"
      {...props}
    >
      <div className="flex justify-between items-end">
        <div className="space-y-4 w-full">
          <ClockFading size={40} />
          <div className="flex justify-between items-end">
            <h2 className="font-bold text-5xl tracking-tighter flex items-center gap-3">
              Entradas y Salidas
              <NumberFlow
                value={filteredEntries.length}
                prefix="("
                suffix=")"
              />
            </h2>
            <div className="flex gap-3">
              {startDate !== undefined && endDate !== undefined && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setStartDate(undefined)
                    setEndDate(undefined)
                  }}
                >
                  Limpiar filtro
                </Button>
              )}
              <DateRangeFilter
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
              />
            </div>
          </div>
        </div>
      </div>
      <EntriesTableView entries={filteredEntries} />
    </div>
  )
}

export default EntriesView

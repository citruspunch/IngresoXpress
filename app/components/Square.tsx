import { cn } from "~/lib/utils"

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

export const colors = [
  { bg: 'bg-indigo-400/20', text: 'text-indigo-500' },
  { bg: 'bg-purple-400/20', text: 'text-purple-500' },
  { bg: 'bg-rose-400/20', text: 'text-rose-500' },
  { bg: 'bg-green-400/20', text: 'text-green-500' },
  { bg: 'bg-yellow-400/20', text: 'text-yellow-500' },
]

export default Square

import { Theme, useTheme } from 'remix-themes'

import { Moon, Sun2 } from '@solar-icons/react/ssr'
import { Button } from './ui/button'

const ModeToggle = () => {
  const [, setTheme] = useTheme()

  return (
    <Button 
      variant="ghost"
      size="sm"
      onClick={() => setTheme((prev) => (prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT))}
    >
      <Sun2 className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}

export default ModeToggle

import { Theme, useTheme } from 'remix-themes'

import { Moon, Sun2 } from '@solar-icons/react/ssr'
import { Button } from './ui/button'

const ModeToggle = () => {
  const [, setTheme] = useTheme()

  return (
    <Button 
      variant="ghost"
      size="lg"
      onClick={() => setTheme((prev) => (prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT))}
      className='has-[>svg]:py-0 has-[>svg]:px-1.5'
    >
      <Sun2 className="rotate-0 w-[1.5rem] h-[1.5rem] scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute w-[1.5rem] h-[1.5rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}

export default ModeToggle
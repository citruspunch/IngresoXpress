import { Buildings } from '@solar-icons/react/ssr'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'

const EmptyDepartsmentView = () => (
  <Alert>
    <Buildings className="h-4 w-4" />
    <AlertTitle>Aún no hay departamentos creados</AlertTitle>
    <AlertDescription>
      Añade un departamento haciendo click aquí.
    </AlertDescription>
  </Alert>
)

export default EmptyDepartsmentView

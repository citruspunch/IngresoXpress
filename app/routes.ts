import { type RouteConfig, route } from '@react-router/dev/routes'

export const appRoute = {
  dashboard: '/dashboard',
}

export default [
  route(appRoute.dashboard, 'routes/dashboard.tsx'),
] satisfies RouteConfig

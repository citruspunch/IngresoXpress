import { type RouteConfig, route } from '@react-router/dev/routes'

export const appRoute = {
  dashboard: '/dashboard',
  departments: '/departments',
}

export default [
  route(appRoute.dashboard, 'routes/dashboard.tsx'),
  route(appRoute.departments, 'routes/departments.tsx'),
] satisfies RouteConfig

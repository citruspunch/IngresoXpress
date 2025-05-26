import { type RouteConfig, route } from '@react-router/dev/routes'

export const appRoute = {
  dashboard: '/dashboard',
  departments: '/departments',
  permissions: '/permissions',
}

export default [
  route(appRoute.dashboard, 'routes/dashboard.tsx'),
  route(appRoute.departments, 'routes/departments.tsx'),
  route(appRoute.permissions, 'routes/permissions.tsx'),
] satisfies RouteConfig

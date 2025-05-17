import { type RouteConfig, route } from '@react-router/dev/routes'

export const appRoute = {
  dashboard: '/dashboard',
  departments: '/departments',
  permissions: '/permissions',
  reports: '/reports',
}

export default [
  route(appRoute.dashboard, 'routes/dashboard.tsx'),
  route(appRoute.departments, 'routes/departments.tsx'),
  route(appRoute.permissions, 'routes/permissions.tsx'),
  route(appRoute.reports, 'routes/reports.tsx'),
  route(`${appRoute.reports}/:employee_id/:date_range`, 'routes/employeeReportView.tsx'),
] satisfies RouteConfig

'use client'
import { useState } from 'react'
import {
  BookText,
  CalendarClock,
  LayoutDashboard,
  UserRoundCheck,
  UsersRound,
} from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '~/lib/utils'
import { Sidebar, SidebarBody, SidebarItem, SidebarLink } from './ui/sidebar'
import { appRoute } from '~/routes'

export function SidebarMenu({ children }: { children: React.ReactNode }) {
  const links = [
    {
      label: 'Dashboard',
      href: appRoute.dashboard,
      icon: (
        <LayoutDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: 'Departamentos',
      href: appRoute.departments,
      icon: (
        <UsersRound className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: 'Jornadas Laborales',
      href: appRoute.workDays,
      icon: (
        <CalendarClock className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: 'Permisos',
      href: appRoute.permissions,
      icon: (
        <UserRoundCheck className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: 'Reportes',
      href: appRoute.reports,
      icon: (
        <BookText className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    }
  ]
  const [open, setOpen] = useState(false)
  return (
    <div
      className={cn(
        'mx-auto flex w-full  flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800',
        'h-screen'
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarItem
              icon={
                <img
                  src="https://assets.aceternity.com/manu.png"
                  className="h-7 w-7 shrink-0 rounded-full"
                  width={50}
                  height={50}
                  alt="Avatar"
                />
              }
              label="Administrador"
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1">
        <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-4xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
          {children}
        </div>
      </div>
    </div>
  )
}
export const Logo = () => {
  return (
    <a
      href={appRoute.dashboard}
      className="relative z-20 flex mt-2 items-center space-x-2 py-1 text-lg font-normal text-black"
    >
      <div className="h-6 w-7 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Ingreso Xpress
      </motion.span>
    </a>
  )
}
export const LogoIcon = () => {
  return (
    <div className="relative z-20 flex mt-3 mb-1 items-center space-x-2 py-1 text-sm font-normal text-black">
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </div>
  )
}

export default SidebarMenu

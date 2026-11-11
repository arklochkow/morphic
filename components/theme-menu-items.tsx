'use client'

import {
  IconDeviceLaptop as Laptop,
  IconMoon as Moon,
  IconSun as Sun
} from '@tabler/icons-react'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { T } from '@/components/language-provider'
import { useTheme } from '@/components/theme-provider'

export function ThemeMenuItems() {
  const { setTheme } = useTheme()

  return (
    <>
      <DropdownMenuItem onClick={() => setTheme('light')}>
        <Sun className="size-4" />
        <span>
          <T text={'Light'} />
        </span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('dark')}>
        <Moon className="size-4" />
        <span>
          <T text={'Dark'} />
        </span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('system')}>
        <Laptop className="size-4" />
        <span>
          <T text={'System'} />
        </span>
      </DropdownMenuItem>
    </>
  )
}

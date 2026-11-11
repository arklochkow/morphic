'use client'

import { IconLibrary } from '@tabler/icons-react'

import { captureClient } from '@/lib/analytics/posthog-client'

import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

import { T } from '@/components/language-provider'
import { useLibrary } from '@/components/library/library-context'

export function LibraryMenuItem() {
  const { isOpen, toggleLibrary } = useLibrary()

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => {
          toggleLibrary()
          captureClient(isOpen ? 'library_closed' : 'library_opened', {
            source: 'sidebar'
          })
        }}
      >
        <IconLibrary className="size-4" />
        <span>
          <T text={'Library'} />
        </span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

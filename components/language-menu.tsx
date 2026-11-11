'use client'

import { IconLanguage } from '@tabler/icons-react'

import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu'

import { useTranslation } from './language-provider'

export function LanguageMenu() {
  const { locale, setLocale, t } = useTranslation()
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <IconLanguage className="size-4" />
        <span>{t('Language')}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={value => {
            if (value === 'en' || value === 'ru') setLocale(value)
          }}
        >
          <DropdownMenuRadioItem value="en" lang="en">
            English
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ru" lang="ru">
            Русский
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}

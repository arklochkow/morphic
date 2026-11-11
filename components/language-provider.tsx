'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import { Locale, LOCALE_COOKIE, translate } from '@/lib/i18n/translations'

const LanguageContext = createContext({
  locale: 'en' as Locale,
  setLocale: (_locale: Locale) => {},
  t: (text: string) => text
})

export function LanguageProvider({
  children,
  initialLocale = 'en'
}: {
  children: React.ReactNode
  initialLocale?: Locale
}) {
  const [locale, updateLocale] = useState(initialLocale)
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`
    updateLocale(next)
  }, [])
  const t = useCallback((text: string) => translate(locale, text), [locale])
  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  return useContext(LanguageContext)
}

export function T({ text }: { text: string }) {
  const { t } = useTranslation()
  return <>{t(text)}</>
}

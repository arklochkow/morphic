'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import {
  IconDeviceLaptop as Laptop,
  IconMoon as Moon,
  IconSun as Sun,
  IconTrash as Trash2
} from '@tabler/icons-react'
import { toast } from 'sonner'

import { deleteAccount } from '@/lib/actions/account'
import { signOut } from '@/lib/actions/auth'
import type { AppUser } from '@/lib/auth/types'
import { chatStore } from '@/lib/chat-store'
import { useAuthCapabilities } from '@/lib/contexts/app-user-context'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'

import { T, useTranslation } from '@/components/language-provider'
import { useTheme } from '@/components/theme-provider'

interface AccountSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: AppUser
}

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Laptop }
]

export function AccountSettingsDialog({
  open,
  onOpenChange,
  user
}: AccountSettingsDialogProps) {
  const { locale, setLocale, t } = useTranslation()
  const router = useRouter()
  const { setTheme, theme } = useTheme()
  const capabilities = useAuthCapabilities()
  const [isDeleting, startDeleteTransition] = useTransition()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const activeTheme = theme ?? 'system'

  const userName = user.name || t('User')

  const handleDeleteAccount = () => {
    startDeleteTransition(async () => {
      const result = await deleteAccount()

      if (result.success) {
        chatStore.setUser(null)
        try {
          await signOut()
        } catch (error) {
          console.error('Failed to clear client session:', error)
        }

        toast.success(t('Account deleted'))
        setConfirmOpen(false)
        onOpenChange(false)
        router.push('/')
        router.refresh()
        return
      }

      toast.error(result.error ?? t('Failed to delete account'))
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={nextOpen => {
        if (!isDeleting) {
          if (!nextOpen) {
            setConfirmOpen(false)
          }
          onOpenChange(nextOpen)
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            <T text={'Account'} />
          </DialogTitle>
          <DialogDescription>
            <T text={'Manage your account preferences and data.'} />{' '}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <section className="grid gap-3">
            <div className="grid gap-1">
              <h3 className="text-sm font-medium">
                <T text={'Profile'} />
              </h3>
              <div className="text-sm text-muted-foreground">
                <p className="truncate">{userName}</p>
                <p className="truncate">{user.email}</p>
              </div>
            </div>
          </section>

          <Separator />

          <section className="grid gap-3">
            <div className="grid gap-1">
              <h3 className="text-sm font-medium">
                <T text={'Theme'} />
              </h3>
              <p className="text-sm text-muted-foreground">
                <T text={'Choose how Morphic appears on this device.'} />{' '}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map(option => {
                const Icon = option.icon
                const selected = activeTheme === option.value

                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant={selected ? 'secondary' : 'outline'}
                    className="h-16 flex-col gap-1.5 px-2"
                    aria-pressed={selected}
                    onClick={() => setTheme(option.value)}
                  >
                    <Icon className="size-4" />
                    <span className="text-xs">
                      <T text={option.label} />
                    </span>
                  </Button>
                )
              })}
            </div>
          </section>

          <Separator />
          <section className="grid gap-3">
            <div className="grid gap-1">
              <label
                htmlFor="interface-language"
                className="text-sm font-medium"
              >
                {t('Language')}
              </label>
              <p className="text-sm text-muted-foreground">
                {t('Choose the interface language.')}
              </p>
            </div>
            <select
              id="interface-language"
              value={locale}
              onChange={event =>
                setLocale(event.target.value === 'ru' ? 'ru' : 'en')
              }
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="en" lang="en">
                English
              </option>
              <option value="ru" lang="ru">
                Русский
              </option>
            </select>
          </section>
          {capabilities.deleteUser && (
            <>
              <Separator />

              <section className="grid gap-3">
                <div className="grid gap-1">
                  <h3 className="text-sm font-medium text-destructive">
                    <T text={'Delete account'} />{' '}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <T
                      text={
                        'Permanently delete your account, chat history, and uploaded files. This action cannot be undone.'
                      }
                    />{' '}
                  </p>
                </div>

                <AlertDialog
                  open={confirmOpen}
                  onOpenChange={nextOpen => {
                    if (!isDeleting) {
                      setConfirmOpen(nextOpen)
                    }
                  }}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      className="w-fit gap-2"
                      disabled={isDeleting}
                    >
                      <Trash2 className="size-4" />
                      <T text={'Delete account'} />{' '}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        <T text={'Delete your account?'} />
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        <T
                          text={
                            'This action cannot be undone. Your account, chat history, and uploaded files will be permanently deleted.'
                          }
                        />{' '}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>
                        <T text={'Cancel'} />{' '}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        disabled={isDeleting}
                        onClick={event => {
                          event.preventDefault()
                          handleDeleteAccount()
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? <Spinner /> : t('Delete account')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </section>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

import Link from 'next/link'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { IconLogo } from '@/components/ui/icons'

import { T } from '@/components/language-provider'

export function InviteRequired() {
  return (
    <div className="flex flex-col items-center gap-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex flex-col items-center justify-center gap-4">
            <IconLogo className="size-12" />
            <T text={'Invitation required'} />{' '}
          </CardTitle>
          <CardDescription>
            <T
              text={
                'Sign-up on this Morphic instance is invite-only. Ask an administrator for an invitation link and open it to create your account.'
              }
            />{' '}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-2 text-center text-sm">
            <T text={'Already have an account?'} />{' '}
            <Link href="/auth/login" className="underline underline-offset-4">
              <T text={'Sign In'} />{' '}
            </Link>
          </div>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-muted-foreground">
        <Link href="/" className="hover:underline">
          <T text={'← Back to Home'} />{' '}
        </Link>
      </div>
    </div>
  )
}

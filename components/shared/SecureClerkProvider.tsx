'use client'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useTheme } from 'next-themes'
import { PropsWithChildren } from 'react'

const SecureClerkProvider = ({ children }: PropsWithChildren) => {
  const { theme } = useTheme()

  const clerkConfig =
    theme === 'dark'
      ? { baseTheme: dark, variables: { colorPrimary: '#3f23f6' } }
      : { variables: { colorPrimary: '#624cf5' } }
  return <ClerkProvider appearance={clerkConfig}>{children}</ClerkProvider>
}

export default SecureClerkProvider

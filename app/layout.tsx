import { ThemeProvider } from '@/components/provider/theme-provider'
import SecureClerkProvider from '@/components/shared/SecureClerkProvider'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { IBM_Plex_Sans } from 'next/font/google'
import './globals.css'

const IBMplex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex',
})

export const metadata: Metadata = {
  title: 'smarteditfy',
  description: 'AI-powered image creator',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={cn('font-IBMPlex antialiased', IBMplex.variable)}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <SecureClerkProvider>{children}</SecureClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

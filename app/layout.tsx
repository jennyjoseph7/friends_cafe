import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/hooks/use-cart'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'Friends Cafe',
  description: 'Order delicious food from Friends Cafe',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="friends-cafe-theme"
        >
          <CartProvider>
            {children}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/my_components/theme_provider"

export const metadata: Metadata = {
  title: "Jonathan Ye",
  description: "Jonathan Ye's Personal Website",
  icons: {
    icon: '/spotify.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider attribute="class" forcedTheme="dark" disableTransitionOnChange>
          <main className="flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}

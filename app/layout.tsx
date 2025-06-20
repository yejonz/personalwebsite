import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/my_components/theme_provider";

export const metadata: Metadata = {
  title: "Jonathan Ye",
  description: "Jonathan Ye's Personal Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <main className="flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CookieConsent } from "@/components/analytics/cookie-consent"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MindReMinder - Smart Reminders & Motivational Quotes",
  description: "Never forget important tasks with intelligent reminders and daily motivation",
  keywords: ["reminders", "productivity", "motivation", "quotes", "tasks"],
  authors: [{ name: "MindReMinder Team" }],
  openGraph: {
    title: "MindReMinder - Smart Reminders & Motivational Quotes",
    description: "Never forget important tasks with intelligent reminders and daily motivation",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MindReMinder - Smart Reminders & Motivational Quotes",
    description: "Never forget important tasks with intelligent reminders and daily motivation",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  )
}

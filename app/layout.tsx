import type React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Inter } from "next/font/google"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MindReMinder - Your Personal Habit & Reminder Assistant",
  description:
    "Build lasting habits, set meaningful reminders, and track your progress with AI-powered insights. Transform your daily routine into a path of continuous growth.",
  keywords: ["habits", "reminders", "productivity", "goals", "tracking", "AI"],
  authors: [{ name: "MindReMinder Team" }],
  creator: "MindReMinder",
  publisher: "MindReMinder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://mindreminder.vercel.app"),
  openGraph: {
    title: "MindReMinder - Your Personal Habit & Reminder Assistant",
    description: "Build lasting habits, set meaningful reminders, and track your progress with AI-powered insights.",
    url: "https://mindreminder.vercel.app",
    siteName: "MindReMinder",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MindReMinder - Your Personal Habit & Reminder Assistant",
    description: "Build lasting habits, set meaningful reminders, and track your progress with AI-powered insights.",
    creator: "@mindreminder",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        </ThemeProvider>
      </body>
    </html>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MindReMinder - Your Personal Habit & Reminder Assistant",
  description:
    "Build better habits with gentle reminders, micro-actions, and daily inspiration. Track your progress and stay motivated on your personal growth journey.",
  keywords: ["habits", "reminders", "productivity", "personal growth", "mindfulness"],
  authors: [{ name: "MindReMinder Team" }],
  creator: "MindReMinder",
  publisher: "MindReMinder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://mindreminder.vercel.app"),
  openGraph: {
    title: "MindReMinder - Your Personal Habit & Reminder Assistant",
    description: "Build better habits with gentle reminders, micro-actions, and daily inspiration.",
    url: "/",
    siteName: "MindReMinder",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MindReMinder - Personal Habit Assistant",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MindReMinder - Your Personal Habit & Reminder Assistant",
    description: "Build better habits with gentle reminders, micro-actions, and daily inspiration.",
    images: ["/og-image.png"],
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
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={inter.className}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
          <Analytics />
          <SpeedInsights />
        </Suspense>
      </body>
    </html>
  )
}

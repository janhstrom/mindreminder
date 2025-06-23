import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AnalyticsProvider } from "@/components/analytics/analytics-provider"
import { CookieConsent } from "@/components/analytics/cookie-consent"
import { StructuredData } from "@/components/seo/structured-data"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MindReMinder - Build Life-Changing Habits Through Micro-Actions",
  description:
    "Transform your life with science-backed micro-actions. Build lasting habits through tiny daily actions that compound into extraordinary results.",
  keywords: "habits, micro-actions, productivity, goals, reminders, habit formation, behavior change",
  authors: [{ name: "MindReMinder Team" }],
  creator: "MindReMinder",
  publisher: "MindReMinder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://mindreminder.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MindReMinder - Build Life-Changing Habits Through Micro-Actions",
    description:
      "Transform your life with science-backed micro-actions. Build lasting habits through tiny daily actions.",
    url: "https://mindreminder.vercel.app",
    siteName: "MindReMinder",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MindReMinder - Habit Formation App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MindReMinder - Build Life-Changing Habits",
    description: "Transform your life with science-backed micro-actions",
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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Suspense fallback={null}>
            <AnalyticsProvider>
              {children}
              <CookieConsent />
            </AnalyticsProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}

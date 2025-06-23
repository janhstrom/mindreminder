import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/auth-provider"
import { StructuredData } from "@/components/seo/structured-data"
import { Analytics } from "@/lib/analytics"
import { CookieConsent } from "@/components/analytics/cookie-consent"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MindReMinder - Your Personal Habit & Reminder Companion",
  description:
    "Build lasting habits with gentle reminders, micro-actions, and AI-powered motivation. Transform your daily routine with MindReMinder.",
  keywords: ["habits", "reminders", "productivity", "mindfulness", "personal development", "micro-actions"],
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
    title: "MindReMinder - Your Personal Habit & Reminder Companion",
    description: "Build lasting habits with gentle reminders, micro-actions, and AI-powered motivation.",
    url: "https://mindreminder.vercel.app",
    siteName: "MindReMinder",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MindReMinder - Personal Habit Companion",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MindReMinder - Your Personal Habit & Reminder Companion",
    description: "Build lasting habits with gentle reminders, micro-actions, and AI-powered motivation.",
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
          <AuthProvider>
            <Suspense fallback={null}>
              {children}
              <CookieConsent />
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

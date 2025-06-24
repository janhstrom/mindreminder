import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MindReMinder - Build Life-Changing Habits Through Micro-Actions",
  description:
    "Transform your life with science-backed micro-actions. Build lasting habits through tiny daily actions that compound into extraordinary results.",
  keywords: ["habits", "micro-actions", "productivity", "goals", "reminders", "habit formation"],
  authors: [{ name: "MindReMinder Team" }],
  creator: "MindReMinder",
  publisher: "MindReMinder",
  metadataBase: new URL("https://mindreminder.vercel.app"),
  openGraph: {
    title: "MindReMinder - Build Life-Changing Habits",
    description: "Transform your life with science-backed micro-actions and gentle reminders.",
    url: "https://mindreminder.vercel.app",
    siteName: "MindReMinder",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

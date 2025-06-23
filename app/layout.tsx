import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { EnhancedAnalyticsProvider } from "@/components/analytics/enhanced-analytics-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "MindReMinder - Never Forget What Matters Most",
    template: "%s | MindReMinder",
  },
  description:
    "MindReMinder is your intelligent companion that helps you remember important moments, stay motivated with AI-generated quotes, and share meaningful reminders with friends. Not a to-do list - a mindful reminder app.",
  keywords: [
    "reminders app",
    "mindful reminders",
    "AI quotes",
    "personal assistant",
    "memory app",
    "location reminders",
    "smart notifications",
    "mindfulness app",
    "inspiration quotes",
    "friend sharing",
  ],
  authors: [{ name: "MindReMinder Team" }],
  creator: "MindReMinder",
  publisher: "MindReMinder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://mindreminder.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MindReMinder - Never Forget What Matters Most",
    description:
      "Your intelligent companion for meaningful reminders and AI-powered inspiration. Not a to-do list - something better.",
    url: "https://mindreminder.com",
    siteName: "MindReMinder",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MindReMinder - Intelligent Reminders App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MindReMinder - Never Forget What Matters Most",
    description: "Your intelligent companion for meaningful reminders and AI-powered inspiration.",
    images: ["/twitter-image.jpg"],
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
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
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MindReMinder" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <EnhancedAnalyticsProvider>{children}</EnhancedAnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

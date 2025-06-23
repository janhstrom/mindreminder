"use client"

import type React from "react"

import { useEffect } from "react"
import Script from "next/script"
import { CookieConsent } from "./cookie-consent"

interface AnalyticsProviderProps {
  children: React.ReactNode
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  useEffect(() => {
    // Initialize Google Analytics with consent mode
    if (typeof window !== "undefined") {
      window.gtag?.("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        wait_for_update: 500,
      })
    }
  }, [])

  return (
    <>
      {/* Google Analytics 4 */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-81MHDKZYCD" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          gtag('config', 'G-81MHDKZYCD', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>

      {/* Hotjar - User behavior analytics */}
      <Script id="hotjar" strategy="afterInteractive">
        {`
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:3000000,hjsv:6}; // Replace with your Hotjar ID
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}
      </Script>

      {children}
      <CookieConsent />
    </>
  )
}

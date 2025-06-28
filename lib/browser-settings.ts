"use client"

export interface BrowserInfo {
  name: string
  settingsUrl?: string
  instructions: string[]
}

export function getBrowserInfo(): BrowserInfo {
  if (typeof window === "undefined") {
    return { name: "Unknown", instructions: ["Please check your browser settings"] }
  }

  const userAgent = navigator.userAgent.toLowerCase()

  if (userAgent.includes("chrome") && !userAgent.includes("edg")) {
    return {
      name: "Chrome",
      settingsUrl: "chrome://settings/content/notifications",
      instructions: [
        "Click the link above or go to Chrome Settings",
        "Navigate to Privacy and security → Site Settings → Notifications",
        "Find MindReMinder in the list and change to 'Allow'",
        "Refresh this page and try again",
      ],
    }
  }

  if (userAgent.includes("firefox")) {
    return {
      name: "Firefox",
      settingsUrl: "about:preferences#privacy",
      instructions: [
        "Click the link above or go to Firefox Preferences",
        "Scroll down to 'Permissions' section",
        "Click 'Settings...' next to Notifications",
        "Find MindReMinder and change to 'Allow'",
        "Refresh this page and try again",
      ],
    }
  }

  if (userAgent.includes("safari")) {
    return {
      name: "Safari",
      instructions: [
        "Go to Safari → Preferences → Websites",
        "Click on 'Notifications' in the left sidebar",
        "Find MindReMinder and change to 'Allow'",
        "Refresh this page and try again",
      ],
    }
  }

  if (userAgent.includes("edg")) {
    return {
      name: "Edge",
      settingsUrl: "edge://settings/content/notifications",
      instructions: [
        "Click the link above or go to Edge Settings",
        "Navigate to Cookies and site permissions → Notifications",
        "Find MindReMinder in the list and change to 'Allow'",
        "Refresh this page and try again",
      ],
    }
  }

  return {
    name: "Browser",
    instructions: [
      "Go to your browser settings",
      "Look for 'Notifications' or 'Site permissions'",
      "Find MindReMinder and change to 'Allow'",
      "Refresh this page and try again",
    ],
  }
}

export function openBrowserSettings(): void {
  const browserInfo = getBrowserInfo()
  if (browserInfo.settingsUrl) {
    try {
      window.open(browserInfo.settingsUrl, "_blank")
    } catch (error) {
      console.warn("Could not open browser settings automatically")
    }
  }
}

"use client"

// Google Analytics 4 Event Tracking Utility
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void
  }
}

export interface GAEvent {
  action: string
  category: string
  label?: string
  value?: number
}

export interface GAPageView {
  page_title: string
  page_location: string
}

export interface GAUserProperties {
  user_type?: "free" | "premium"
  signup_method?: "email" | "google" | "facebook"
  user_id?: string
}

export class Analytics {
  private static isEnabled(): boolean {
    return typeof window !== "undefined" && typeof window.gtag === "function"
  }

  // Page view tracking
  static pageView(url: string, title?: string): void {
    if (!this.isEnabled()) return

    window.gtag("config", "G-XXXXXXXXXX", {
      page_location: url,
      page_title: title,
    })
  }

  // Custom event tracking
  static event(eventName: string, parameters?: Record<string, any>): void {
    if (!this.isEnabled()) return

    window.gtag("event", eventName, {
      event_category: parameters?.category || "engagement",
      event_label: parameters?.label,
      value: parameters?.value,
      ...parameters,
    })
  }

  // User authentication events
  static trackSignUp(method: string): void {
    this.event("sign_up", {
      method,
      event_category: "authentication",
    })
  }

  static trackLogin(method: string): void {
    this.event("login", {
      method,
      event_category: "authentication",
    })
  }

  static trackLogout(): void {
    this.event("logout", {
      event_category: "authentication",
    })
  }

  // Reminder-specific events
  static trackReminderCreated(reminderType: "text" | "image" | "location"): void {
    this.event("reminder_created", {
      reminder_type: reminderType,
      event_category: "reminders",
    })
  }

  static trackReminderEdited(): void {
    this.event("reminder_edited", {
      event_category: "reminders",
    })
  }

  static trackReminderDeleted(): void {
    this.event("reminder_deleted", {
      event_category: "reminders",
    })
  }

  static trackReminderToggled(isActive: boolean): void {
    this.event("reminder_toggled", {
      reminder_status: isActive ? "activated" : "deactivated",
      event_category: "reminders",
    })
  }

  static trackReminderShared(method: "native_share" | "copy_link"): void {
    this.event("share", {
      method,
      content_type: "reminder",
      event_category: "social",
    })
  }

  // Quote-specific events
  static trackQuoteGenerated(topic: string): void {
    this.event("quote_generated", {
      quote_topic: topic,
      event_category: "quotes",
    })
  }

  static trackQuoteShared(method: "native_share" | "copy"): void {
    this.event("share", {
      method,
      content_type: "quote",
      event_category: "social",
    })
  }

  // Navigation and engagement events
  static trackButtonClick(buttonName: string, location: string): void {
    this.event("click", {
      button_name: buttonName,
      button_location: location,
      event_category: "engagement",
    })
  }

  static trackFeatureUsage(featureName: string): void {
    this.event("feature_used", {
      feature_name: featureName,
      event_category: "features",
    })
  }

  static trackTabChange(tabName: string): void {
    this.event("tab_change", {
      tab_name: tabName,
      event_category: "navigation",
    })
  }

  // Conversion events
  static trackGetStartedClick(location: "hero" | "cta" | "header"): void {
    this.event("get_started_click", {
      button_location: location,
      event_category: "conversion",
    })
  }

  static trackDemoRequest(): void {
    this.event("demo_request", {
      event_category: "conversion",
    })
  }

  // Error tracking
  static trackError(errorType: string, errorMessage: string): void {
    this.event("exception", {
      description: errorMessage,
      fatal: false,
      error_type: errorType,
      event_category: "errors",
    })
  }

  // User properties
  static setUserProperties(properties: GAUserProperties): void {
    if (!this.isEnabled()) return

    window.gtag("config", "G-XXXXXXXXXX", {
      user_properties: properties,
    })
  }

  // E-commerce events (for future premium features)
  static trackPurchase(transactionId: string, value: number, currency = "USD"): void {
    this.event("purchase", {
      transaction_id: transactionId,
      value,
      currency,
      event_category: "ecommerce",
    })
  }

  static trackSubscription(planType: string, value: number): void {
    this.event("subscribe", {
      plan_type: planType,
      value,
      currency: "USD",
      event_category: "subscription",
    })
  }
}

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MindReMinder",
    url: "https://mindreminder.com",
    logo: "https://mindreminder.com/logo.png",
    description:
      "MindReMinder is your intelligent companion that helps you remember important moments, stay motivated with AI-generated quotes, and share meaningful reminders with friends.",
    foundingDate: "2024",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-REMINDER",
      contactType: "customer service",
      availableLanguage: ["English"],
    },
    sameAs: [
      "https://twitter.com/mindreminder",
      "https://facebook.com/mindreminder",
      "https://linkedin.com/company/mindreminder",
    ],
  }

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "MindReMinder",
    operatingSystem: ["iOS", "Android", "Web"],
    applicationCategory: "ProductivityApplication",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1247",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    description:
      "Intelligent reminder app with AI-powered quotes and location-based notifications. Not a to-do list - a mindful companion for what matters most.",
    featureList: [
      "Smart Reminders with Text and Images",
      "Location-Based Notifications",
      "AI-Generated Inspirational Quotes",
      "Friend Sharing and Social Features",
      "Cross-Platform Sync",
      "Privacy-Focused Design",
    ],
    screenshot: "https://mindreminder.com/app-screenshot.jpg",
    downloadUrl: "https://mindreminder.com/download",
    author: {
      "@type": "Organization",
      name: "MindReMinder Team",
    },
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MindReMinder",
    url: "https://mindreminder.com",
    description: "Never forget what matters most with intelligent reminders and AI-powered inspiration.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://mindreminder.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is MindReMinder a to-do list app?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, MindReMinder is not a to-do list app. We focus on meaningful reminders and memories rather than task management. We help you remember what matters most in your life.",
        },
      },
      {
        "@type": "Question",
        name: "How does the AI quote feature work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our AI generates personalized, inspiring quotes based on topics you choose like motivation, success, happiness, and wisdom. Each quote is unique and tailored to provide meaningful inspiration.",
        },
      },
      {
        "@type": "Question",
        name: "Can I share reminders with friends?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! MindReMinder allows you to share meaningful reminders and quotes with friends, helping strengthen relationships through shared memories and inspiration.",
        },
      },
      {
        "@type": "Question",
        name: "Is MindReMinder free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, MindReMinder is free to start with no credit card required. We offer premium features for users who want advanced functionality.",
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  )
}

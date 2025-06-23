import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import {
  ArrowLeft,
  HelpCircle,
  Search,
  MessageCircle,
  Book,
  Smartphone,
  Brain,
  Users,
  Bell,
  Settings,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Help Center",
  description: "Get help with MindReMinder - Find answers to common questions and learn how to use all features.",
}

export default function HelpPage() {
  const categories = [
    {
      icon: Bell,
      title: "Reminders",
      description: "Creating, managing, and scheduling reminders",
      count: 8,
    },
    {
      icon: Brain,
      title: "AI Quotes",
      description: "Generating and sharing inspirational quotes",
      count: 5,
    },
    {
      icon: Users,
      title: "Sharing & Friends",
      description: "Connecting with friends and sharing content",
      count: 6,
    },
    {
      icon: Smartphone,
      title: "Mobile App",
      description: "Using MindReMinder on your phone",
      count: 7,
    },
    {
      icon: Settings,
      title: "Account & Settings",
      description: "Managing your profile and preferences",
      count: 4,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-16 items-center">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Find answers to common questions and learn how to make the most of MindReMinder
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search for help..." className="pl-10" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Contact Support</h3>
              <p className="text-sm text-muted-foreground mb-4">Get personalized help from our support team</p>
              <Link href="/contact">
                <Button size="sm">Contact Us</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <Book className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">User Guide</h3>
              <p className="text-sm text-muted-foreground mb-4">Complete guide to using MindReMinder</p>
              <Button size="sm" variant="outline">
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <Smartphone className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Mobile App</h3>
              <p className="text-sm text-muted-foreground mb-4">Download our mobile app for iOS and Android</p>
              <Button size="sm" variant="outline">
                Download
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Help Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Card key={category.title} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                      <Badge variant="secondary">{category.count}</Badge>
                    </div>
                    <h3 className="font-semibold mb-2">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="what-is-mindreminder">
              <AccordionTrigger className="text-left">
                What is MindReMinder and how is it different from other reminder apps?
              </AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">
                  MindReMinder is not just another to-do list or task manager. We focus on helping you remember what
                  truly matters in your life - meaningful moments, important relationships, and personal inspiration.
                </p>
                <p>
                  Unlike productivity apps that focus on tasks and deadlines, MindReMinder helps you stay connected to
                  your values, memories, and the people you care about through intelligent reminders and AI-powered
                  inspiration.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="how-to-create-reminder">
              <AccordionTrigger className="text-left">How do I create a reminder?</AccordionTrigger>
              <AccordionContent>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Go to the Reminders section in your dashboard</li>
                  <li>Click the "New Reminder" button</li>
                  <li>Add a title and description for your reminder</li>
                  <li>Optionally set a specific time or location</li>
                  <li>Add an image if you want visual context</li>
                  <li>Click "Create Reminder" to save</li>
                </ol>
                <p className="mt-4">
                  Your reminder will be active by default and you'll receive notifications based on your settings.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ai-quotes-work">
              <AccordionTrigger className="text-left">How do AI-generated quotes work?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">
                  Our AI quote generator uses advanced language models to create personalized, inspiring quotes based on
                  topics you choose. Here's how it works:
                </p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Select a topic like motivation, success, happiness, or wisdom</li>
                  <li>Click "Generate Quote" to create a unique, personalized quote</li>
                  <li>Each quote is original and tailored to provide meaningful inspiration</li>
                  <li>You can copy, share, or generate new quotes as often as you like</li>
                </ol>
                <p className="mt-4">
                  The AI considers the context of your chosen topic to create quotes that are relevant and inspiring.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="location-reminders">
              <AccordionTrigger className="text-left">How do location-based reminders work?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">
                  Location-based reminders trigger when you arrive at or leave specific places. To set them up:
                </p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Create a new reminder and add a location in the location field</li>
                  <li>Grant location permissions when prompted</li>
                  <li>The app will monitor your location in the background</li>
                  <li>You'll receive a notification when you reach the specified location</li>
                </ol>
                <p className="mt-4">
                  <strong>Note:</strong> Location features require the mobile app and appropriate permissions. We
                  respect your privacy and only use location data for reminder functionality.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="share-with-friends">
              <AccordionTrigger className="text-left">Can I share reminders and quotes with friends?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">Yes! Sharing meaningful content is a core part of MindReMinder. You can:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Share individual reminders using the share button on each reminder</li>
                  <li>Share AI-generated quotes via copy/paste or native sharing</li>
                  <li>Send content through your device's built-in sharing options</li>
                </ul>
                <p className="mt-4">
                  <strong>Coming Soon:</strong> Friend connections within the app for easier sharing and collaborative
                  reminders.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sync-devices">
              <AccordionTrigger className="text-left">Do my reminders sync between web and mobile?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">
                  Yes! Your reminders, quotes, and settings automatically sync across all your devices when you're
                  logged into the same account.
                </p>
                <p className="mb-4">This means you can:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Create reminders on the web and receive notifications on mobile</li>
                  <li>Edit reminders on any device and see changes everywhere</li>
                  <li>Access your quote history across platforms</li>
                  <li>Maintain consistent settings and preferences</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="free-vs-premium">
              <AccordionTrigger className="text-left">
                Is MindReMinder free? What premium features are available?
              </AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">
                  MindReMinder is free to start with no credit card required. Our free plan includes:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Unlimited basic reminders</li>
                  <li>AI quote generation</li>
                  <li>Basic sharing features</li>
                  <li>Web and mobile access</li>
                </ul>
                <p className="mt-4">
                  <strong>Premium features (coming soon):</strong> Advanced scheduling, priority support, enhanced AI
                  features, and team collaboration tools.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="data-privacy">
              <AccordionTrigger className="text-left">
                How is my data protected and can I delete my account?
              </AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">Your privacy and data security are our top priorities:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>All data is encrypted in transit and at rest</li>
                  <li>We never sell your personal information</li>
                  <li>You have full control over your data</li>
                  <li>You can export or delete your data at any time</li>
                </ul>
                <p className="mt-4">
                  To delete your account, go to Settings → Account → Delete Account, or contact our support team. All
                  your data will be permanently removed within 30 days.
                </p>
                <Link href="/privacy" className="inline-block mt-2">
                  <Button variant="outline" size="sm">
                    Read Privacy Policy
                  </Button>
                </Link>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="mobile-app-download">
              <AccordionTrigger className="text-left">Where can I download the mobile app?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">
                  The MindReMinder mobile app is currently in development and will be available soon on:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>iOS App Store (iPhone and iPad)</li>
                  <li>Google Play Store (Android devices)</li>
                </ul>
                <p className="mt-4">
                  In the meantime, you can use the web version on your mobile browser - it's fully responsive and works
                  great on mobile devices!
                </p>
                <p className="mt-4">
                  <strong>Want to be notified when the app launches?</strong> Sign up for our newsletter to get early
                  access.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="technical-issues">
              <AccordionTrigger className="text-left">
                I'm experiencing technical issues. How can I get help?
              </AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">If you're experiencing technical problems, try these steps first:</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Refresh your browser or restart the app</li>
                  <li>Clear your browser cache and cookies</li>
                  <li>Check your internet connection</li>
                  <li>Try using a different browser or device</li>
                </ol>
                <p className="mt-4">If the problem persists, please contact our support team with:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>A description of the issue</li>
                  <li>What you were trying to do when it occurred</li>
                  <li>Your browser/device information</li>
                  <li>Any error messages you saw</li>
                </ul>
                <Link href="/contact" className="inline-block mt-4">
                  <Button size="sm">Contact Support</Button>
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Still Need Help */}
        <Card className="mt-12 text-center">
          <CardContent className="pt-6">
            <MessageCircle className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Link href="/contact">
              <Button>Contact Support</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { Bell, Brain, Users, Smartphone, Globe, MapPin, Sparkles, X, CheckCircle, ArrowRight, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { StructuredData } from "@/components/seo/structured-data"
import Link from "next/link"

import { useTrackEvent } from "@/hooks/use-analytics"
import { Analytics } from "@/lib/analytics"
import { CookieConsent } from "@/components/analytics/cookie-consent"
import { SupabaseAuthService } from "@/lib/auth-supabase"
import type { AuthUser } from "@/lib/auth-supabase"

function HomePageContent() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLogin, setIsLogin] = useState(true)
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const router = useRouter()

  const { trackClick, trackFeature } = useTrackEvent()

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await SupabaseAuthService.getInstance().getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
      }
    }

    loadUser()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = SupabaseAuthService.getInstance().onAuthStateChange((user) => {
      setUser(user)
      if (user) {
        // Small delay to ensure state is updated
        setTimeout(() => {
          router.push("/dashboard")
        }, 100)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleLogin = (loggedInUser: AuthUser) => {
    Analytics.trackLogin("email")
    Analytics.setUserProperties({
      user_type: "free",
      signup_method: "email",
      user_id: loggedInUser.id,
    })
    setUser(loggedInUser)
    setAuthDialogOpen(false)
    // Navigate to dashboard
    router.push("/dashboard")
  }

  const handleGetStarted = () => {
    Analytics.trackGetStartedClick("hero")
    if (user) {
      router.push("/dashboard")
    } else {
      setAuthDialogOpen(true)
    }
  }

  return (
    <>
      <StructuredData />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">MR</span>
              </div>
              <h1 className="text-xl font-bold text-primary">MindReMinder</h1>
            </Link>

            <nav className="flex items-center space-x-4">
              {user ? (
                <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
              ) : (
                <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Sign In</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{isLogin ? "Sign In to MindReMinder" : "Create MindReMinder Account"}</DialogTitle>
                      <DialogDescription>
                        {isLogin
                          ? "Welcome back! Please sign in to your account."
                          : "Join MindReMinder to start organizing your life with intelligent reminders."}
                      </DialogDescription>
                    </DialogHeader>
                    {isLogin ? (
                      <LoginForm onLogin={handleLogin} onToggleMode={() => setIsLogin(false)} />
                    ) : (
                      <RegisterForm onRegister={handleLogin} onToggleMode={() => setIsLogin(true)} />
                    )}
                  </DialogContent>
                </Dialog>
              )}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
            <div className="container mx-auto text-center max-w-4xl">
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered Personal Assistant
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Never Forget What Matters Most
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                MindReMinder is your intelligent companion that helps you remember important moments, stay motivated
                with AI-generated quotes, and share meaningful reminders with friends.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" onClick={handleGetStarted} className="text-lg px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8"
                  onClick={() => Analytics.trackDemoRequest()}
                >
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                  Free to start
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                  Works everywhere
                </div>
              </div>
            </div>
          </section>

          {/* What MindReMinder Is NOT */}
          <section className="py-16 px-4 bg-muted/30" aria-labelledby="what-not-heading">
            <div className="container mx-auto max-w-4xl">
              <div className="text-center mb-12">
                <h2 id="what-not-heading" className="text-3xl font-bold mb-4">
                  What MindReMinder Is NOT
                </h2>
                <p className="text-lg text-muted-foreground">
                  We're not another productivity app. We're something different.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <article className="border-2 border-destructive/20 rounded-lg p-6 text-center">
                  <X className="w-12 h-12 text-destructive mx-auto mb-4" aria-hidden="true" />
                  <h3 className="font-semibold mb-2">Not a To-Do List</h3>
                  <p className="text-sm text-muted-foreground">
                    We don't manage your tasks. We help you remember what's truly important.
                  </p>
                </article>

                <article className="border-2 border-destructive/20 rounded-lg p-6 text-center">
                  <X className="w-12 h-12 text-destructive mx-auto mb-4" aria-hidden="true" />
                  <h3 className="font-semibold mb-2">Not a Calendar App</h3>
                  <p className="text-sm text-muted-foreground">
                    We don't schedule meetings. We remind you of meaningful moments.
                  </p>
                </article>

                <article className="border-2 border-destructive/20 rounded-lg p-6 text-center">
                  <X className="w-12 h-12 text-destructive mx-auto mb-4" aria-hidden="true" />
                  <h3 className="font-semibold mb-2">Not Just Another App</h3>
                  <p className="text-sm text-muted-foreground">
                    We're a mindful companion that cares about your well-being.
                  </p>
                </article>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 px-4" aria-labelledby="features-heading">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-16">
                <h2 id="features-heading" className="text-3xl md:text-4xl font-bold mb-4">
                  Intelligent Reminders That Actually Matter
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  MindReMinder combines smart technology with human insight to help you stay connected to what's
                  important in your life.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <article className="border-2 hover:border-primary/50 transition-colors rounded-lg p-6">
                  <Bell className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-2">Smart Reminders</h3>
                  <p className="text-muted-foreground">
                    Set reminders with text, images, and smart scheduling. Get notified at the perfect time.
                  </p>
                </article>

                <article className="border-2 hover:border-primary/50 transition-colors rounded-lg p-6">
                  <MapPin className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-2">Location-Based</h3>
                  <p className="text-muted-foreground">
                    Get reminded when you arrive at specific places. Perfect for context-sensitive memories.
                  </p>
                </article>

                <article className="border-2 hover:border-primary/50 transition-colors rounded-lg p-6">
                  <Brain className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-2">AI-Powered Quotes</h3>
                  <p className="text-muted-foreground">
                    Receive personalized, inspiring quotes generated by AI based on topics that matter to you.
                  </p>
                </article>

                <article className="border-2 hover:border-primary/50 transition-colors rounded-lg p-6">
                  <Users className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-2">Share with Friends</h3>
                  <p className="text-muted-foreground">
                    Send meaningful reminders and quotes to friends. Strengthen relationships through shared memories.
                  </p>
                </article>

                <article className="border-2 hover:border-primary/50 transition-colors rounded-lg p-6">
                  <Smartphone className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-2">Native Mobile App</h3>
                  <p className="text-muted-foreground">
                    Full-featured mobile app with push notifications and offline access. Always in your pocket.
                  </p>
                </article>

                <article className="border-2 hover:border-primary/50 transition-colors rounded-lg p-6">
                  <Globe className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-2">Web & Mobile Sync</h3>
                  <p className="text-muted-foreground">
                    Seamlessly sync between web and mobile. Manage reminders from anywhere, anytime.
                  </p>
                </article>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-20 px-4 bg-muted/30" aria-labelledby="how-it-works-heading">
            <div className="container mx-auto max-w-4xl">
              <div className="text-center mb-16">
                <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-bold mb-4">
                  How MindReMinder Works
                </h2>
                <p className="text-lg text-muted-foreground">Simple, intuitive, and designed for real life</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-foreground">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Create Reminders</h3>
                  <p className="text-muted-foreground">
                    Add meaningful reminders with text, images, and smart scheduling options.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-foreground">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Get Notified</h3>
                  <p className="text-muted-foreground">
                    Receive timely notifications based on time, location, or other smart triggers.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-foreground">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Stay Inspired</h3>
                  <p className="text-muted-foreground">
                    Enjoy AI-generated quotes and share meaningful moments with friends.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-20 px-4" aria-labelledby="testimonials-heading">
            <div className="container mx-auto max-w-4xl">
              <div className="text-center mb-16">
                <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold mb-4">
                  What People Are Saying
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <article className="rounded-lg p-6 border">
                  <div className="flex mb-4" aria-label="5 star rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-4">
                    "Finally, an app that understands the difference between tasks and memories. MindReMinder helps me
                    stay connected to what truly matters."
                  </blockquote>
                  <footer>
                    <div className="font-semibold">Sarah Johnson</div>
                    <div className="text-sm text-muted-foreground">Life Coach</div>
                  </footer>
                </article>

                <article className="rounded-lg p-6 border">
                  <div className="flex mb-4" aria-label="5 star rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-4">
                    "The AI quotes feature is incredible. It's like having a personal motivational coach that knows
                    exactly what I need to hear."
                  </blockquote>
                  <footer>
                    <div className="font-semibold">Michael Chen</div>
                    <div className="text-sm text-muted-foreground">Entrepreneur</div>
                  </footer>
                </article>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 bg-primary text-primary-foreground">
            <div className="container mx-auto text-center max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform How You Remember?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of people who've discovered a better way to stay connected to what matters most in their
                lives.
              </p>

              <Button
                size="lg"
                variant="secondary"
                onClick={() => {
                  Analytics.trackGetStartedClick("cta")
                  handleGetStarted()
                }}
                className="text-lg px-8"
              >
                Start Your Journey Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <p className="text-sm mt-4 opacity-75">Free forever. No credit card required. Cancel anytime.</p>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-12 px-4 border-t bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-xs">MR</span>
                    </div>
                    <span className="font-bold text-primary">MindReMinder</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your intelligent companion for meaningful reminders and inspiration.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Product</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      <a href="#features" className="hover:text-foreground">
                        Features
                      </a>
                    </li>
                    <li>
                      <a href="/mobile" className="hover:text-foreground">
                        Mobile App
                      </a>
                    </li>
                    <li>
                      <a href="/dashboard" className="hover:text-foreground">
                        Web App
                      </a>
                    </li>
                    <li>
                      <a href="/api" className="hover:text-foreground">
                        API
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Company</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      <a href="/about" className="hover:text-foreground">
                        About
                      </a>
                    </li>
                    <li>
                      <a href="/blog" className="hover:text-foreground">
                        Blog
                      </a>
                    </li>
                    <li>
                      <a href="/careers" className="hover:text-foreground">
                        Careers
                      </a>
                    </li>
                    <li>
                      <Link href="/contact" className="hover:text-foreground">
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Support</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      <Link href="/help" className="hover:text-foreground">
                        Help Center
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacy" className="hover:text-foreground">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/terms" className="hover:text-foreground">
                        Terms of Service
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
                <p>&copy; 2025 MindReMinder. All rights reserved. Built with ❤️ for mindful living.</p>
              </div>
            </div>
          </footer>
        </main>
        <CookieConsent />
      </div>
    </>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  )
}

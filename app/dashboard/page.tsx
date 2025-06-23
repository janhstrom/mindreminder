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
import {
  Brain,
  Users,
  MapPin,
  X,
  CheckCircle,
  ArrowRight,
  Star,
  Target,
  TrendingUp,
  Repeat,
  Zap,
  Apple,
  Play,
} from "lucide-react"
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
              <Link href="/resources" className="text-sm font-medium hover:text-primary transition-colors">
                Resources
              </Link>
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
                          : "Join MindReMinder to start building better habits with micro-actions."}
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
                <Target className="w-3 h-3 mr-1" />
                Habit Formation & Micro-Actions
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Build Life-Changing Habits Through Tiny Daily Actions
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                MindReMinder helps you create lasting change by breaking big goals into small, manageable micro-actions.
                Get reminded to take tiny steps that compound into extraordinary results over time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" onClick={handleGetStarted} className="text-lg px-8">
                  Start Building Habits
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8"
                  onClick={() => Analytics.trackDemoRequest()}
                >
                  See How It Works
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                  Free to start
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                  Science-backed approach
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                  Proven results
                </div>
              </div>
            </div>
          </section>

          {/* The Science Behind Micro-Actions */}
          <section className="py-16 px-4" aria-labelledby="science-heading">
            <div className="container mx-auto max-w-4xl">
              <div className="text-center mb-12">
                <h2 id="science-heading" className="text-3xl font-bold mb-4">
                  Why Micro-Actions Work Better Than Big Goals
                </h2>
                <p className="text-lg text-muted-foreground">
                  Research shows that tiny, consistent actions create lasting change more effectively than dramatic
                  lifestyle overhauls.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <article className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Neuroplasticity</h3>
                  <p className="text-muted-foreground">
                    Small, repeated actions rewire your brain more effectively than sporadic big efforts.
                  </p>
                </article>

                <article className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Compound Effect</h3>
                  <p className="text-muted-foreground">
                    1% daily improvements compound into 37x better results over a year.
                  </p>
                </article>

                <article className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Lower Resistance</h3>
                  <p className="text-muted-foreground">
                    Tiny actions bypass mental resistance and make starting effortless.
                  </p>
                </article>
              </div>
            </div>
          </section>

          {/* What MindReMinder Is NOT */}
          <section className="py-16 px-4 bg-muted/30" aria-labelledby="what-not-heading">
            <div className="container mx-auto max-w-4xl">
              <div className="text-center mb-12">
                <h2 id="what-not-heading" className="text-3xl font-bold mb-4">
                  This Isn't Your Typical Reminder App
                </h2>
                <p className="text-lg text-muted-foreground">
                  We're not about managing tasks. We're about transforming lives through consistent micro-actions.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <article className="border-2 border-destructive/20 rounded-lg p-6 text-center">
                  <X className="w-12 h-12 text-destructive mx-auto mb-4" aria-hidden="true" />
                  <h3 className="font-semibold mb-2">Not a To-Do List</h3>
                  <p className="text-sm text-muted-foreground">
                    We don't manage your tasks. We help you build habits that create lasting change.
                  </p>
                </article>

                <article className="border-2 border-destructive/20 rounded-lg p-6 text-center">
                  <X className="w-12 h-12 text-destructive mx-auto mb-4" aria-hidden="true" />
                  <h3 className="font-semibold mb-2">Not a Calendar App</h3>
                  <p className="text-sm text-muted-foreground">
                    We don't schedule meetings. We remind you to take tiny steps toward your goals.
                  </p>
                </article>

                <article className="border-2 border-destructive/20 rounded-lg p-6 text-center">
                  <X className="w-12 h-12 text-destructive mx-auto mb-4" aria-hidden="true" />
                  <h3 className="font-semibold mb-2">Not Quick Fixes</h3>
                  <p className="text-sm text-muted-foreground">
                    We don't promise overnight success. We help you build sustainable, long-term change.
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
                  Everything You Need to Build Better Habits
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  MindReMinder combines behavioral science with smart technology to make habit formation effortless and
                  sustainable.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <article className="border-2 hover:border-primary/50 transition-colors rounded-lg p-6">
                  <Repeat className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-2">Micro-Action Reminders</h3>
                  <p className="text-muted-foreground">
                    Get reminded to take tiny, specific actions that build toward your bigger goals over time.
                  </p>
                </article>

                <article className="border-2 hover:border-primary/50 transition-colors rounded-lg p-6">
                  <Target className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-2">Habit Stacking</h3>
                  <p className="text-muted-foreground">
                    Link new micro-habits to existing routines for automatic behavior change.
                  </p>
                </article>

                <article className="border-2 hover:border-primary/50 transition-colors rounded-lg p-6">
                  <MapPin className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-2">Context-Based Triggers</h3>
                  <p className="text-muted-foreground">
                    Get reminded based on location, time, or other environmental cues for maximum effectiveness.
                  </p>
                </article>

                <article className="border-2 hover:border-primary/50 transition-colors rounded-lg p-6">
                  <Brain className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-2">Motivational Insights</h3>
                  <p className="text-muted-foreground">
                    Receive AI-generated quotes and insights tailored to your specific goals and challenges.
                  </p>
                </article>

                <article className="border-2 hover:border-primary/50 transition-colors rounded-lg p-6">
                  <Users className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-2">Accountability Partners</h3>
                  <p className="text-muted-foreground">
                    Share your micro-actions with friends for support and increased commitment.
                  </p>
                </article>

                <article className="border-2 hover:border-primary/50 transition-colors rounded-lg p-6">
                  <TrendingUp className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
                  <p className="text-muted-foreground">
                    Visualize your consistency and see how small actions compound into big results.
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
                  The MindReMinder Method
                </h2>
                <p className="text-lg text-muted-foreground">A proven 3-step process for lasting habit formation</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-foreground">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Break It Down</h3>
                  <p className="text-muted-foreground">
                    Transform big goals into tiny, specific micro-actions that take 2 minutes or less.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-foreground">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Get Reminded</h3>
                  <p className="text-muted-foreground">
                    Receive smart, contextual reminders that prompt you to take action at the perfect moment.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-foreground">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Build Momentum</h3>
                  <p className="text-muted-foreground">
                    Watch as consistent micro-actions compound into significant life changes over time.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Mobile App Section */}
          <section className="py-20 px-4" aria-labelledby="mobile-app-heading">
            <div className="container mx-auto max-w-4xl text-center">
              <h2 id="mobile-app-heading" className="text-3xl md:text-4xl font-bold mb-4">
                Take Your Habits Everywhere
              </h2>
              <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
                Get native mobile apps for iOS and Android to build habits on the go with push notifications and offline
                access.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" variant="outline" className="text-lg px-8" disabled>
                  <Apple className="mr-2 h-6 w-6" />
                  Download for iOS
                  <Badge variant="secondary" className="ml-2">
                    Coming Soon
                  </Badge>
                </Button>

                <Button size="lg" variant="outline" className="text-lg px-8" disabled>
                  <Play className="mr-2 h-6 w-6" />
                  Get on Android
                  <Badge variant="secondary" className="ml-2">
                    Coming Soon
                  </Badge>
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mt-6">
                Join our waitlist to be notified when the mobile apps launch
              </p>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-20 px-4 bg-muted/30" aria-labelledby="testimonials-heading">
            <div className="container mx-auto max-w-4xl">
              <div className="text-center mb-16">
                <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold mb-4">
                  Real People, Real Results
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
                    "I tried to meditate for years but always gave up. MindReMinder helped me start with just 30 seconds
                    a day. Now I meditate for 20 minutes daily and feel amazing!"
                  </blockquote>
                  <footer>
                    <div className="font-semibold">Sarah Johnson</div>
                    <div className="text-sm text-muted-foreground">Marketing Manager</div>
                  </footer>
                </article>

                <article className="rounded-lg p-6 border">
                  <div className="flex mb-4" aria-label="5 star rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-4">
                    "The micro-action approach is genius. Instead of 'write a book,' I get reminded to 'write one
                    sentence.' I've written 3 chapters in 2 months!"
                  </blockquote>
                  <footer>
                    <div className="font-semibold">Michael Chen</div>
                    <div className="text-sm text-muted-foreground">Aspiring Author</div>
                  </footer>
                </article>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 bg-primary text-primary-foreground">
            <div className="container mx-auto text-center max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Life-Changing Habits?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of people who've discovered the power of micro-actions to create lasting change in their
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
                Start Your Transformation Today
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
                    Build life-changing habits through the power of micro-actions and consistent reminders.
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
                      <a href="#mobile-app" className="hover:text-foreground">
                        Mobile App
                      </a>
                    </li>
                    <li>
                      <a href="/dashboard" className="hover:text-foreground">
                        Web App
                      </a>
                    </li>
                    <li>
                      <Link href="/resources" className="hover:text-foreground">
                        Resources
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Learn</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      <Link href="/resources" className="hover:text-foreground">
                        Habit Science
                      </Link>
                    </li>
                    <li>
                      <Link href="/resources#guides" className="hover:text-foreground">
                        How-to Guides
                      </Link>
                    </li>
                    <li>
                      <Link href="/resources#examples" className="hover:text-foreground">
                        Micro-Action Examples
                      </Link>
                    </li>
                    <li>
                      <a href="/blog" className="hover:text-foreground">
                        Blog
                      </a>
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
                      <Link href="/contact" className="hover:text-foreground">
                        Contact
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
                <p>
                  &copy; 2025 MindReMinder. All rights reserved. Built with ❤️ for lasting change through micro-actions.
                </p>
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

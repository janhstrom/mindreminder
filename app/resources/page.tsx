"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  Target,
  Brain,
  TrendingUp,
  Clock,
  Users,
  Lightbulb,
  ArrowRight,
  ExternalLink,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">MR</span>
            </div>
            <h1 className="text-xl font-bold text-primary">MindReMinder</h1>
          </Link>

          <nav className="flex items-center space-x-4">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <BookOpen className="w-3 h-3 mr-1" />
              Evidence-Based Resources
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Master the Science of Habit Formation</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Learn the research-backed strategies and techniques that make micro-actions so powerful for creating
              lasting change.
            </p>
          </div>

          {/* The Science Section */}
          <section className="mb-20" id="science">
            <h2 className="text-3xl font-bold mb-8 text-center">The Science Behind Micro-Actions</h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <Brain className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Neuroplasticity & Habit Formation</CardTitle>
                  <CardDescription>How small actions rewire your brain</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Research shows that repeated micro-actions create stronger neural pathways than sporadic large
                    efforts. The brain's plasticity responds better to consistent, small stimuli.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Myelin sheath strengthening through repetition</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Reduced cognitive load for habit execution</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Automatic behavior pattern development</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>The Compound Effect</CardTitle>
                  <CardDescription>Why 1% improvements matter</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Mathematical principle showing how small, consistent improvements compound exponentially over time.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg mb-4">
                    <p className="text-sm font-mono">
                      1.01^365 = 37.78
                      <br />
                      0.99^365 = 0.03
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      1% better every day for a year = 37x improvement
                    </p>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Exponential growth through consistency</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Momentum builds over time</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-6 h-6 text-primary mr-2" />
                  Key Research Findings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">66-Day Rule</h4>
                    <p className="text-sm text-muted-foreground">
                      On average, it takes 66 days for a new behavior to become automatic (University College London
                      study).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">2-Minute Rule</h4>
                    <p className="text-sm text-muted-foreground">
                      Habits should take less than 2 minutes to complete to maximize consistency and reduce resistance.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Context Dependency</h4>
                    <p className="text-sm text-muted-foreground">
                      Environmental cues are more powerful than willpower for triggering habitual behaviors.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* How-to Guides Section */}
          <section className="mb-20" id="guides">
            <h2 className="text-3xl font-bold mb-8 text-center">Step-by-Step Guides</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Target className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Breaking Down Big Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Learn how to decompose overwhelming goals into manageable micro-actions.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Read Guide <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Clock className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Habit Stacking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Attach new micro-habits to existing routines for automatic execution.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Read Guide <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Accountability Systems</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Build support networks that increase your commitment and success rate.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Read Guide <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Micro-Action Examples */}
          <section className="mb-20" id="examples">
            <h2 className="text-3xl font-bold mb-8 text-center">Micro-Action Examples by Category</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Health & Fitness</CardTitle>
                  <CardDescription>Start small, build momentum</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Do 1 push-up</p>
                        <p className="text-xs text-muted-foreground">Instead of "exercise for 30 minutes"</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Drink one glass of water</p>
                        <p className="text-xs text-muted-foreground">Instead of "drink 8 glasses daily"</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Take 3 deep breaths</p>
                        <p className="text-xs text-muted-foreground">Instead of "meditate for 20 minutes"</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Learning & Growth</CardTitle>
                  <CardDescription>Knowledge compounds daily</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Read one paragraph</p>
                        <p className="text-xs text-muted-foreground">Instead of "read for 1 hour"</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Write one sentence</p>
                        <p className="text-xs text-muted-foreground">Instead of "write 1000 words"</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Practice one chord</p>
                        <p className="text-xs text-muted-foreground">Instead of "practice guitar for 30 minutes"</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Relationships</CardTitle>
                  <CardDescription>Small gestures, big impact</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Send one appreciation text</p>
                        <p className="text-xs text-muted-foreground">Instead of "be more social"</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Ask one meaningful question</p>
                        <p className="text-xs text-muted-foreground">Instead of "have deeper conversations"</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Give one genuine compliment</p>
                        <p className="text-xs text-muted-foreground">Instead of "be more positive"</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Productivity</CardTitle>
                  <CardDescription>Progress over perfection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Clear one item from desk</p>
                        <p className="text-xs text-muted-foreground">Instead of "organize entire workspace"</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Write down one priority</p>
                        <p className="text-xs text-muted-foreground">Instead of "plan entire week"</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Delete one unnecessary email</p>
                        <p className="text-xs text-muted-foreground">Instead of "achieve inbox zero"</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Recommended Reading */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">Recommended Reading</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Atomic Habits</CardTitle>
                  <CardDescription>by James Clear</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    The definitive guide to building good habits and breaking bad ones through tiny changes.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Book <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">The Power of Habit</CardTitle>
                  <CardDescription>by Charles Duhigg</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Explores the science behind why habits exist and how they can be changed.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Book <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Tiny Habits</CardTitle>
                  <CardDescription>by BJ Fogg</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    The small changes that change everything, based on 20 years of research at Stanford.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Book <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center bg-primary/5 rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Apply What You've Learned?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start building your first micro-habit today with MindReMinder's intelligent reminder system.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8">
                Start Building Habits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </section>
        </div>
      </main>
    </div>
  )
}

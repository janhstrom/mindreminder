"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Bell, Target, Heart, Brain, TrendingUp, CheckCircle, ArrowRight, Star, Users, Zap } from "lucide-react"

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // For now, just redirect to dashboard
    router.push("/dashboard")
  }

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
            <p className="text-center text-gray-600">
              {isLogin ? "Sign in to MindReMinder" : "Join MindReMinder today"}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Need an account? Sign up" : "Have an account? Sign in"}
              </Button>
            </div>

            <div className="mt-4 text-center">
              <Button variant="ghost" onClick={() => setShowLogin(false)}>
                ← Back to homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MindReMinder</h1>
                <p className="text-xs text-gray-500">Build Better Habits</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowLogin(true)
                  setIsLogin(true)
                }}
              >
                Sign In
              </Button>
              <Button
                onClick={() => {
                  setShowLogin(true)
                  setIsLogin(false)
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
              <Zap className="w-4 h-4 mr-2" />
              Transform Your Life with Micro-Actions
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8">
              Build Better
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Habits Daily
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your life through gentle reminders, micro-actions, and AI-powered motivation. Start small, think
              big, achieve extraordinary results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => {
                  setShowLogin(true)
                  setIsLogin(false)
                }}
              >
                Start Building Habits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Free forever
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Science-backed
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                10,000+ users
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to make habit building effortless, sustainable, and actually enjoyable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Micro-Actions",
                description: "Break big goals into tiny 30-second actions that build unstoppable momentum.",
                color: "blue",
              },
              {
                icon: Bell,
                title: "Smart Reminders",
                description: "Gentle, perfectly-timed nudges that arrive when you need them most.",
                color: "purple",
              },
              {
                icon: Brain,
                title: "AI Motivation",
                description: "Personalized quotes and insights powered by AI to keep you inspired.",
                color: "green",
              },
              {
                icon: TrendingUp,
                title: "Progress Tracking",
                description: "Beautiful visualizations of your streaks, growth, and achievements.",
                color: "orange",
              },
              {
                icon: Users,
                title: "Accountability",
                description: "Share your journey with friends and build habits together.",
                color: "red",
              },
              {
                icon: Heart,
                title: "Mindful Approach",
                description: "Focus on self-compassion and sustainable growth, not perfection.",
                color: "pink",
              },
            ].map((feature, index) => (
              <Card key={index} className="border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mb-6`}
                  >
                    <feature.icon className={`w-8 h-8 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Real People, Real Results</h2>
            <p className="text-xl text-gray-600">
              See how MindReMinder is transforming lives, one micro-action at a time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Marketing Manager",
                content:
                  "I tried to meditate for years but always gave up. MindReMinder helped me start with just 30 seconds a day. Now I meditate for 20 minutes daily!",
                rating: 5,
              },
              {
                name: "Michael Chen",
                role: "Software Developer",
                content:
                  "The micro-action approach is genius. Instead of 'write a book,' I get reminded to 'write one sentence.' I've written 3 chapters in 2 months!",
                rating: 5,
              },
              {
                name: "Emma Davis",
                role: "Teacher",
                content:
                  "Finally, a habit app that doesn't make me feel guilty! The gentle reminders and progress tracking keep me motivated without the pressure.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</blockquote>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to Transform Your Life?</h2>
          <p className="text-xl text-blue-100 mb-12 leading-relaxed">
            Join thousands of people who've discovered the power of micro-actions to create lasting change. Start your
            transformation today – it's completely free.
          </p>

          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-12 py-4 bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => {
              setShowLogin(true)
              setIsLogin(false)
            }}
          >
            Start Your Journey Today
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>

          <p className="text-blue-200 mt-6">Free forever • No credit card required • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-2xl font-bold text-white">MindReMinder</span>
            </div>
            <p className="text-gray-400 mb-8">
              Build life-changing habits through the power of micro-actions and gentle reminders.
            </p>
            <p className="text-gray-500">© 2025 MindReMinder. Built with ❤️ for lasting change through micro-actions.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { useRouter } from "next/navigation"
import { Bell, Target, Heart, Brain, Smartphone, TrendingUp, CheckCircle, ArrowRight } from "lucide-react"

export default function HomePage() {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const router = useRouter()

  const handleAuthSuccess = () => {
    router.push("/dashboard")
  }

  const handleGetStarted = () => {
    setShowAuth(true)
    setIsLoginMode(false)
  }

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {isLoginMode ? (
            <LoginForm onLogin={handleAuthSuccess} onToggleMode={() => setIsLoginMode(false)} />
          ) : (
            <RegisterForm onRegister={handleAuthSuccess} onToggleMode={() => setIsLoginMode(true)} />
          )}
          <div className="text-center mt-4">
            <Button variant="ghost" onClick={() => setShowAuth(false)}>
              ← Back to homepage
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MR</span>
            </div>
            <h1 className="text-xl font-bold text-blue-600">MindReMinder</h1>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => {
                setShowAuth(true)
                setIsLoginMode(true)
              }}
            >
              Sign In
            </Button>
            <Button
              onClick={() => {
                setShowAuth(true)
                setIsLoginMode(false)
              }}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
            <Target className="w-3 h-3 mr-1" />
            Habit Formation & Micro-Actions
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            Build Life-Changing
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Habits</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your life with gentle reminders, micro-actions, and AI-powered motivation. Start small, think big,
            achieve more.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={handleGetStarted} className="text-lg px-8">
              Start Building Habits
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              See How It Works
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
              Free to start
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
              Science-backed
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
              Proven results
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Everything You Need to Build Better Habits
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make habit building effortless and sustainable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardContent className="p-6">
                <Target className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Micro-Actions</h3>
                <p className="text-gray-600">
                  Break down big goals into tiny, manageable actions. Build momentum with 30-second habits that stick.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardContent className="p-6">
                <Bell className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Smart Reminders</h3>
                <p className="text-gray-600">
                  Gentle, context-aware notifications that arrive at the perfect moment to keep you on track.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardContent className="p-6">
                <Brain className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">AI Motivation</h3>
                <p className="text-gray-600">
                  Personalized quotes, insights, and encouragement powered by AI to keep you inspired daily.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-200 transition-colors">
              <CardContent className="p-6">
                <TrendingUp className="w-12 h-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Progress Tracking</h3>
                <p className="text-gray-600">
                  Visual streaks, completion rates, and insights to see your growth and celebrate wins.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-red-200 transition-colors">
              <CardContent className="p-6">
                <Heart className="w-12 h-12 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Mindful Approach</h3>
                <p className="text-gray-600">
                  Focus on self-compassion and sustainable growth rather than perfectionism and pressure.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-yellow-200 transition-colors">
              <CardContent className="p-6">
                <Smartphone className="w-12 h-12 text-yellow-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Mobile Ready</h3>
                <p className="text-gray-600">
                  Designed for your phone with offline support, quick actions, and seamless synchronization.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Transform Your Habits?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands who are building better lives, one micro-action at a time.
          </p>

          <Button size="lg" variant="secondary" onClick={handleGetStarted} className="text-lg px-8">
            Start Your Transformation Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <p className="text-sm mt-4 text-blue-200">Free forever. No credit card required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t bg-gray-50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">MR</span>
            </div>
            <span className="font-bold text-blue-600">MindReMinder</span>
          </div>
          <p className="text-sm text-gray-600">
            &copy; 2025 MindReMinder. Built with ❤️ for lasting change through micro-actions.
          </p>
        </div>
      </footer>
    </div>
  )
}

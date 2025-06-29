import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Brain, CheckSquare, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-blue-600 rounded-full">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">MindReMinder</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your personal reminder and micro-action tracker. Stay organized, build habits, and achieve your goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckSquare className="h-6 w-6 text-blue-600" />
                <CardTitle>Smart Reminders</CardTitle>
              </div>
              <CardDescription>
                Never forget important tasks with intelligent reminders that adapt to your schedule.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Set up reminders for anything from daily habits to important deadlines. Our smart system learns your
                patterns and helps you stay on track.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Zap className="h-6 w-6 text-green-600" />
                <CardTitle>Micro Actions</CardTitle>
              </div>
              <CardDescription>
                Break down big goals into small, manageable actions you can complete in minutes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Transform overwhelming projects into bite-sized tasks. Build momentum with quick wins that compound over
                time.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link href="/app">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

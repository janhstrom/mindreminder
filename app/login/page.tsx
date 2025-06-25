"use client"

import { useFormStatus } from "react-dom"
import { signIn } from "@/lib/auth/actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useSearchParams } from "next/navigation" // To read error messages from URL

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" aria-disabled={pending} disabled={pending}>
      {pending ? "Signing In..." : "Sign In"}
    </Button>
  )
}

export default function LoginPage() {
  // The `signIn` server action is expected to redirect on success,
  // or redirect with an error message on failure.
  // For more complex state from the action, useFormState's first argument would be the action,
  // and the second an initial state. Here, we'll rely on URL messages for simplicity.
  // If `signIn` were to return state, it would look like:
  // const [state, dispatch] = useFormState(signIn, undefined);

  const searchParams = useSearchParams()
  const errorMessage = searchParams.get("message")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">MindReMinder</span>
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <p className="text-gray-600">Sign in to your account</p>
          </CardHeader>
          <CardContent>
            {/* The form action now directly calls the server action */}
            <form action={signIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required placeholder="Enter your password" />
              </div>

              {errorMessage && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              <SubmitButton />
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
            <div className="mt-4 text-center">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  ← Back to homepage
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useFormStatus } from "react-dom"
import { signUp } from "@/lib/auth/actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useSearchParams } from "next/navigation" // To read messages from URL

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" aria-disabled={pending} disabled={pending}>
      {pending ? "Creating Account..." : "Create Account"}
    </Button>
  )
}

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message") // Can be error or success message

  // Determine if the message is an error based on its content (simple check)
  // A more robust way would be for the server action to return a structured state via useFormState
  const isError = message && !message.toLowerCase().includes("check email")

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
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <p className="text-gray-600">Join MindReMinder today</p>
          </CardHeader>
          <CardContent>
            <form action={signUp} className="space-y-4">
              {/* 
                For first_name and last_name, ensure your signUp server action
                and your 'profiles' table setup can handle these.
                The current `signUp` action in `lib/auth/actions.ts` only takes email/password.
                You'd need to modify it to accept and process these additional fields,
                likely by creating a profile entry after successful Supabase auth.signUp.
                For now, these fields will be submitted but not used by the current `signUp` action.
              */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" required placeholder="First name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" required placeholder="Last name" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Create a password"
                  minLength={6}
                />
              </div>

              {message && (
                <Alert variant={isError ? "destructive" : "default"}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              <SubmitButton />
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign in
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

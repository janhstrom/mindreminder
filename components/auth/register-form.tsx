"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Analytics } from "@/lib/analytics"
import { SupabaseAuthService } from "@/lib/auth-supabase"
import type { AuthUser } from "@/lib/auth-supabase"
import { CheckCircle, Mail } from "lucide-react"

interface RegisterFormProps {
  onRegister: (user: AuthUser) => void
  onToggleMode: () => void
}

export function RegisterForm({ onRegister, onToggleMode }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const user = await SupabaseAuthService.getInstance().signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
      )

      // Check if email confirmation is required
      if (!user.emailConfirmed) {
        setNeedsConfirmation(true)
        setSuccess(
          "Account created! Please check your email and click the verification link to complete your registration.",
        )
        return
      }

      Analytics.trackSignUp("email")
      Analytics.setUserProperties({
        user_type: "free",
        signup_method: "email",
        user_id: user.id,
      })
      onRegister(user)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed"
      if (errorMessage.includes("email") && errorMessage.includes("confirm")) {
        setNeedsConfirmation(true)
        setSuccess(
          "Account created! Please check your email and click the verification link to complete your registration.",
        )
      } else {
        setError(errorMessage)
      }
      Analytics.trackError("registration_error", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    try {
      setIsLoading(true)
      await SupabaseAuthService.getInstance().resendConfirmation(formData.email)
      setSuccess("Confirmation email sent! Please check your inbox.")
    } catch (err) {
      setError("Failed to resend confirmation email")
    } finally {
      setIsLoading(false)
    }
  }

  if (needsConfirmation) {
    return (
      <Card className="w-full max-w-md border-0 shadow-none">
        <CardContent className="pt-0">
          <div className="text-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary">Check Your Email</h2>
            <p className="text-muted-foreground">We've sent a verification link to {formData.email}</p>
          </div>

          <Alert className="mb-4">
            <Mail className="h-4 w-4" />
            <AlertDescription>
              Click the link in your email to verify your account and complete registration.
            </AlertDescription>
          </Alert>

          {success && (
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-600">{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Button onClick={handleResendConfirmation} variant="outline" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Resend Confirmation Email"}
            </Button>

            <Button variant="link" onClick={onToggleMode} className="w-full">
              Already verified? Sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-none">
      <CardContent className="pt-0">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Create Account</h2>
          <p className="text-muted-foreground">Join MindReMinder to start building better habits</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a secure password"
              minLength={6}
            />
            <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-600">{success}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full mt-4"
          onClick={async () => {
            try {
              await SupabaseAuthService.getInstance().signInWithGoogle()
            } catch (err) {
              setError("Google sign-up failed")
            }
          }}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </Button>
        <div className="mt-4 text-center">
          <Button variant="link" onClick={onToggleMode}>
            Already have an account? Sign in
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

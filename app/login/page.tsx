"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/auth/login-form"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" aria-disabled={pending} disabled={pending}>
      {pending ? "Signing In..." : "Sign In"}
    </Button>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}

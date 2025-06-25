"use server"

import { cookies } from "next/headers" // Import cookies
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server" // Correct path

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const cookieStore = cookies() // Get cookie store
  const supabase = createClient(cookieStore) // Pass cookie store

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // It's better to return an error message to the form than to redirect with query params for Server Actions
    // For now, keeping redirect for simplicity, but this can be improved with useFormState
    return redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  revalidatePath("/", "layout") // Revalidate all paths
  return redirect("/dashboard")
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const cookieStore = cookies() // Get cookie store
  const supabase = createClient(cookieStore) // Pass cookie store

  // Construct the redirect URL carefully
  const redirectTo = new URL("/auth/callback", process.env.NEXT_PUBLIC_BASE_URL).toString()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
    },
  })

  if (error) {
    return redirect(`/register?message=${encodeURIComponent(error.message)}`)
  }

  return redirect("/register?message=Check email to continue sign up process")
}

export async function signOut() {
  const cookieStore = cookies() // Get cookie store
  const supabase = createClient(cookieStore) // Pass cookie store
  await supabase.auth.signOut()
  revalidatePath("/", "layout") // Revalidate all paths
  return redirect("/login")
}

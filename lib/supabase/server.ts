import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies as nextCookies } from "next/headers"

// Don’t make this a singleton — each server request must have its own isolated Supabase client.
export function createClient() {
  const cookieStore = nextCookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch {
          // called from a React Server Component or edge runtime – safe to ignore
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch {
          // same – safe to ignore in RSCs
        }
      },
    },
  })
}
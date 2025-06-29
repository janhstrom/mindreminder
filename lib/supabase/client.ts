import { createBrowserClient } from "@supabase/ssr"

let supabase: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables")
    }

    supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }

  return supabase
}
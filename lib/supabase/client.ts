import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./types"

let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  // Return existing client if it exists
  if (supabaseClient) {
    return supabaseClient
  }

  // Create new client only if we don't have one
  supabaseClient = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  return supabaseClient
}

// Export a function that always returns the same instance
export const supabase = createClient()

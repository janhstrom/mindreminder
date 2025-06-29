import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./types"

let client: ReturnType<typeof createBrowserClient<Database>> | undefined

export function createClient() {
  if (typeof window === "undefined") {
    // Return a dummy client for SSR
    return null as any
  }

  if (!client) {
    client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }

  return client
}

// Export the singleton instance that your existing code expects
export const supabase = createClient()

// Export default for compatibility
export default createClient

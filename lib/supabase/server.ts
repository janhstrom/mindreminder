import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies as nextCookies } from "next/headers"

/**
 * Server-side Supabase helper (RSC-safe)
 *
 *  • reads the cookie store only once – no promises in render phase
 *  • provides explicit get / set / remove so createServerClient never
 *    calls `cookies()` by itself (which would suspend).
 */
export function createClient() {
  // `cookies()` is sync; call it once and re-use.
  const cookieStore = nextCookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch {
          /* called from a RSC – ignore */
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch {
          /* called from a RSC – ignore */
        }
      },
    },
  })
}

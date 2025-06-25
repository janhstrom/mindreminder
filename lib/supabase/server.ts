import { createServerClient, type CookieOptions } from "@supabase/ssr"
// Remove: import { cookies } from "next/headers"
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

// The createClient function now accepts the cookieStore as an argument
export function createClient(cookieStore: ReadonlyRequestCookies) {
  // Remove: const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
          // Updated to use the passed-in cookieStore
          cookieStore.set(name, value, options)
        } catch (error) {
          // Log error for debugging if needed
          // console.error('Error setting cookie in createServerClient (set):', error);
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
          // Updated to use the passed-in cookieStore
          cookieStore.set(name, "", options)
        } catch (error) {
          // Log error for debugging if needed
          // console.error('Error setting cookie in createServerClient (remove):', error);
        }
      },
    },
  })
}

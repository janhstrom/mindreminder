// lib/supabase/server.ts

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "./types"; // Optional! Only if you generated Supabase types

export function createClient() {
  return createServerComponentClient<Database>({ cookies: cookies() });
}
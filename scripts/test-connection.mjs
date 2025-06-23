import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" })

async function testConnection() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log("🔍 Checking environment variables...")
    console.log("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✅ Set" : "❌ Missing")
    console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseKey ? "✅ Set" : "❌ Missing")

    if (!supabaseUrl || !supabaseKey) {
      console.error("\n❌ Missing Supabase environment variables")
      console.log("\n📝 Please ensure you have a .env.local file with:")
      console.log("NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url")
      console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key")
      console.log("\n💡 You can find these values in your Supabase project settings")
      return
    }

    console.log("\n🔗 Testing Supabase connection...")
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Test connection by checking tables
    const { data: tables, error } = await supabase.from("profiles").select("count", { count: "exact", head: true })

    if (error) {
      console.error("❌ Database connection failed:", error.message)
    } else {
      console.log("✅ Database connection successful!")
      console.log("✅ Profiles table accessible")
    }

    console.log("\n🎉 Connection test completed!")
  } catch (error) {
    console.error("❌ Connection test failed:", error)
  }
}

testConnection()

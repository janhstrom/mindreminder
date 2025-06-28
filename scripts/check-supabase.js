// Check Supabase connection (requires dotenv)
const fs = require("fs")
const path = require("path")

console.log("🔍 Checking Supabase setup...")

// Check if .env.local exists
const envPath = path.join(process.cwd(), ".env.local")
if (!fs.existsSync(envPath)) {
  console.log("❌ .env.local file not found!")
  console.log("\n📝 Create .env.local with:")
  console.log("NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co")
  console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here")
  process.exit(1)
}

// Try to install and use dotenv
try {
  require("dotenv").config({ path: ".env.local" })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("Environment variables:")
  console.log("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✅ Set" : "❌ Missing")
  console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseKey ? "✅ Set" : "❌ Missing")

  if (supabaseUrl && supabaseKey) {
    console.log("\n🎉 Supabase credentials are configured!")
    console.log("You can now run the database scripts in Supabase SQL Editor")
  }
} catch (error) {
  console.log("❌ dotenv not installed. Run: npm install dotenv")
  console.log("Error:", error.message)
}

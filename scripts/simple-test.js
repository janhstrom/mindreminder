// Simple test to check if Node.js and your project setup works
console.log("🚀 Node.js is working!")
console.log("📁 Current directory:", process.cwd())
console.log("📦 Node.js version:", process.version)

// Check if .env.local exists
const fs = require("fs")
const path = require("path")

const envPath = path.join(process.cwd(), ".env.local")
const envExists = fs.existsSync(envPath)

console.log("\n📄 Environment file check:")
console.log(".env.local exists:", envExists ? "✅ Yes" : "❌ No")

if (envExists) {
  // Try to load environment variables manually
  const envContent = fs.readFileSync(envPath, "utf8")
  const hasSupabaseUrl = envContent.includes("NEXT_PUBLIC_SUPABASE_URL")
  const hasSupabaseKey = envContent.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY")

  console.log("NEXT_PUBLIC_SUPABASE_URL:", hasSupabaseUrl ? "✅ Found" : "❌ Missing")
  console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", hasSupabaseKey ? "✅ Found" : "❌ Missing")
} else {
  console.log("❌ You need to create .env.local with your Supabase credentials")
  console.log("\n📝 Create .env.local with:")
  console.log("NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co")
  console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here")
}

console.log("\n✅ Basic test completed!")

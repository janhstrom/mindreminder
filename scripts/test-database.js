// Test database operations
const { createClient } = require("@supabase/supabase-js")
require("dotenv").config({ path: ".env.local" })

async function testDatabase() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.log("❌ Missing environment variables")
      return
    }

    console.log("🔗 Testing Supabase database...")
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Test 1: Check if tables exist
    console.log("\n📋 Testing table access...")

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("count", { count: "exact", head: true })

    if (profilesError) {
      console.log("❌ Profiles table:", profilesError.message)
    } else {
      console.log("✅ Profiles table accessible")
    }

    const { data: reminders, error: remindersError } = await supabase
      .from("reminders")
      .select("count", { count: "exact", head: true })

    if (remindersError) {
      console.log("❌ Reminders table:", remindersError.message)
    } else {
      console.log("✅ Reminders table accessible")
    }

    const { data: friends, error: friendsError } = await supabase
      .from("friends")
      .select("count", { count: "exact", head: true })

    if (friendsError) {
      console.log("❌ Friends table:", friendsError.message)
    } else {
      console.log("✅ Friends table accessible")
    }

    const { data: analytics, error: analyticsError } = await supabase
      .from("user_events")
      .select("count", { count: "exact", head: true })

    if (analyticsError) {
      console.log("❌ Analytics table:", analyticsError.message)
    } else {
      console.log("✅ Analytics table accessible")
    }

    // Test 2: Try inserting a test analytics event
    console.log("\n📊 Testing analytics insert...")
    const { data: insertData, error: insertError } = await supabase
      .from("user_events")
      .insert({
        event_name: "database_test",
        event_properties: { test: true, timestamp: new Date().toISOString() },
      })
      .select()

    if (insertError) {
      console.log("❌ Analytics insert failed:", insertError.message)
    } else {
      console.log("✅ Analytics insert successful")
    }

    console.log("\n🎉 Database test completed!")
  } catch (error) {
    console.error("❌ Database test failed:", error.message)
  }
}

testDatabase()

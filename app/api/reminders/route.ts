import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: reminders, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching reminders:", error)
      return NextResponse.json({ error: "Failed to fetch reminders" }, { status: 500 })
    }

    return NextResponse.json({ reminders: reminders || [] })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, image, scheduledTime, location, isActive } = body

    const { data: reminder, error } = await supabase
      .from("reminders")
      .insert({
        user_id: user.id,
        title,
        description: description || null,
        image: image || null,
        scheduled_time: scheduledTime ? new Date(scheduledTime).toISOString() : null,
        location: location || null,
        is_active: isActive !== undefined ? isActive : true,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating reminder:", error)
      return NextResponse.json({ error: "Failed to create reminder" }, { status: 500 })
    }

    return NextResponse.json({ reminder })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

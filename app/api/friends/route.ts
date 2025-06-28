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

    const { data: friends, error } = await supabase
      .from("friends")
      .select(`
        id,
        user_id,
        friend_id,
        status,
        created_at,
        updated_at,
        friend_profile:profiles!friend_id(
          first_name,
          last_name,
          email,
          profile_image
        )
      `)
      .eq("user_id", user.id)
      .eq("status", "accepted")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching friends:", error)
      return NextResponse.json({ error: "Failed to fetch friends" }, { status: 500 })
    }

    const formattedFriends = (friends || []).map((friend: any) => ({
      id: friend.id,
      userId: friend.user_id,
      friendId: friend.friend_id,
      status: friend.status,
      createdAt: friend.created_at,
      updatedAt: friend.updated_at,
      firstName: friend.friend_profile?.first_name || "N/A",
      lastName: friend.friend_profile?.last_name || "",
      email: friend.friend_profile?.email || "N/A",
      profileImage: friend.friend_profile?.profile_image,
    }))

    return NextResponse.json({ friends: formattedFriends })
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
    const { friendEmail } = body

    if (!friendEmail) {
      return NextResponse.json({ error: "Friend email is required" }, { status: 400 })
    }

    // Find the user by email
    const { data: friendProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", friendEmail)
      .single()

    if (profileError || !friendProfile) {
      return NextResponse.json({ error: "User not found with that email address" }, { status: 404 })
    }

    if (friendProfile.id === user.id) {
      return NextResponse.json({ error: "You cannot send a friend request to yourself" }, { status: 400 })
    }

    // Check if friendship already exists
    const { data: existingFriend } = await supabase
      .from("friends")
      .select("id, status")
      .or(
        `and(user_id.eq.${user.id},friend_id.eq.${friendProfile.id}),and(user_id.eq.${friendProfile.id},friend_id.eq.${user.id})`,
      )
      .single()

    if (existingFriend) {
      if (existingFriend.status === "accepted") {
        return NextResponse.json({ error: "You are already friends with this user" }, { status: 400 })
      } else if (existingFriend.status === "pending") {
        return NextResponse.json({ error: "Friend request already sent" }, { status: 400 })
      }
    }

    // Send friend request
    const { data: friendRequest, error } = await supabase
      .from("friends")
      .insert({
        user_id: user.id,
        friend_id: friendProfile.id,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Error sending friend request:", error)
      return NextResponse.json({ error: "Failed to send friend request" }, { status: 500 })
    }

    return NextResponse.json({ message: "Friend request sent successfully", friendRequest })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

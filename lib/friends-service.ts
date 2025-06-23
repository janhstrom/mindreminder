"use client"

import { supabase } from "./supabase"
import type { Database } from "./supabase"

type FriendRow = Database["public"]["Tables"]["friends"]["Row"]
type SharedReminderRow = Database["public"]["Tables"]["shared_reminders"]["Row"]
type NotificationRow = Database["public"]["Tables"]["friend_notifications"]["Row"]

export interface Friend {
  id: string
  userId: string
  friendId: string
  status: "pending" | "accepted" | "blocked"
  createdAt: Date
  updatedAt: Date
  // Profile info
  firstName: string
  lastName: string
  email: string
  profileImage?: string
}

export interface FriendRequest {
  id: string
  fromUserId: string
  toUserId: string
  status: "pending" | "accepted" | "blocked"
  createdAt: Date
  // Sender profile info
  fromFirstName: string
  fromLastName: string
  fromEmail: string
  fromProfileImage?: string
}

export interface SharedReminder {
  id: string
  reminderId: string
  sharedBy: string
  sharedWith: string
  message?: string
  isRead: boolean
  createdAt: Date
  // Reminder details
  reminderTitle: string
  reminderDescription?: string
  reminderImage?: string
  // Sharer profile
  sharerFirstName: string
  sharerLastName: string
}

export interface FriendNotification {
  id: string
  userId: string
  fromUserId: string
  type: "friend_request" | "friend_accepted" | "reminder_shared"
  title: string
  message: string
  isRead: boolean
  metadata: Record<string, any>
  createdAt: Date
}

export class FriendsService {
  private static instance: FriendsService

  static getInstance(): FriendsService {
    if (!FriendsService.instance) {
      FriendsService.instance = new FriendsService()
    }
    return FriendsService.instance
  }

  // Friend Management
  async getFriends(userId: string): Promise<Friend[]> {
    const { data, error } = await supabase
      .from("friends")
      .select(`
        *,
        friend_profile:profiles!friends_friend_id_fkey(
          first_name,
          last_name,
          email,
          profile_image
        )
      `)
      .eq("user_id", userId)
      .eq("status", "accepted")
      .order("created_at", { ascending: false })

    if (error) throw error

    return data.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      friendId: row.friend_id,
      status: row.status,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      firstName: row.friend_profile.first_name,
      lastName: row.friend_profile.last_name,
      email: row.friend_profile.email,
      profileImage: row.friend_profile.profile_image,
    }))
  }

  async getFriendRequests(userId: string): Promise<FriendRequest[]> {
    const { data, error } = await supabase
      .from("friends")
      .select(`
        *,
        sender_profile:profiles!friends_user_id_fkey(
          first_name,
          last_name,
          email,
          profile_image
        )
      `)
      .eq("friend_id", userId)
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    if (error) throw error

    return data.map((row: any) => ({
      id: row.id,
      fromUserId: row.user_id,
      toUserId: row.friend_id,
      status: row.status,
      createdAt: new Date(row.created_at),
      fromFirstName: row.sender_profile.first_name,
      fromLastName: row.sender_profile.last_name,
      fromEmail: row.sender_profile.email,
      fromProfileImage: row.sender_profile.profile_image,
    }))
  }

  async sendFriendRequest(userId: string, friendEmail: string): Promise<void> {
    // First, find the user by email
    const { data: friendProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", friendEmail)
      .single()

    if (profileError || !friendProfile) {
      throw new Error("User not found with that email address")
    }

    if (friendProfile.id === userId) {
      throw new Error("You cannot send a friend request to yourself")
    }

    // Check if friendship already exists
    const { data: existingFriend, error: checkError } = await supabase
      .from("friends")
      .select("id, status")
      .or(
        `and(user_id.eq.${userId},friend_id.eq.${friendProfile.id}),and(user_id.eq.${friendProfile.id},friend_id.eq.${userId})`,
      )
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError
    }

    if (existingFriend) {
      if (existingFriend.status === "accepted") {
        throw new Error("You are already friends with this user")
      } else if (existingFriend.status === "pending") {
        throw new Error("Friend request already sent")
      } else if (existingFriend.status === "blocked") {
        throw new Error("Cannot send friend request to this user")
      }
    }

    // Send friend request
    const { error } = await supabase.from("friends").insert({
      user_id: userId,
      friend_id: friendProfile.id,
      status: "pending",
    })

    if (error) throw error
  }

  async acceptFriendRequest(userId: string, requestId: string): Promise<void> {
    const { error } = await supabase
      .from("friends")
      .update({ status: "accepted" })
      .eq("id", requestId)
      .eq("friend_id", userId)

    if (error) throw error
  }

  async declineFriendRequest(userId: string, requestId: string): Promise<void> {
    const { error } = await supabase.from("friends").delete().eq("id", requestId).eq("friend_id", userId)

    if (error) throw error
  }

  async removeFriend(userId: string, friendId: string): Promise<void> {
    // Remove both directions of the friendship
    const { error } = await supabase
      .from("friends")
      .delete()
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)

    if (error) throw error
  }

  // Reminder Sharing
  async shareReminder(reminderId: string, sharedBy: string, sharedWith: string, message?: string): Promise<void> {
    const { error } = await supabase.from("shared_reminders").insert({
      reminder_id: reminderId,
      shared_by: sharedBy,
      shared_with: sharedWith,
      message,
    })

    if (error) throw error

    // Create notification
    const { data: sharerProfile } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", sharedBy)
      .single()

    const { data: reminderData } = await supabase.from("reminders").select("title").eq("id", reminderId).single()

    if (sharerProfile && reminderData) {
      await supabase.from("friend_notifications").insert({
        user_id: sharedWith,
        from_user_id: sharedBy,
        type: "reminder_shared",
        title: "Reminder Shared",
        message: `${sharerProfile.first_name} ${sharerProfile.last_name} shared a reminder: "${reminderData.title}"`,
        metadata: { reminder_id: reminderId, shared_reminder_message: message },
      })
    }
  }

  async getSharedReminders(userId: string): Promise<SharedReminder[]> {
    const { data, error } = await supabase
      .from("shared_reminders")
      .select(`
        *,
        reminder:reminders(title, description, image),
        sharer:profiles!shared_reminders_shared_by_fkey(first_name, last_name)
      `)
      .eq("shared_with", userId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return data.map((row: any) => ({
      id: row.id,
      reminderId: row.reminder_id,
      sharedBy: row.shared_by,
      sharedWith: row.shared_with,
      message: row.message,
      isRead: row.is_read,
      createdAt: new Date(row.created_at),
      reminderTitle: row.reminder.title,
      reminderDescription: row.reminder.description,
      reminderImage: row.reminder.image,
      sharerFirstName: row.sharer.first_name,
      sharerLastName: row.sharer.last_name,
    }))
  }

  async markSharedReminderAsRead(userId: string, sharedReminderId: string): Promise<void> {
    const { error } = await supabase
      .from("shared_reminders")
      .update({ is_read: true })
      .eq("id", sharedReminderId)
      .eq("shared_with", userId)

    if (error) throw error
  }

  // Notifications
  async getNotifications(userId: string): Promise<FriendNotification[]> {
    const { data, error } = await supabase
      .from("friend_notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) throw error

    return data.map((row: NotificationRow) => ({
      id: row.id,
      userId: row.user_id,
      fromUserId: row.from_user_id,
      type: row.type as "friend_request" | "friend_accepted" | "reminder_shared",
      title: row.title,
      message: row.message,
      isRead: row.is_read,
      metadata: row.metadata || {},
      createdAt: new Date(row.created_at),
    }))
  }

  async markNotificationAsRead(userId: string, notificationId: string): Promise<void> {
    const { error } = await supabase
      .from("friend_notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("user_id", userId)

    if (error) throw error
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from("friend_notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false)

    if (error) throw error
    return count || 0
  }

  // Friend Discovery
  async searchUsersByEmail(email: string): Promise<
    Array<{
      id: string
      firstName: string
      lastName: string
      email: string
      profileImage?: string
    }>
  > {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, profile_image")
      .ilike("email", `%${email}%`)
      .limit(10)

    if (error) throw error

    return data.map((row) => ({
      id: row.id,
      firstName: row.first_name || "",
      lastName: row.last_name || "",
      email: row.email,
      profileImage: row.profile_image || undefined,
    }))
  }
}

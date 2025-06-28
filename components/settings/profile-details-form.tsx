"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save } from "lucide-react"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  profileImage?: string | null
  createdAt: string
  emailConfirmed: boolean
}

interface UserSettings {
  id: string
  theme: string
  notifications_enabled: boolean
  email_notifications: boolean
  push_notifications: boolean
  reminder_sound: boolean
  daily_summary: boolean
  timezone: string
  language: string
  date_format: string
  time_format: string
  created_at: string
  updated_at: string
}

interface ProfileDetailsFormProps {
  user: User
  settings: UserSettings
  onSettingsChange: (settings: Partial<UserSettings>) => void
  loading: boolean
}

export function ProfileDetailsForm({ user, settings, onSettingsChange, loading }: ProfileDetailsFormProps) {
  const [firstName, setFirstName] = useState(user.firstName || "")
  const [lastName, setLastName] = useState(user.lastName || "")
  const [email, setEmail] = useState(user.email || "")

  const userInitials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || email?.[0]?.toUpperCase() || "U"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would update the user profile here
    console.log("Profile update:", { firstName, lastName, email })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload the image here
      console.log("Image upload:", file)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.profileImage || undefined} alt={`${firstName} ${lastName}`} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <Label htmlFor="profile-image" className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Camera className="h-4 w-4 mr-2" />
                  Change Photo
                </span>
              </Button>
            </Label>
            <Input id="profile-image" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              <p className="text-sm text-gray-500">Status: {user.emailConfirmed ? "Verified" : "Not verified"}</p>
            </div>

            <div className="space-y-2">
              <Label>Account Created</Label>
              <p className="text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>

            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

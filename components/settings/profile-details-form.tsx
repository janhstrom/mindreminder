"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { User } from "lucide-react"
import type { UserSettings } from "@/lib/settings-service"

interface ProfileDetailsFormProps {
  settings: Partial<UserSettings>
  onSettingsChange: (newSettings: Partial<UserSettings>) => void
}

export function ProfileDetailsForm({ settings, onSettingsChange }: ProfileDetailsFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onSettingsChange({ [e.target.name]: e.target.value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={settings.firstName || ""}
              onChange={handleChange}
              placeholder="Your first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={settings.lastName || ""}
              onChange={handleChange}
              placeholder="Your last name"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" value={settings.email || ""} disabled placeholder="Your email address" />
          <p className="text-xs text-muted-foreground">Email address cannot be changed here.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            value={settings.bio || ""}
            onChange={handleChange}
            placeholder="Tell us a little about yourself"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  )
}

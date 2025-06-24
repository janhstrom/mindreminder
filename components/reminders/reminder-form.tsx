"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Clock, MapPin, ImageIcon, Calendar } from "lucide-react"
import type { Reminder } from "@/types"
import { UserPreferencesService } from "@/lib/user-preferences"
import { TimeInput } from "@/components/ui/time-input"

interface ReminderFormProps {
  reminder?: Reminder
  onSave: (reminder: Omit<Reminder, "id" | "userId" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

export function ReminderForm({ reminder, onSave, onCancel }: ReminderFormProps) {
  const [title, setTitle] = useState(reminder?.title || "")
  const [description, setDescription] = useState(reminder?.description || "")
  const [scheduledTime, setScheduledTime] = useState(
    reminder?.scheduledTime ? new Date(reminder.scheduledTime).toISOString().slice(0, 16) : "",
  )
  const [location, setLocation] = useState(reminder?.location || "")
  const [image, setImage] = useState(reminder?.image || "")
  const [isActive, setIsActive] = useState(reminder?.isActive ?? true)

  const userPreferencesService = UserPreferencesService.getInstance()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSave({
      title: title.trim(),
      description: description.trim(),
      scheduledTime: scheduledTime ? new Date(scheduledTime).toISOString() : undefined,
      location: location.trim() || undefined,
      image: image.trim() || undefined,
      isActive,
    })
  }

  // Format the preview using user preferences
  const getFormattedPreview = () => {
    if (!scheduledTime) return ""
    const date = new Date(scheduledTime)
    return userPreferencesService.formatDateTime(date)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{reminder ? "Edit Reminder" : "Create New Reminder"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter reminder title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)"
              rows={3}
            />
          </div>

          {/* Scheduled Time */}
          <div className="space-y-2">
            <Label htmlFor="scheduledTime" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Scheduled Time
            </Label>
            <div className="space-y-2">
              <Input
                type="date"
                value={scheduledTime ? scheduledTime.split("T")[0] : ""}
                onChange={(e) => {
                  const dateValue = e.target.value
                  const timeValue = scheduledTime ? scheduledTime.split("T")[1] : "09:00"
                  setScheduledTime(dateValue ? `${dateValue}T${timeValue}` : "")
                }}
              />
              <TimeInput
                value={scheduledTime ? scheduledTime.split("T")[1] || "09:00" : "09:00"}
                onChange={(timeValue) => {
                  const dateValue = scheduledTime ? scheduledTime.split("T")[0] : new Date().toISOString().split("T")[0]
                  setScheduledTime(`${dateValue}T${timeValue}`)
                }}
              />
            </div>
            {scheduledTime && (
              <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                <strong>Preview:</strong> {getFormattedPreview()}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location (optional)"
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label htmlFor="image" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Image URL
            </Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Add image URL (optional)"
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Active Reminder
            </Label>
            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {reminder ? "Update Reminder" : "Create Reminder"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

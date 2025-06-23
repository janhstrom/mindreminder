"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar, Clock, MapPin, ImageIcon, Bell } from "lucide-react"
import { DashboardDataService } from "@/lib/dashboard-data"

interface CreateReminderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onReminderCreated: () => void
}

export function CreateReminderModal({ open, onOpenChange, onReminderCreated }: CreateReminderModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [location, setLocation] = useState("")
  const [image, setImage] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    try {
      await DashboardDataService.createReminder({
        title: title.trim(),
        description: description.trim() || undefined,
        scheduledTime: scheduledTime ? scheduledTime : undefined,
        location: location.trim() || undefined,
        image: image.trim() || undefined,
        isActive,
      })

      // Reset form
      setTitle("")
      setDescription("")
      setScheduledTime("")
      setLocation("")
      setImage("")
      setIsActive(true)

      // Close modal and refresh data
      onOpenChange(false)
      onReminderCreated()
    } catch (error) {
      console.error("Error creating reminder:", error)
      alert("Failed to create reminder. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Create New Reminder
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What would you like to be reminded about?"
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
              placeholder="Add more details (optional)"
              rows={3}
            />
          </div>

          {/* Scheduled Time */}
          <div className="space-y-2">
            <Label htmlFor="scheduledTime" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Scheduled Time
            </Label>
            <Input
              id="scheduledTime"
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
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
              placeholder="Where should this reminder appear?"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Image URL
            </Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Add an inspiring image (optional)"
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
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting ? "Creating..." : "Create Reminder"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

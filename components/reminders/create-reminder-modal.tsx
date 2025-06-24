"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
// Removed simpleDataService import as it's handled by the parent page

interface ReminderFormData {
  title: string
  description?: string
  scheduledTime?: string
  isActive: boolean
}
interface CreateReminderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onReminderCreated: (data: ReminderFormData) => void // Pass data back
}

export function CreateReminderModal({ open, onOpenChange, onReminderCreated }: CreateReminderModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setSaving(true)
    try {
      const reminderData: ReminderFormData = {
        title: title.trim(),
        description: description.trim() || undefined,
        scheduledTime: scheduledTime || undefined,
        isActive,
      }
      onReminderCreated(reminderData) // Pass data back

      // Reset form
      setTitle("")
      setDescription("")
      setScheduledTime("")
      setIsActive(true)
      // onOpenChange(false); // Optionally close modal after creation
    } catch (error) {
      console.error("Error in reminder creation process:", error)
      // Handle error display to user if necessary
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Reminder</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter reminder title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="scheduledTime">Scheduled Time</Label>
            <Input
              id="scheduledTime"
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Active Reminder</Label>
            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={saving || !title.trim()}>
              {saving ? "Creating..." : "Create Reminder"}
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

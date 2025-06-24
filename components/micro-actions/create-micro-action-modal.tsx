"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { simpleDataService } from "@/lib/simple-data-service"

interface CreateMicroActionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMicroActionCreated: () => void
}

export function CreateMicroActionModal({ open, onOpenChange, onMicroActionCreated }: CreateMicroActionModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [duration, setDuration] = useState("")
  const [frequency, setFrequency] = useState("daily")
  const [isActive, setIsActive] = useState(true)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !category) return

    setSaving(true)
    try {
      await simpleDataService.createMicroAction({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        duration: duration || "2 minutes",
        frequency,
        isActive,
      })

      // Reset form
      setTitle("")
      setDescription("")
      setCategory("")
      setDuration("")
      setFrequency("daily")
      setIsActive(true)

      onMicroActionCreated()
    } catch (error) {
      console.error("Error creating micro-action:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Micro-Action</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Drink 1 glass of water"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why is this important to you?"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health">🌱 Health</SelectItem>
                  <SelectItem value="learning">🧠 Learning</SelectItem>
                  <SelectItem value="mindfulness">🧘 Mindfulness</SelectItem>
                  <SelectItem value="productivity">🎯 Productivity</SelectItem>
                  <SelectItem value="relationships">💝 Relationships</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 2 minutes"
              />
            </div>
          </div>

          <div>
            <Label>Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekdays">Weekdays only</SelectItem>
                <SelectItem value="weekends">Weekends only</SelectItem>
                <SelectItem value="3x-week">3 times per week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Active Habit</Label>
            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={saving || !title.trim() || !category}>
              {saving ? "Creating..." : "Create Micro-Action"}
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

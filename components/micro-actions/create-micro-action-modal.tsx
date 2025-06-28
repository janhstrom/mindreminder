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
import { Plus, Target } from "lucide-react"

interface CreateMicroActionModalProps {
  isOpen: boolean
  onClose: () => void
  onMicroActionCreated: (microAction: any) => void
}

const categories = [
  "Health & Fitness",
  "Learning & Growth",
  "Productivity",
  "Relationships",
  "Mindfulness",
  "Creativity",
  "Finance",
  "Career",
  "Other",
]

export function CreateMicroActionModal({ isOpen, onClose, onMicroActionCreated }: CreateMicroActionModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [estimatedMinutes, setEstimatedMinutes] = useState("")
  const [isCompleted, setIsCompleted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newMicroAction = {
      id: Date.now().toString(),
      title,
      description,
      category,
      estimatedMinutes: estimatedMinutes ? Number.parseInt(estimatedMinutes) : null,
      isCompleted,
      createdAt: new Date().toISOString(),
      completedAt: isCompleted ? new Date().toISOString() : null,
    }

    onMicroActionCreated(newMicroAction)

    // Reset form
    setTitle("")
    setDescription("")
    setCategory("")
    setEstimatedMinutes("")
    setIsCompleted(false)

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Create Micro Action
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Drink a glass of water"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your micro action..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedMinutes">Estimated Time (minutes)</Label>
            <Input
              id="estimatedMinutes"
              type="number"
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(e.target.value)}
              placeholder="e.g., 5"
              min="1"
              max="60"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isCompleted" checked={isCompleted} onCheckedChange={setIsCompleted} />
            <Label htmlFor="isCompleted">Mark as completed</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Create Action
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

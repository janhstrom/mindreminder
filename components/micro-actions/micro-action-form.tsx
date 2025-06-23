"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, Target, Zap, AlertCircle, CheckCircle } from "lucide-react"

interface MicroActionFormProps {
  onSave: (microAction: any) => void
  onCancel: () => void
}

export function MicroActionForm({ onSave, onCancel }: MicroActionFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [duration, setDuration] = useState("")
  const [frequency, setFrequency] = useState("daily")
  const [timeOfDay, setTimeOfDay] = useState("")
  const [habitStack, setHabitStack] = useState("")
  const [isValidated, setIsValidated] = useState(false)

  // Pre-built micro-action templates
  const templates = [
    {
      title: "Drink 1 glass of water",
      description: "Hydrate your body first thing in the morning",
      category: "health",
      duration: "30 seconds",
      timeOfDay: "morning",
      habitStack: "After I wake up",
    },
    {
      title: "Read 1 page",
      description: "Build a reading habit one page at a time",
      category: "learning",
      duration: "2 minutes",
      timeOfDay: "evening",
      habitStack: "After I finish dinner",
    },
    {
      title: "Write 1 sentence in journal",
      description: "Capture your thoughts and gratitude",
      category: "mindfulness",
      duration: "1 minute",
      timeOfDay: "evening",
      habitStack: "Before I go to bed",
    },
    {
      title: "Do 5 push-ups",
      description: "Build strength with minimal time commitment",
      category: "health",
      duration: "1 minute",
      timeOfDay: "morning",
      habitStack: "After I brush my teeth",
    },
  ]

  const categories = [
    { value: "health", label: "🌱 Health", color: "bg-green-100 text-green-800" },
    { value: "learning", label: "🧠 Learning", color: "bg-blue-100 text-blue-800" },
    { value: "mindfulness", label: "🧘 Mindfulness", color: "bg-purple-100 text-purple-800" },
    { value: "productivity", label: "🎯 Productivity", color: "bg-orange-100 text-orange-800" },
    { value: "relationships", label: "💝 Relationships", color: "bg-pink-100 text-pink-800" },
  ]

  const useTemplate = (template: any) => {
    setTitle(template.title)
    setDescription(template.description)
    setCategory(template.category)
    setDuration(template.duration)
    setTimeOfDay(template.timeOfDay)
    setHabitStack(template.habitStack)
  }

  const validateMicroAction = () => {
    const durationMinutes = Number.parseInt(duration) || 0
    const isValid = title.trim() && category && durationMinutes <= 2
    setIsValidated(isValid)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateMicroAction()) return

    const microAction = {
      title: title.trim(),
      description: description.trim(),
      category,
      duration,
      frequency,
      timeOfDay,
      habitStack: habitStack.trim(),
      isActive: true,
      streak: 0,
      completedToday: false,
      type: "micro-action",
    }

    onSave(microAction)
  }

  const getDurationColor = () => {
    const minutes = Number.parseInt(duration) || 0
    if (minutes <= 2) return "text-green-600"
    if (minutes <= 5) return "text-yellow-600"
    return "text-red-600"
  }

  const getDurationIcon = () => {
    const minutes = Number.parseInt(duration) || 0
    if (minutes <= 2) return <CheckCircle className="h-4 w-4 text-green-600" />
    return <AlertCircle className="h-4 w-4 text-yellow-600" />
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Target className="h-6 w-6 mr-2 text-purple-600" />
            Create Micro-Action
          </h2>
          <p className="text-gray-600 mt-1">Build lasting habits through tiny daily actions</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          ✕
        </Button>
      </div>

      {/* 2-Minute Rule Explanation */}
      <Card className="mb-6 bg-purple-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Zap className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-purple-900">The 2-Minute Rule</h3>
              <p className="text-purple-800 text-sm mt-1">
                Start with actions that take 2 minutes or less. This makes it easy to begin and builds momentum for
                bigger changes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Templates */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Quick Start Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {templates.map((template, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-3 text-left justify-start"
              onClick={() => useTemplate(template)}
            >
              <div>
                <div className="font-medium text-sm">{template.title}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {template.duration} • {template.category}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Action Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Drink 1 glass of water"
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
            placeholder="Why is this important to you?"
            rows={2}
          />
        </div>

        {/* Category and Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Choose category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Duration *
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 1 minute"
                required
              />
              {duration && (
                <div className="flex items-center space-x-1">
                  {getDurationIcon()}
                  <span className={`text-xs ${getDurationColor()}`}>
                    {Number.parseInt(duration) <= 2 ? "Perfect!" : "Consider making it shorter"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Frequency and Time of Day */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
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

          <div className="space-y-2">
            <Label>Time of Day</Label>
            <Select value={timeOfDay} onValueChange={setTimeOfDay}>
              <SelectTrigger>
                <SelectValue placeholder="When works best?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">🌅 Morning (6-10 AM)</SelectItem>
                <SelectItem value="midday">☀️ Midday (10 AM-2 PM)</SelectItem>
                <SelectItem value="afternoon">🌤️ Afternoon (2-6 PM)</SelectItem>
                <SelectItem value="evening">🌆 Evening (6-10 PM)</SelectItem>
                <SelectItem value="flexible">🔄 Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Habit Stacking */}
        <div className="space-y-2">
          <Label htmlFor="habitStack">Habit Stacking (Recommended)</Label>
          <Input
            id="habitStack"
            value={habitStack}
            onChange={(e) => setHabitStack(e.target.value)}
            placeholder="After I [existing habit], I will [new micro-action]"
          />
          <p className="text-xs text-gray-500">Link your new habit to something you already do consistently</p>
        </div>

        {/* Category Preview */}
        {category && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Category:</span>
            <Badge className={categories.find((c) => c.value === category)?.color}>
              {categories.find((c) => c.value === category)?.label}
            </Badge>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            disabled={!title.trim() || !category}
          >
            Create Micro-Action
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

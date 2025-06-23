"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Flame, Clock, Target, MoreHorizontal } from "lucide-react"

interface MicroActionCardProps {
  microAction: any
  onComplete: (id: string) => void
  onEdit: (microAction: any) => void
  onDelete: (id: string) => void
}

export function MicroActionCard({ microAction, onComplete, onEdit, onDelete }: MicroActionCardProps) {
  const [isCompleting, setIsCompleting] = useState(false)

  const handleComplete = async () => {
    setIsCompleting(true)
    try {
      await onComplete(microAction.id)
    } finally {
      setIsCompleting(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      health: "bg-green-100 text-green-800 border-green-200",
      learning: "bg-blue-100 text-blue-800 border-blue-200",
      mindfulness: "bg-purple-100 text-purple-800 border-purple-200",
      productivity: "bg-orange-100 text-orange-800 border-orange-200",
      relationships: "bg-pink-100 text-pink-800 border-pink-200",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getCategoryEmoji = (category: string) => {
    const emojis = {
      health: "🌱",
      learning: "🧠",
      mindfulness: "🧘",
      productivity: "🎯",
      relationships: "💝",
    }
    return emojis[category as keyof typeof emojis] || "📝"
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 7) return "text-orange-600"
    if (streak >= 3) return "text-yellow-600"
    return "text-gray-600"
  }

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        microAction.completedToday ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge className={getCategoryColor(microAction.category)}>
              {getCategoryEmoji(microAction.category)} {microAction.category}
            </Badge>
            {microAction.streak > 0 && (
              <div className={`flex items-center space-x-1 ${getStreakColor(microAction.streak)}`}>
                <Flame className="h-3 w-3" />
                <span className="text-xs font-medium">{microAction.streak}</span>
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>

        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 mb-1">{microAction.title}</h3>
          {microAction.description && <p className="text-sm text-gray-600 mb-2">{microAction.description}</p>}

          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{microAction.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="h-3 w-3" />
              <span>{microAction.frequency}</span>
            </div>
          </div>

          {microAction.habitStack && (
            <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">{microAction.habitStack}</div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {microAction.completedToday ? (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Completed!</span>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={handleComplete}
                disabled={isCompleting}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isCompleting ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                ) : (
                  <>
                    <Circle className="h-3 w-3 mr-1" />
                    Do Now
                  </>
                )}
              </Button>
            )}
          </div>

          {microAction.streak > 0 && (
            <div className="text-right">
              <div className={`text-xs font-medium ${getStreakColor(microAction.streak)}`}>
                {microAction.streak} day streak
              </div>
              <div className="text-xs text-gray-500">
                {microAction.streak === 1
                  ? "Great start!"
                  : microAction.streak < 7
                    ? "Building momentum"
                    : "Habit forming!"}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

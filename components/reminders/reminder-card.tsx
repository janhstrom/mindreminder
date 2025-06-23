"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Clock, MapPin, Edit, Trash2, Share } from "lucide-react"
import type { Reminder } from "@/types"
import { UserPreferencesService } from "@/lib/user-preferences"

interface ReminderCardProps {
  reminder: Reminder
  onEdit: (reminder: Reminder) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
  onShare: (reminder: Reminder) => void
}

export function ReminderCard({ reminder, onEdit, onDelete, onToggle, onShare }: ReminderCardProps) {
  const userPreferencesService = UserPreferencesService.getInstance()

  const formatDate = (date: Date) => {
    return userPreferencesService.formatDateTime(date)
  }

  return (
    <Card className={`transition-all ${reminder.isActive ? "" : "opacity-60"}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{reminder.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Switch checked={reminder.isActive} onCheckedChange={() => onToggle(reminder.id)} size="sm" />
            <Badge variant={reminder.isActive ? "default" : "secondary"}>
              {reminder.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {reminder.description && <p className="text-sm text-muted-foreground">{reminder.description}</p>}

        {reminder.image && (
          <div className="rounded-lg overflow-hidden">
            <img src={reminder.image || "/placeholder.svg"} alt="Reminder" className="w-full h-32 object-cover" />
          </div>
        )}

        <div className="space-y-2">
          {reminder.scheduledTime && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {formatDate(new Date(reminder.scheduledTime))}
            </div>
          )}

          {reminder.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {reminder.location}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(reminder)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="outline" onClick={() => onShare(reminder)}>
            <Share className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(reminder.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

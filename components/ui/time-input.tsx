"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { SettingsService } from "@/lib/settings-service"

interface TimeInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
  id?: string
}

export function TimeInput({ value, onChange, className, id }: TimeInputProps) {
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("12h")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await SettingsService.getSettings()
        setTimeFormat(settings.timeFormat || "12h")
      } catch (error) {
        console.error("Error loading time format:", error)
        setTimeFormat("12h") // fallback
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  // Convert 24h to 12h for display
  const convertTo12h = (time24: string): string => {
    if (!time24 || !time24.includes(":")) return time24

    try {
      const [hours, minutes] = time24.split(":").map(Number)
      if (isNaN(hours) || isNaN(minutes)) return time24

      const period = hours >= 12 ? "PM" : "AM"
      const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
      return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
    } catch (error) {
      return time24
    }
  }

  // Convert 12h to 24h for storage
  const convertTo24h = (time12: string): string => {
    if (!time12 || !time12.includes(":")) return time12

    try {
      const [timePart, period] = time12.split(" ")
      const [hours, minutes] = timePart.split(":").map(Number)

      if (isNaN(hours) || isNaN(minutes)) return time12

      let hours24 = hours
      if (period === "PM" && hours !== 12) {
        hours24 += 12
      } else if (period === "AM" && hours === 12) {
        hours24 = 0
      }

      return `${hours24.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    } catch (error) {
      return time12
    }
  }

  const handleChange = (newValue: string) => {
    if (timeFormat === "12h") {
      // Convert 12h input to 24h for storage
      const time24 = convertTo24h(newValue)
      onChange(time24)
    } else {
      // 24h format, use as-is
      onChange(newValue)
    }
  }

  if (loading) {
    return <Input id={id} type="time" value={value} onChange={(e) => onChange(e.target.value)} className={className} />
  }

  if (timeFormat === "24h") {
    return <Input id={id} type="time" value={value} onChange={(e) => onChange(e.target.value)} className={className} />
  }

  // For 12h format, show a text input with placeholder
  const displayValue = convertTo12h(value)

  return (
    <div className={className}>
      <Input
        id={id}
        type="text"
        value={displayValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="9:00 AM"
        className="font-mono"
      />
      <p className="text-xs text-gray-500 mt-1">Format: H:MM AM/PM (e.g., 9:00 AM, 2:30 PM)</p>
    </div>
  )
}

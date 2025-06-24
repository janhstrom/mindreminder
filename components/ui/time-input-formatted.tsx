"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface TimeInputFormattedProps {
  id?: string
  value: string
  onChange: (value: string) => void
  className?: string
  format?: "12h" | "24h"
}

export function TimeInputFormatted({ id, value, onChange, className, format = "24h" }: TimeInputFormattedProps) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    if (format === "12h" && value) {
      // Convert 24h to 12h for display
      try {
        const [hours, minutes] = value.split(":").map(Number)
        const period = hours >= 12 ? "PM" : "AM"
        const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
        setDisplayValue(`${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`)
      } catch {
        setDisplayValue(value)
      }
    } else {
      setDisplayValue(value)
    }
  }, [value, format])

  const handleChange = (inputValue: string) => {
    if (format === "12h") {
      // Convert 12h input back to 24h for storage
      try {
        const match = inputValue.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
        if (match) {
          let hours = Number.parseInt(match[1])
          const minutes = Number.parseInt(match[2])
          const period = match[3].toUpperCase()

          if (period === "PM" && hours !== 12) hours += 12
          if (period === "AM" && hours === 12) hours = 0

          const time24h = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
          onChange(time24h)
        }
      } catch {
        onChange(inputValue)
      }
    } else {
      onChange(inputValue)
    }
  }

  if (format === "12h") {
    return (
      <Input
        id={id}
        type="text"
        value={displayValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="9:00 AM"
        className={cn("w-full", className)}
      />
    )
  }

  return (
    <Input
      id={id}
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn("w-full", className)}
    />
  )
}

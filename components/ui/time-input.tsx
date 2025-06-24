"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SettingsService } from "@/lib/settings-service"

interface TimeInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
  id?: string
}

export function TimeInput({ value, onChange, className, id }: TimeInputProps) {
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("12h")
  const [displayValue, setDisplayValue] = useState("")
  const [hours, setHours] = useState("09")
  const [minutes, setMinutes] = useState("00")
  const [period, setPeriod] = useState<"AM" | "PM">("AM")

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await SettingsService.getSettings()
        setTimeFormat(settings.timeFormat || "12h")
      } catch (error) {
        console.error("Error loading time format:", error)
      }
    }
    loadSettings()
  }, [])

  useEffect(() => {
    if (value) {
      try {
        const [h, m] = value.split(":").map(Number)
        setHours(h.toString().padStart(2, "0"))
        setMinutes(m.toString().padStart(2, "0"))

        if (timeFormat === "12h") {
          setPeriod(h >= 12 ? "PM" : "AM")
          const displayHours = h === 0 ? 12 : h > 12 ? h - 12 : h
          setDisplayValue(`${displayHours.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`)
        } else {
          setDisplayValue(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`)
        }
      } catch (error) {
        console.error("Error parsing time value:", error)
      }
    }
  }, [value, timeFormat])

  const handleTimeChange = (newHours: string, newMinutes: string, newPeriod?: "AM" | "PM") => {
    let finalHours = Number.parseInt(newHours)

    if (timeFormat === "12h" && newPeriod) {
      if (newPeriod === "PM" && finalHours !== 12) {
        finalHours += 12
      } else if (newPeriod === "AM" && finalHours === 12) {
        finalHours = 0
      }
    }

    const timeValue = `${finalHours.toString().padStart(2, "0")}:${newMinutes.padStart(2, "0")}`
    onChange(timeValue)
  }

  if (timeFormat === "24h") {
    return <Input id={id} type="time" value={value} onChange={(e) => onChange(e.target.value)} className={className} />
  }

  // 12-hour format with custom controls
  return (
    <div className={`flex gap-2 ${className}`}>
      <Select
        value={hours}
        onValueChange={(newHours) => {
          setHours(newHours)
          handleTimeChange(newHours, minutes, period)
        }}
      >
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 12 }, (_, i) => {
            const hour = (i + 1).toString().padStart(2, "0")
            return (
              <SelectItem key={hour} value={hour}>
                {hour}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>

      <span className="flex items-center">:</span>

      <Select
        value={minutes}
        onValueChange={(newMinutes) => {
          setMinutes(newMinutes)
          handleTimeChange(hours, newMinutes, period)
        }}
      >
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 60 }, (_, i) => {
            const minute = i.toString().padStart(2, "0")
            return (
              <SelectItem key={minute} value={minute}>
                {minute}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>

      <Select
        value={period}
        onValueChange={(newPeriod: "AM" | "PM") => {
          setPeriod(newPeriod)
          handleTimeChange(hours, minutes, newPeriod)
        }}
      >
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

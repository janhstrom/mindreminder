"use client"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TimeInputProps {
  id?: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function TimeInput({ id, value, onChange, className }: TimeInputProps) {
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

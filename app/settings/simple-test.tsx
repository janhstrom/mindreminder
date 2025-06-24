"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TimeInput } from "@/components/ui/time-input"
import Link from "next/link"

export default function SimpleSettingsTest() {
  const [testTime, setTestTime] = useState("09:00")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Settings Test Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="regular-time">Regular Time Input</Label>
              <Input id="regular-time" type="time" value={testTime} onChange={(e) => setTestTime(e.target.value)} />
              <p className="text-sm text-gray-600 mt-1">Value: {testTime}</p>
            </div>

            <div>
              <Label htmlFor="custom-time">Custom TimeInput Component</Label>
              <TimeInput id="custom-time" value={testTime} onChange={setTestTime} />
              <p className="text-sm text-gray-600 mt-1">Value: {testTime}</p>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                If you can see this page, routing is working. The TimeInput should respect your format settings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

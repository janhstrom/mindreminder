"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SimpleDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>🎯 Dashboard Working!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Your dashboard is accessible and working properly.</p>
          <div className="flex gap-4">
            <Link href="/">
              <Button variant="outline">← Back to Home</Button>
            </Link>
            <Link href="/settings">
              <Button>Go to Settings</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

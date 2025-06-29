import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WifiOff } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <WifiOff className="h-6 w-6" />
          </div>
          <CardTitle>You're offline</CardTitle>
          <CardDescription>Check your internet connection and try again.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">Some features may not be available while offline.</p>
        </CardContent>
      </Card>
    </div>
  )
}

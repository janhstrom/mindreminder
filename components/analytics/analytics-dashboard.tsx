"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAnalyticsData } from "@/hooks/use-analytics"
import { getAnalyticsService } from "@/lib/analytics-service"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Target,
  Activity,
  Download,
  BarChart3,
  AlertCircle,
} from "lucide-react"

interface AnalyticsDashboardProps {
  userId: string
}

export function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d")
  const { data, loading, error } = useAnalyticsData(userId, timeRange)

  const handleExport = async () => {
    const analytics = getAnalyticsService()
    if (analytics) {
      await analytics.exportAnalyticsData(userId, timeRange)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <div className="flex items-center space-x-2">
            <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
            <div className="h-10 w-24 bg-muted animate-pulse rounded-md" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-20 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load analytics</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No analytics data</h3>
          <p className="text-muted-foreground">Start using the app to see your analytics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={(value: "7d" | "30d" | "90d") => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalSessions}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {data.overview.sessionsChange > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              {Math.abs(data.overview.sessionsChange)}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.avgSessionTime}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {data.overview.sessionTimeChange > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              {Math.abs(data.overview.sessionTimeChange)}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reminders Created</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.remindersCreated}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {data.overview.remindersChange > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              {Math.abs(data.overview.remindersChange)}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.engagementScore}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {data.overview.engagementChange > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              {Math.abs(data.overview.engagementChange)}% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Feature Usage</CardTitle>
            <CardDescription>How users interact with different features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.featureMetrics.map((feature) => (
              <div key={feature.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{feature.name}</span>
                  <Badge variant={feature.trend === "up" ? "default" : "secondary"}>
                    {feature.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(feature.change)}%
                  </Badge>
                </div>
                <span className="text-2xl font-bold">{feature.usage}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Actions</CardTitle>
            <CardDescription>Most popular user actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.topActions.map((action) => (
              <div key={action.name} className="flex items-center justify-between">
                <span className="font-medium">{action.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{action.percentage}%</span>
                  <span className="text-2xl font-bold">{action.count}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>App performance and user experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{data.performance.pageLoadTime}ms</div>
              <p className="text-sm text-muted-foreground">Avg Load Time</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{data.performance.errorRate}%</div>
              <p className="text-sm text-muted-foreground">Error Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{data.performance.bounceRate}%</div>
              <p className="text-sm text-muted-foreground">Bounce Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

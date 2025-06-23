"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  Users,
  Clock,
  Heart,
  Share,
  Bell,
  Download,
  RefreshCw,
  Activity,
  Eye,
  MousePointer,
} from "lucide-react"

interface AnalyticsDashboardProps {
  user: any
}

interface AnalyticsData {
  overview: {
    totalSessions: number
    sessionsChange: number
    avgSessionTime: string
    sessionTimeChange: number
    remindersCreated: number
    remindersChange: number
    engagementScore: number
    engagementChange: number
  }
  featureMetrics: Array<{
    name: string
    usage: number
    change: number
    trend: "up" | "down"
  }>
  topActions: Array<{
    name: string
    count: number
    percentage: number
  }>
  performance: {
    pageLoadTime: number
    errorRate: number
    bounceRate: number
  }
}

export function AnalyticsDashboard({ user }: AnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d")

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      // Simulate loading analytics data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data for demonstration
      const mockData: AnalyticsData = {
        overview: {
          totalSessions: 156,
          sessionsChange: 12.5,
          avgSessionTime: "4m 32s",
          sessionTimeChange: 8.2,
          remindersCreated: 89,
          remindersChange: 15.3,
          engagementScore: 78,
          engagementChange: 5.1,
        },
        featureMetrics: [
          { name: "Reminders", usage: 89, change: 15.3, trend: "up" },
          { name: "Quotes", usage: 45, change: -2.1, trend: "down" },
          { name: "Friends", usage: 23, change: 8.7, trend: "up" },
          { name: "Sharing", usage: 12, change: 3.2, trend: "up" },
        ],
        topActions: [
          { name: "Create Reminder", count: 89, percentage: 35.2 },
          { name: "View Dashboard", count: 67, percentage: 26.5 },
          { name: "Generate Quote", count: 45, percentage: 17.8 },
          { name: "Share Reminder", count: 34, percentage: 13.4 },
          { name: "Update Settings", count: 18, percentage: 7.1 },
        ],
        performance: {
          pageLoadTime: 1240,
          errorRate: 0.8,
          bounceRate: 23.4,
        },
      }

      setAnalyticsData(mockData)
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = async () => {
    try {
      const dataStr = JSON.stringify(analyticsData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `mindreminder-analytics-${timeRange}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting data:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Analytics</h2>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Analytics</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No analytics data available</h3>
              <p className="text-muted-foreground">Start using the app to see your analytics</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Analytics</h2>
          <p className="text-muted-foreground">Track your MindReMinder usage and engagement</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as typeof timeRange)}>
            <TabsList>
              <TabsTrigger value="7d">7 Days</TabsTrigger>
              <TabsTrigger value="30d">30 Days</TabsTrigger>
              <TabsTrigger value="90d">90 Days</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={loadAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.overview.sessionsChange > 0 ? "+" : ""}
              {analyticsData.overview.sessionsChange}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.avgSessionTime}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.overview.sessionTimeChange > 0 ? "+" : ""}
              {analyticsData.overview.sessionTimeChange}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reminders Created</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.remindersCreated}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.overview.remindersChange > 0 ? "+" : ""}
              {analyticsData.overview.remindersChange}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.engagementScore}%</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.overview.engagementChange > 0 ? "+" : ""}
              {analyticsData.overview.engagementChange}% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="features" className="space-y-6">
        <TabsList>
          <TabsTrigger value="features">Feature Analytics</TabsTrigger>
          <TabsTrigger value="engagement">Top Actions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsData.featureMetrics.map((feature, index) => (
              <Card key={feature.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{feature.name}</CardTitle>
                  {feature.name === "Reminders" && <Bell className="h-4 w-4 text-muted-foreground" />}
                  {feature.name === "Quotes" && <Heart className="h-4 w-4 text-muted-foreground" />}
                  {feature.name === "Friends" && <Users className="h-4 w-4 text-muted-foreground" />}
                  {feature.name === "Sharing" && <Share className="h-4 w-4 text-muted-foreground" />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{feature.usage}</div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">
                      {feature.change > 0 ? "+" : ""}
                      {feature.change}% change
                    </p>
                    <Badge variant={feature.trend === "up" ? "default" : "secondary"}>
                      {feature.trend === "up" ? "↗" : "↘"} {feature.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top User Actions</CardTitle>
              <p className="text-sm text-muted-foreground">Most frequently performed actions in your app</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topActions.map((action, index) => (
                  <div key={action.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{action.name}</p>
                        <p className="text-sm text-muted-foreground">{action.count} times</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${action.percentage}%` }} />
                      </div>
                      <Badge variant="outline">{action.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Load Time</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.performance.pageLoadTime}ms</div>
                <p className="text-xs text-muted-foreground">Average load time</p>
                <div className="mt-2">
                  <Badge variant={analyticsData.performance.pageLoadTime < 1500 ? "default" : "secondary"}>
                    {analyticsData.performance.pageLoadTime < 1500 ? "Good" : "Needs improvement"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.performance.errorRate}%</div>
                <p className="text-xs text-muted-foreground">JavaScript errors</p>
                <div className="mt-2">
                  <Badge variant={analyticsData.performance.errorRate < 2 ? "default" : "secondary"}>
                    {analyticsData.performance.errorRate < 2 ? "Excellent" : "Monitor"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.performance.bounceRate}%</div>
                <p className="text-xs text-muted-foreground">Single page visits</p>
                <div className="mt-2">
                  <Badge variant={analyticsData.performance.bounceRate < 30 ? "default" : "secondary"}>
                    {analyticsData.performance.bounceRate < 30 ? "Great" : "Average"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <p className="font-medium">Fast Loading</p>
                    <p className="text-sm text-muted-foreground">Your app loads quickly for most users</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <p className="font-medium">Low Error Rate</p>
                    <p className="text-sm text-muted-foreground">Very few JavaScript errors reported</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                  <div>
                    <p className="font-medium">Good Engagement</p>
                    <p className="text-sm text-muted-foreground">Users are staying and exploring your app</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

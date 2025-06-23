"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, Plus, Quote, Settings, Users, BarChart3, HelpCircle } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home, id: "dashboard" },
  { name: "Add Reminder", href: "/dashboard/reminders/new", icon: Plus, id: "reminders" },
  { name: "Quotes", href: "/dashboard/quotes", icon: Quote, id: "quotes" },
  { name: "Friends", href: "/dashboard/friends", icon: Users, id: "friends" },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, id: "analytics" },
  { name: "Settings", href: "/settings", icon: Settings, id: "settings" },
  { name: "Help", href: "/help", icon: HelpCircle, id: "help" },
]

interface SidebarProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ activeTab = "dashboard", onTabChange, isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId)
    }
    if (onClose) {
      onClose()
    }
  }

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-xl">MindReMinder</span>
          </Link>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = activeTab === item.id
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", isActive && "bg-secondary")}
                  onClick={() => handleTabClick(item.id)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              )
            })}
          </nav>
        </ScrollArea>
      </div>
    </div>
  )
}

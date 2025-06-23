"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Bell, Quote, Users, Settings, Home } from "lucide-react"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { id: "dashboard", name: "Dashboard", icon: Home },
  { id: "reminders", name: "Reminders", icon: Bell },
  { id: "quotes", name: "Quotes", icon: Quote },
  { id: "friends", name: "Friends", icon: Users },
  { id: "settings", name: "Settings", icon: Settings },
]

export function Sidebar({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 transform border-r bg-background transition-transform duration-200 ease-in-out md:relative md:top-0 md:h-[calc(100vh-4rem)] md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <nav className="space-y-2 p-4">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  onTabChange(item.id)
                  onClose()
                }}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            )
          })}
        </nav>
      </div>
    </>
  )
}

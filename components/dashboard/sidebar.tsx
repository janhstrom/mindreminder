"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  Home,
  Calendar,
  Target,
  Users,
  Settings,
  BarChart3,
  BookOpen,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Reminders",
    href: "/dashboard/reminders",
    icon: Calendar,
  },
  {
    name: "Micro Actions",
    href: "/dashboard/micro-actions",
    icon: Target,
  },
  {
    name: "Friends",
    href: "/dashboard/friends",
    icon: Users,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "Resources",
    href: "/resources",
    icon: BookOpen,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-xl font-bold text-gray-900">MindReMinder</span>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:flex"
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>

              <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                    )}
                    onClick={() => {
                      // Close sidebar on mobile when navigating
                      if (window.innerWidth < 768) {
                        onClose()
                      }
                    }}
                  >
                    <item.icon className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-3")} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          {/* Footer */}
          {!isCollapsed && (
            <div className="border-t border-gray-200 p-4">
              <div className="text-xs text-gray-500 text-center">MindReMinder v1.0</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, Settings, Users, BarChart3, HelpCircle } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home, id: "dashboard-main" }, // Differentiate from internal tabs
  // Add Reminder and Quotes are typically modals or sections within dashboard, not full pages from sidebar
  // { name: "Add Reminder", href: "/dashboard/reminders/new", icon: Plus, id: "reminders" },
  // { name: "Quotes", href: "/dashboard/quotes", icon: Quote, id: "quotes" },
  { name: "Friends", href: "/dashboard/friends", icon: Users, id: "friends" }, // Assuming this is a page
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, id: "analytics" }, // Assuming this is a page
  { name: "Settings", href: "/settings", icon: Settings, id: "settings" },
  { name: "Help", href: "/help", icon: HelpCircle, id: "help" },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out md:static md:translate-x-0",
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
                const isActive =
                  pathname === item.href ||
                  (item.href === "/dashboard" &&
                    pathname.startsWith("/dashboard") &&
                    !navigation.slice(1).some((nav) => pathname.startsWith(nav.href) && nav.href !== "/dashboard"))
                return (
                  <Link key={item.name} href={item.href} passHref legacyBehavior>
                    <Button
                      as="a"
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn("w-full justify-start")}
                      onClick={onClose} // Just close the mobile menu on click
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>
        </div>
      </div>
    </>
  )
}

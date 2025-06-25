"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Bell, Moon, Sun, User, LogOutIcon, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface UserProfile extends SupabaseUser {
  firstName?: string
  lastName?: string
  profileImage?: string
}

interface HeaderProps {
  user: UserProfile
  onLogout: () => Promise<void>
  onMenuClick: () => void
}

export function Header({ user, onLogout, onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await onLogout()
    setIsLoggingOut(false)
  }

  const handleProfileClick = () => {
    router.push("/settings")
  }

  const userFirstName = user.user_metadata?.firstName || user.email?.split("@")[0] || "User"
  const userInitials = (userFirstName?.[0] || "U").toUpperCase()

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-16 items-center px-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        <div className="flex items-center space-x-2 ml-2 md:ml-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">MR</span>
          </div>
          <h1 className="text-xl font-bold text-primary">MindReMinder</h1>
        </div>

        <div className="ml-auto flex items-center space-x-2 sm:space-x-4">
          <Button variant="ghost" size="icon" onClick={() => console.log("Notification bell clicked!")}>
            <Bell className="h-5 w-5" />
            <span className="sr-only">View notifications</span>
          </Button>

          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      user.user_metadata?.profileImage ||
                      `/placeholder.svg?width=32&height=32&query=${userFirstName}+Avatar`
                    }
                    alt={userFirstName}
                  />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                <LogOutIcon className="mr-2 h-4 w-4" />
                {isLoggingOut ? "Logging out..." : "Log out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

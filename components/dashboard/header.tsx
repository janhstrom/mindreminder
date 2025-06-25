// This can be a Client Component if it needs client-side hooks like useTheme,
// or if onLogout is handled by a client-side form submission to a server action.
// For simplicity with server actions, we can make the logout button a mini-form.
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
import { Bell, Moon, Sun, User, LogOutIcon } from "lucide-react" // Renamed LogOut to LogOutIcon
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"

// Define a more specific UserProfile type
interface UserProfile extends SupabaseUser {
  firstName?: string
  lastName?: string
  profileImage?: string
}

interface HeaderProps {
  user: UserProfile // User data passed from Server Component
  onLogout: () => Promise<void> // The logout server action
  // onMenuClick: () => void // Assuming sidebar state is managed within DashboardClientContent now
}

export function Header({ user, onLogout }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await onLogout()
    // No need to router.push('/login') here, middleware or page protection will handle it.
    setIsLoggingOut(false)
  }

  const handleProfileClick = () => {
    router.push("/settings")
  }

  // The onMenuClick prop is removed as sidebar state is now internal to DashboardClientContent
  // If you need Header to toggle a sidebar managed at a higher level, you'd re-add onMenuClick
  // and adjust DashboardPage to pass it down from a state variable there, potentially making DashboardPage a client component.
  // For now, assuming sidebar is self-contained or managed by DashboardClientContent.

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-16 items-center px-4">
        {/* 
          If sidebar toggle is needed here, DashboardPage would need to manage sidebarOpen state
          and pass onMenuClick down. For now, this button is removed as sidebar state is in DashboardClientContent.
          Alternatively, a global state (Context/Zustand) could manage sidebar state.
        */}
        {/* <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button> */}
        <div className="flex items-center space-x-2">
          {" "}
          {/* Removed ml-2 if menu button is gone */}
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
                      user.profileImage ||
                      `/placeholder.svg?width=32&height=32&query=${user.firstName || "User"}+Avatar`
                    }
                    alt={user.firstName || "User"}
                  />
                  <AvatarFallback>{(user.firstName?.[0] || user.email?.[0] || "U").toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Logout can be a direct action call */}
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

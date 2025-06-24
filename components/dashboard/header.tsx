"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, Menu, Moon, Sun, User, LogOut } from "lucide-react"
import type { AuthUser } from "@/lib/auth-supabase"
import { useTheme } from "next-themes"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"

interface HeaderProps {
  user: AuthUser
  onMenuClick: () => void
}

export function Header({ user, onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const { signOut, operationLoading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
  }

  const handleProfileClick = () => {
    router.push("/settings")
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-16 items-center px-4">
        {/* This button will now be visible on all screen sizes to toggle the sidebar */}
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        <div className="flex items-center space-x-2 ml-2">
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
                    src={user.profileImage || `/placeholder.svg?width=32&height=32&query=User+Avatar`}
                    alt={user.firstName || "User"}
                  />
                  <AvatarFallback>{(user.firstName?.[0] || "U") + (user.lastName?.[0] || "")}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} disabled={operationLoading}>
                <LogOut className="mr-2 h-4 w-4" />
                {operationLoading ? "Logging out..." : "Log out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

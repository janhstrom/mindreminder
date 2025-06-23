import { LayoutDashboard, ListChecks, ShoppingCart, TrendingUp, Users } from "lucide-react"

import type { NavItem } from "@/types"

interface SidebarProps {
  isCollapsed: boolean
}

export const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const routes: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "customers",
      label: "Customers",
      icon: Users,
    },
    {
      id: "products",
      label: "Products",
      icon: ShoppingCart,
    },
    {
      id: "orders",
      label: "Orders",
      icon: ListChecks,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: TrendingUp,
    },
  ]

  return <div className="flex flex-col w-full h-full">{/* Sidebar content here */}</div>
}

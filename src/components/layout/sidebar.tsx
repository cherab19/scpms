"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  BarChart3, 
  Briefcase, 
  CheckSquare, 
  FileText, 
  LayoutDashboard, 
  Package, 
  Settings, 
  Truck, 
  Wallet 
} from "lucide-react"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Projects",
    icon: Briefcase,
    href: "/dashboard/projects",
  },
  {
    label: "Tasks",
    icon: CheckSquare,
    href: "/dashboard/tasks",
  },
  {
    label: "Materials",
    icon: Package,
    href: "/dashboard/materials",
  },
  {
    label: "Suppliers",
    icon: Truck,
    href: "/dashboard/suppliers",
  },
  {
    label: "Budgets",
    icon: Wallet,
    href: "/dashboard/budgets",
  },
  {
    label: "Documents",
    icon: FileText,
    href: "/dashboard/documents",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/dashboard/analytics",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white w-64">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          SCPMS
        </h1>
        <p className="text-sm text-slate-400">Project Management</p>
      </div>
      
      <div className="flex-1 px-3 py-2">
        <nav className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                pathname === route.href || pathname.startsWith(route.href + '/')
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

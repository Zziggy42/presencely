"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Search,
  Star,
  Globe,
  TrendingUp,
  Settings,
  Zap,
  ChevronRight,
  MapPin,
  Lightbulb,
  Users2,
  Target,
  CalendarDays,
  ClipboardList,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { businessInfo } from "@/lib/mock-data"

const navItems = [
  { href: "/dashboard",              label: "Overview",        icon: LayoutDashboard },
  { href: "/dashboard/visibility",   label: "Visibility",      icon: MapPin },
  { href: "/dashboard/traffic",      label: "Website Traffic", icon: TrendingUp },
  { href: "/dashboard/insights",     label: "Insights",        icon: Lightbulb,    badge: "New" },
  { href: "/dashboard/forecast",     label: "Forecast",        icon: CalendarDays, badge: "New" },
  { href: "/dashboard/staffing",     label: "Staffing",        icon: ClipboardList, badge: "Pro" },
  { href: "/dashboard/customers",    label: "Customers",       icon: Users2 },
  { href: "/dashboard/brand-gravity",label: "Brand Gravity",   icon: Target,       badge: "New" },
  { href: "/dashboard/reputation",   label: "Reviews",         icon: Star,         badge: "3" },
  { href: "/dashboard/seo",          label: "SEO Health",      icon: Search,       badge: "!" },
  { href: "/dashboard/settings",     label: "Settings",        icon: Settings },
]

// Bottom tab bar shows 5 most-used items on mobile
const mobileTabItems = [
  { href: "/dashboard",            label: "Home",      icon: LayoutDashboard },
  { href: "/dashboard/visibility", label: "Visibility", icon: MapPin },
  { href: "/dashboard/reputation", label: "Reviews",   icon: Star },
  { href: "/dashboard/seo",        label: "SEO",       icon: Search },
  { href: "/dashboard/settings",   label: "Settings",  icon: Settings },
]

function BadgeChip({ badge }: { badge: string }) {
  return (
    <Badge
      className={cn(
        "text-xs h-5 min-w-5 flex items-center justify-center",
        badge === "!"   ? "bg-red-500 text-white hover:bg-red-500"   :
        badge === "Pro" ? "bg-amber-500 text-white hover:bg-amber-500" :
                          "bg-indigo-400 text-white hover:bg-indigo-400"
      )}
    >
      {badge}
    </Badge>
  )
}

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* ── Desktop sidebar (hidden on mobile) ── */}
      <aside className="hidden md:flex w-64 bg-gray-950 text-white flex-col h-screen sticky top-0 shrink-0">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Presencely</span>
          </div>
        </div>

        {/* Business Info */}
        <div className="px-4 py-4 border-b border-gray-800">
          <div className="bg-gray-900 rounded-lg px-3 py-3">
            <p className="text-xs text-gray-400 mb-1">Currently viewing</p>
            <p className="text-sm font-semibold text-white truncate">{businessInfo.name}</p>
            <p className="text-xs text-gray-400 truncate">{businessInfo.category}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </div>
                {item.badge && <BadgeChip badge={item.badge} />}
              </Link>
            )
          })}
        </nav>

        {/* Plan Badge */}
        <div className="px-4 py-4 border-t border-gray-800">
          <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg px-3 py-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-indigo-300 font-medium">Pro Plan</span>
              <Globe className="w-3 h-3 text-indigo-300" />
            </div>
            <p className="text-xs text-gray-300">All features unlocked</p>
            <button className="mt-2 text-xs text-indigo-300 flex items-center gap-1 hover:text-white transition-colors">
              Manage plan <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-950 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white text-base tracking-tight">Presencely</span>
        </div>
        <div className="text-xs text-gray-400 font-medium truncate max-w-[140px] text-right">
          {businessInfo.name}
        </div>
      </div>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-950 border-t border-gray-800 flex">
        {mobileTabItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2 gap-1 text-[10px] font-medium transition-colors",
                isActive ? "text-indigo-400" : "text-gray-500"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-indigo-400" : "text-gray-500")} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}

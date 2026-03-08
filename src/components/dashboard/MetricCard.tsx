import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  label: string
  value: string | number
  change?: number
  icon: LucideIcon
  iconColor?: string
  suffix?: string
  description?: string
}

export default function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  iconColor = "text-indigo-600",
  suffix = "",
  description,
}: MetricCardProps) {
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">
              {typeof value === "number" ? value.toLocaleString() : value}
              {suffix && <span className="text-base font-normal text-gray-500 ml-1">{suffix}</span>}
            </p>
            {description && (
              <p className="text-xs text-gray-400 mt-1 truncate">{description}</p>
            )}
          </div>
          <div className={cn("p-2 rounded-lg bg-gray-50", iconColor.replace("text-", "text-"))}>
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
        </div>

        {change !== undefined && (
          <div className="mt-3 flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            ) : isNegative ? (
              <TrendingDown className="w-3.5 h-3.5 text-red-500" />
            ) : (
              <Minus className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span
              className={cn(
                "text-xs font-semibold",
                isPositive ? "text-emerald-600" : isNegative ? "text-red-500" : "text-gray-400"
              )}
            >
              {isPositive ? "+" : ""}{change}%
            </span>
            <span className="text-xs text-gray-400">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

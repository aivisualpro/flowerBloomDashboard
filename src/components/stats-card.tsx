"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  color?: string
}

export function StatsCard({ title, value, description, icon: Icon, color = "bg-primary" }: StatsCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-xl ${color} text-white shadow-sm`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-neutral-900 tracking-tight">{value}</div>
        {description && (
          <p className="text-xs text-neutral-400 mt-1 font-medium">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

import { Badge } from "@/components/ui/badge"

interface ThreatLevelBadgeProps {
  level: "Low" | "Medium" | "High" | "Critical" | "Unknown"
}

export function ThreatLevelBadge({ level }: ThreatLevelBadgeProps) {
  const variants = {
    Low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20",
    Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20",
    High: "bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20",
    Critical: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
    Unknown: "bg-slate-500/10 text-slate-500 border-slate-500/20 hover:bg-slate-500/20",
  }

  return (
    <Badge variant="outline" className={variants[level]}>
      {level}
    </Badge>
  )
}

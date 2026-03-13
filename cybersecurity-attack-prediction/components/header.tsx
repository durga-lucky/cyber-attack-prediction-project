import { Search, Bell, User as UserIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/auth"
import type { User } from "@/lib/api"

export function Header() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  return (
    <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <h1 className="text-xl font-semibold hidden md:block">Cyber Attack Prediction System</h1>
        <div className="relative max-w-md w-full ml-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search threats, IPs, logs..."
            className="pl-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
        </Button>
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{user?.username || "Guest"}</p>
            <p className="text-xs text-muted-foreground">{user?.email || "Read Only"}</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full bg-primary/10">
            <UserIcon className="w-5 h-5 text-primary" />
          </Button>
        </div>
      </div>
    </header>
  )
}

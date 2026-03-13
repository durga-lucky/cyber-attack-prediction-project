"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { SidebarNav } from "@/components/sidebar-nav"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Pages that should not have sidebar/header
    const authPages = ["/login", "/register", "/"]
    const isAuthPage = authPages.includes(pathname)

    if (isAuthPage) {
        return <>{children}</>
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background text-foreground">
            <SidebarNav />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-8">{children}</main>
            </div>
        </div>
    )
}

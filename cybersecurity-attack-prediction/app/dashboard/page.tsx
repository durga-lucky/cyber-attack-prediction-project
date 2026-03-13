"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { StatCard } from "@/components/stat-card"
import { ThreatLevelBadge } from "@/components/threat-level-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldAlert, Activity, AlertTriangle, Database, LogOut, Loader2 } from "lucide-react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { getCurrentUser, logout } from "@/lib/auth"
import { getDashboardStats, getRecentThreats, getRiskData } from "@/lib/api"
import type { DashboardStats, Threat, RiskDataPoint } from "@/lib/api"

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState(getCurrentUser())
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [threats, setThreats] = useState<Threat[]>([])
    const [riskData, setRiskData] = useState<RiskDataPoint[]>([])

    useEffect(() => {
        // Check authentication
        const currentUser = getCurrentUser()
        if (!currentUser) {
            router.push("/login")
            return
        }
        setUser(currentUser)

        // Load dashboard data
        loadDashboardData()
    }, [router])

    const loadDashboardData = async () => {
        try {
            setLoading(true)
            const [statsData, threatsData, riskChartData] = await Promise.all([
                getDashboardStats(),
                getRecentThreats(),
                getRiskData(),
            ])

            setStats(statsData)
            setThreats(threatsData)
            setRiskData(riskChartData)
        } catch (error) {
            console.error("Failed to load dashboard data:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    if (!user) {
        return null
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Security Dashboard</h2>
                    <p className="text-muted-foreground">
                        Welcome back, <span className="font-medium text-foreground">{user.username}</span>
                    </p>
                </div>
                <Button variant="outline" onClick={handleLogout} className="gap-2">
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Threat Level"
                            value={stats?.threatLevel || "Low"}
                            icon={ShieldAlert}
                            trend="+2 since last hour"
                            trendUp={true}
                        />
                        <StatCard
                            title="Risk Score"
                            value={stats?.riskScore.toString() || "0"}
                            icon={Activity}
                            trend="-5 from yesterday"
                            trendUp={false}
                        />
                        <StatCard
                            title="Total Requests"
                            value={stats?.totalRequests.toLocaleString() || "0"}
                            icon={Database}
                            trend="+12.5% this week"
                            trendUp={false}
                        />
                        <StatCard
                            title="Anomalies Detected"
                            value={stats?.anomaliesDetected.toString() || "0"}
                            icon={AlertTriangle}
                            trend="+8 in last hour"
                            trendUp={true}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 bg-card border-border">
                            <CardHeader>
                                <CardTitle>Risk Score Over Time</CardTitle>
                                <CardDescription>Last 24 hours threat analysis</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={riskData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 250)" />
                                        <XAxis dataKey="time" stroke="oklch(0.45 0.02 250)" fontSize={12} />
                                        <YAxis stroke="oklch(0.45 0.02 250)" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "oklch(1 0 0)",
                                                border: "1px solid oklch(0.9 0.01 250)",
                                                borderRadius: "8px",
                                                color: "oklch(0.15 0 0)",
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="risk"
                                            stroke="oklch(0.5 0.2 250)"
                                            strokeWidth={2}
                                            dot={{ fill: "oklch(0.5 0.2 250)", r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle>Recent Threats</CardTitle>
                                <CardDescription>Latest detected anomalies</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {threats.length > 0 ? (
                                    threats.map((threat) => (
                                        <div key={threat.id} className="flex flex-col gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold truncate">{threat.ip}</p>
                                                    <p className="text-xs text-muted-foreground">{threat.type}</p>
                                                </div>
                                                <ThreatLevelBadge level={threat.level} />
                                            </div>
                                            <p className="text-xs text-muted-foreground">{threat.time}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">No threats detected</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    )
}

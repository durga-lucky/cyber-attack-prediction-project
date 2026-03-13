"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Terminal, Play, Square, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const API_BASE_URL = "https://cyber-attack-prediction-project.onrender.com"

interface LogEntry {
    id: string
    timestamp: string
    sourceIp: string
    destIp: string
    protocol: string
    prediction: string
    riskScore: number
    riskLevel: string
    details: string
}

export function LogTerminal() {
    const [logs, setLogs] = useState<LogEntry[]>([])
    const [isRunning, setIsRunning] = useState(false)
    const [isPolling, setIsPolling] = useState(false)

    // Poll logs
    useEffect(() => {
        let interval: NodeJS.Timeout

        if (isPolling) {
            interval = setInterval(async () => {
                try {
                    const res = await fetch(
                        `${API_BASE_URL}/predictions/simulation@cyberguard.ai`
                    )

                    if (res.ok) {
                        const data = await res.json()

                        const newLogs = data.predictions.map((p: any) => ({
                            id: p._id,
                            timestamp: new Date().toLocaleTimeString(),
                            sourceIp: p.sourceIp,
                            destIp: p.destIp,
                            protocol: p.protocol,
                            prediction: p.prediction,
                            riskScore: p.riskScore,
                            riskLevel: p.riskLevel,
                            details: p.details,
                        }))

                        setLogs((prev) => {
                            const existingIds = new Set(prev.map((l) => l.id))
                            const uniqueNew = newLogs.filter(
                                (l: LogEntry) => !existingIds.has(l.id)
                            )

                            if (uniqueNew.length === 0) return prev

                            return [...uniqueNew, ...prev].slice(0, 100)
                        })
                    }
                } catch (error) {
                    console.error("Error fetching logs:", error)
                }
            }, 1000)
        }

        return () => clearInterval(interval)
    }, [isPolling])

    const startSimulation = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/simulation/start`, {
                method: "POST",
            })

            if (res.ok) {
                setIsRunning(true)
                setIsPolling(true)
            }
        } catch (error) {
            console.error("Failed to start simulation:", error)
        }
    }

    const stopSimulation = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/simulation/stop`, {
                method: "POST",
            })

            if (res.ok) {
                setIsRunning(false)
                setIsPolling(false)
            }
        } catch (error) {
            console.error("Failed to stop simulation:", error)
        }
    }

    const clearLogs = () => {
        setLogs([])
    }

    return (
        <div className="w-full max-w-4xl mx-auto my-8 border border-border rounded-lg overflow-hidden bg-[#0c0c0c] shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-border/20">
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-mono text-muted-foreground">
                        ATTACK SIMULATION TERMINAL
                    </span>
                </div>

                <Badge
                    variant={isRunning ? "destructive" : "secondary"}
                    className="text-[10px] h-5"
                >
                    {isRunning ? "LIVE ATTACK RUNNING" : "STANDBY"}
                </Badge>
            </div>

            <div className="p-4 bg-[#0c0c0c]">
                <div className="flex gap-2 mb-4">
                    {!isRunning ? (
                        <Button
                            size="sm"
                            onClick={startSimulation}
                            className="bg-green-600 hover:bg-green-700 text-white font-mono text-xs"
                        >
                            <Play className="w-3 h-3 mr-2" />
                            INITIATE_ATTACK_SEQUENCE
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            onClick={stopSimulation}
                            variant="destructive"
                            className="font-mono text-xs"
                        >
                            <Square className="w-3 h-3 mr-2" />
                            TERMINATE_SEQUENCE
                        </Button>
                    )}

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={clearLogs}
                        className="font-mono text-xs border-dashed"
                    >
                        <RefreshCw className="w-3 h-3 mr-2" />
                        CLEAR_BUFFER
                    </Button>
                </div>

                <ScrollArea className="h-[400px] w-full border border-green-900/20 rounded-md bg-black p-4 font-mono text-xs">
                    {logs.length === 0 ? (
                        <div className="text-green-900/50 italic text-center mt-32">
                            Waiting for network traffic...
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {logs.map((log) => (
                                <div
                                    key={log.id}
                                    className="flex gap-2 items-start opacity-90 hover:opacity-100 hover:bg-white/5 p-0.5 rounded"
                                >
                                    <span className="text-muted-foreground">
                                        [{log.timestamp}]
                                    </span>

                                    <span
                                        className={`font-bold ${
                                            log.prediction === "Attack"
                                                ? "text-red-500"
                                                : "text-green-500"
                                        }`}
                                    >
                                        {log.prediction.toUpperCase()}
                                    </span>

                                    <span className="text-blue-400">
                                        {log.protocol}
                                    </span>

                                    <span className="text-yellow-600">
                                        {log.sourceIp}
                                    </span>

                                    <span className="text-muted-foreground">
                                        →
                                    </span>

                                    <span className="text-yellow-600">
                                        {log.destIp}
                                    </span>

                                    <span className="text-gray-500 truncate">
                                        - {log.details}
                                    </span>

                                    <span className="ml-auto">
                                        R:{log.riskScore}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    )
}

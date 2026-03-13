"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ThreatLevelBadge } from "@/components/threat-level-badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface LogEntry {
  id: number
  timestamp: string
  sourceIp: string
  protocol: string
  prediction: "Normal" | "Attack"
  riskScore: number
  riskLevel: "Low" | "Medium" | "High" | "Critical"
}

const mockLogs: LogEntry[] = [
  {
    id: 1,
    timestamp: "2024-01-02 14:23:45",
    sourceIp: "192.168.1.45",
    protocol: "TCP",
    prediction: "Attack",
    riskScore: 87,
    riskLevel: "High",
  },
  {
    id: 2,
    timestamp: "2024-01-02 14:22:10",
    sourceIp: "10.0.0.123",
    protocol: "UDP",
    prediction: "Normal",
    riskScore: 12,
    riskLevel: "Low",
  },
  {
    id: 3,
    timestamp: "2024-01-02 14:20:33",
    sourceIp: "172.16.0.88",
    protocol: "TCP",
    prediction: "Attack",
    riskScore: 95,
    riskLevel: "Critical",
  },
  {
    id: 4,
    timestamp: "2024-01-02 14:18:56",
    sourceIp: "192.168.0.45",
    protocol: "ICMP",
    prediction: "Normal",
    riskScore: 8,
    riskLevel: "Low",
  },
  {
    id: 5,
    timestamp: "2024-01-02 14:15:22",
    sourceIp: "10.10.10.50",
    protocol: "TCP",
    prediction: "Attack",
    riskScore: 62,
    riskLevel: "Medium",
  },
  {
    id: 6,
    timestamp: "2024-01-02 14:12:08",
    sourceIp: "172.20.5.100",
    protocol: "UDP",
    prediction: "Normal",
    riskScore: 15,
    riskLevel: "Low",
  },
  {
    id: 7,
    timestamp: "2024-01-02 14:10:45",
    sourceIp: "192.168.1.201",
    protocol: "TCP",
    prediction: "Attack",
    riskScore: 78,
    riskLevel: "High",
  },
  {
    id: 8,
    timestamp: "2024-01-02 14:08:30",
    sourceIp: "10.5.5.5",
    protocol: "UDP",
    prediction: "Normal",
    riskScore: 5,
    riskLevel: "Low",
  },
]

const ITEMS_PER_PAGE = 6

export default function LogsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(mockLogs.length / ITEMS_PER_PAGE)

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentLogs = mockLogs.slice(startIndex, endIndex)

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Activity Logs</h2>
          <p className="text-muted-foreground">Historical network traffic analysis records</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Network Traffic Logs</CardTitle>
          <CardDescription>
            Showing {startIndex + 1}-{Math.min(endIndex, mockLogs.length)} of {mockLogs.length} entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">Timestamp</TableHead>
                  <TableHead className="font-semibold">Source IP</TableHead>
                  <TableHead className="font-semibold">Protocol</TableHead>
                  <TableHead className="font-semibold">Prediction</TableHead>
                  <TableHead className="font-semibold">Risk Score</TableHead>
                  <TableHead className="font-semibold">Risk Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                    <TableCell className="font-mono text-sm">{log.sourceIp}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {log.protocol}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {log.prediction === "Attack" ? (
                        <Badge variant="destructive" className="bg-destructive/20 text-destructive">
                          Attack
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-500/20 text-green-500 border-green-500/30">
                          Normal
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{log.riskScore}</span>
                      <span className="text-muted-foreground text-sm">/100</span>
                    </TableCell>
                    <TableCell>
                      <ThreatLevelBadge level={log.riskLevel} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThreatLevelBadge } from "@/components/threat-level-badge"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { predictAttack } from "@/lib/api"
import type { PredictionResult } from "@/lib/api"

export default function PredictPage() {
  const router = useRouter()
  const [user, setUser] = useState(getCurrentUser())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [formData, setFormData] = useState({
    sourceIp: "",
    destIp: "",
    protocol: "",
    packetSize: "",
    requestRate: "",
  })

  useEffect(() => {
    // Check authentication
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setResult(null)
    setError("")

    try {
      const prediction = await predictAttack({
        email: user.email,
        sourceIp: formData.sourceIp,
        destIp: formData.destIp,
        protocol: formData.protocol,
        packetSize: formData.packetSize,
        requestRate: formData.requestRate,
      })

      setResult(prediction)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prediction failed")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Predict Attack</h2>
        <p className="text-muted-foreground">Analyze network traffic patterns to detect potential threats</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Network Traffic Parameters</CardTitle>
            <CardDescription>Enter the details to analyze</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sourceIp">Source IP Address</Label>
                <Input
                  id="sourceIp"
                  placeholder="192.168.1.100"
                  value={formData.sourceIp}
                  onChange={(e) => setFormData({ ...formData, sourceIp: e.target.value })}
                  required
                  className="bg-muted/50 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destIp">Destination IP Address</Label>
                <Input
                  id="destIp"
                  placeholder="10.0.0.1"
                  value={formData.destIp}
                  onChange={(e) => setFormData({ ...formData, destIp: e.target.value })}
                  required
                  className="bg-muted/50 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="protocol">Protocol</Label>
                <Select
                  value={formData.protocol}
                  onValueChange={(value) => setFormData({ ...formData, protocol: value })}
                  required
                >
                  <SelectTrigger id="protocol" className="bg-muted/50 border-border">
                    <SelectValue placeholder="Select protocol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tcp">TCP</SelectItem>
                    <SelectItem value="udp">UDP</SelectItem>
                    <SelectItem value="icmp">ICMP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="packetSize">Packet Size (bytes)</Label>
                <Input
                  id="packetSize"
                  type="number"
                  placeholder="1500"
                  value={formData.packetSize}
                  onChange={(e) => setFormData({ ...formData, packetSize: e.target.value })}
                  required
                  className="bg-muted/50 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requestRate">Request Rate (req/s)</Label>
                <Input
                  id="requestRate"
                  type="number"
                  placeholder="100"
                  value={formData.requestRate}
                  onChange={(e) => setFormData({ ...formData, requestRate: e.target.value })}
                  required
                  className="bg-muted/50 border-border"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Traffic"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>AI-powered threat detection</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">Processing network traffic data...</p>
              </div>
            )}

            {!loading && !result && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Enter network parameters and click analyze to see results
                </p>
              </div>
            )}

            {!loading && result && (
              <div className="space-y-6">
                <div className="flex items-center justify-center py-6">
                  {result.prediction === "Attack" ? (
                    <div className="flex flex-col items-center">
                      <div className="p-4 rounded-full bg-destructive/10 mb-4">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                      </div>
                      <h3 className="text-2xl font-bold text-destructive">Threat Detected</h3>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="p-4 rounded-full bg-green-500/10 mb-4">
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-green-500">Traffic Normal</h3>
                    </div>
                  )}
                </div>
                {/* 
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 rounded-lg bg-muted/50 border border-border">
                    <span className="text-sm font-medium">Primary Prediction</span>
                    <span className="text-sm font-bold">{result.prediction}</span>
                  </div>

                  <div className="flex justify-between items-center p-4 rounded-lg bg-muted/50 border border-border">
                    <span className="text-sm font-medium">Confidence Score</span>
                    <span className="text-sm font-bold">{result.confidence}%</span>
                  </div>

                  <div className="flex justify-between items-center p-4 rounded-lg bg-muted/50 border border-border">
                    <span className="text-sm font-medium">Risk Score</span>
                    <span className="text-sm font-bold">{result.riskScore}/100</span>
                  </div>

                  <div className="flex justify-between items-center p-4 rounded-lg bg-muted/50 border border-border">
                    <span className="text-sm font-medium">Risk Level</span>
                    <ThreatLevelBadge level={result.riskLevel} />
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm font-medium mb-2">Analysis Details</p>
                    <p className="text-sm text-muted-foreground">{result.details}</p>
                  </div>
                </div> */}

                {/* GenAI Prediction Section */}
                {result.genaiPrediction && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span className="text-purple-500">✨</span> GenAI Analysis Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3 p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Prediction</span>
                          <span className="text-sm font-bold">{result.genaiPrediction.prediction}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Confidence</span>
                          <span className="text-sm font-bold">{result.genaiPrediction.confidence}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Risk Score</span>
                          <span className="text-sm font-bold">{result.genaiPrediction.riskScore}/100</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Risk Level</span>
                          <ThreatLevelBadge level={result.genaiPrediction.riskLevel} />
                        </div>
                      </div>

                      <div className="space-y-3 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Model</span>
                          <span className="text-sm font-mono text-xs truncate max-w-[150px]" title={result.genaiPrediction.model || result.model}>
                            {result.genaiPrediction.model || result.model || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Inference Time</span>
                          <span className="text-sm font-bold text-blue-400">
                            {(result.genaiPrediction.time || result.time || 0).toFixed(2)}s
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Tokens Used</span>
                          <span className="text-sm font-bold text-blue-400">
                            {result.genaiPrediction.tokens || result.tokens || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                          <span>Status: Online</span>
                          <span>Provider: OpenRouter</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border">
                      <p className="text-sm font-medium mb-1">Detailed AI Explanation</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {result.genaiPrediction.details}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

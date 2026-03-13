const API_BASE_URL = "http://localhost:8000"

export interface User {
    username: string
    email: string
}

export interface PredictionOutput {
    prediction: "Normal" | "Attack" | "Unknown" | "Error"
    confidence: number
    riskLevel: "Low" | "Medium" | "High" | "Critical" | "Unknown"
    details: string
    riskScore: number
    tokens?: number
    time?: number
    model?: string
}

export interface PredictionResult {
    prediction: "Normal" | "Attack" | "Unknown" | "Error"
    confidence: number
    riskLevel: "Low" | "Medium" | "High" | "Critical" | "Unknown"
    details: string
    riskScore: number
    tokens?: number
    time?: number
    model?: string
    genaiPrediction?: PredictionOutput | null
    mlPrediction?: PredictionOutput | null
}

export interface DashboardStats {
    threatLevel: string
    riskScore: number
    totalRequests: number
    anomaliesDetected: number
}

export interface Threat {
    id: string
    ip: string
    type: string
    level: "Low" | "Medium" | "High" | "Critical"
    time: string
}

export interface RiskDataPoint {
    time: string
    risk: number
}

// Authentication APIs
export async function signup(username: string, email: string, password: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error || "Signup failed")
    }

    return data
}

export async function login(email: string, password: string): Promise<{ message: string; user: User }> {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error || "Login failed")
    }

    return data
}

export async function getUser(email: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/${email}`)

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error || "Failed to fetch user")
    }

    return data
}

export async function updateUser(email: string, updates: Partial<User>): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/user/${email}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error || "Failed to update user")
    }

    return data
}

// Attack Prediction APIs
export async function predictAttack(data: {
    email: string
    sourceIp: string
    destIp: string
    protocol: string
    packetSize: string
    requestRate: string
}): Promise<PredictionResult> {
    const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
        throw new Error(result.error || "Prediction failed")
    }

    return result
}

export async function getPredictions(email: string) {
    const response = await fetch(`${API_BASE_URL}/predictions/${email}`)

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error || "Failed to fetch predictions")
    }

    return data.predictions
}

// Dashboard APIs
export async function getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`)

    const data = await response.json()

    if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats")
    }

    return data
}

export async function getRecentThreats(): Promise<Threat[]> {
    const response = await fetch(`${API_BASE_URL}/dashboard/threats`)

    const data = await response.json()

    if (!response.ok) {
        throw new Error("Failed to fetch recent threats")
    }

    return data.threats
}

export async function getRiskData(): Promise<RiskDataPoint[]> {
    const response = await fetch(`${API_BASE_URL}/dashboard/risk-data`)

    const data = await response.json()

    if (!response.ok) {
        throw new Error("Failed to fetch risk data")
    }

    return data.riskData
}

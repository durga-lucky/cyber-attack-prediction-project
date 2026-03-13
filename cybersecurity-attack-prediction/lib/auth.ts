import type { User } from "./api"

const USER_KEY = "cybersecurity_user"

export function getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    const userStr = localStorage.getItem(USER_KEY)
    if (!userStr) return null

    try {
        return JSON.parse(userStr)
    } catch {
        return null
    }
}

export function setCurrentUser(user: User): void {
    if (typeof window === "undefined") return
    localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function logout(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(USER_KEY)
}

export function isAuthenticated(): boolean {
    return getCurrentUser() !== null
}

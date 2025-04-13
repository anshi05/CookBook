"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: number
  name: string
  email: string
  role: string
} | null

type AuthContextType = {
  user: User
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUserFromSession() {
      try {
        console.log("Loading user from session...")
        const res = await fetch("/api/auth/me")

        console.log("Auth response status:", res.status)

        if (res.ok) {
          const data = await res.json()
          console.log("User data received:", data.user ? `${data.user.name} (${data.user.email})` : "No user")
          setUser(data.user)
        } else {
          console.log("Failed to load user session:", await res.text())
        }
      } catch (error) {
        console.error("Error loading user session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserFromSession()
  }, [])

  return <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

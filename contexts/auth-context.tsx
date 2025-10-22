"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { User, AuthContextType } from "@/types/user"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProvider Simplificado (Sin Validación)
 * 
 * Este provider está configurado para desarrollo sin autenticación.
 * Login/Register solo simulan el proceso pero no validan credenciales.
 * 
 * Cuando se implemente el backend:
 * - Reemplazar con llamadas API reales
 * - Agregar validación JWT
 * - Implementar refresh tokens
 */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // DESARROLLO: Login sin validación
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Crear usuario ficticio
    const mockUser: User = {
      id: "mock-user-id",
      name: email.split("@")[0],
      email: email,
      createdAt: new Date().toISOString(),
    }

    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
    
    console.log("✅ Login simulado exitoso:", email)
  }

  const register = async (name: string, email: string, password: string) => {
    // DESARROLLO: Register sin validación
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Crear usuario ficticio
    const mockUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      createdAt: new Date().toISOString(),
    }

    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
    
    console.log("✅ Registro simulado exitoso:", name, email)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
    console.log("✅ Logout exitoso")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

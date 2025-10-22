// Mock authentication service
export interface User {
  id: string
  email: string
  name: string
}

const MOCK_USER: User = {
  id: "1",
  email: "admin@adopciones.com",
  name: "Administrador",
}

const MOCK_CREDENTIALS = {
  email: "admin@adopciones.com",
  password: "admin123",
}

export async function login(email: string, password: string): Promise<User> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
    // Store in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_user", JSON.stringify(MOCK_USER))
    }
    return MOCK_USER
  }

  throw new Error("Credenciales inválidas")
}

export async function logout(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_user")
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("auth_user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

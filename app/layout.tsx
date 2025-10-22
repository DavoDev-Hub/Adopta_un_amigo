import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "Adopta un Amigo - Plataforma de Adopción",
  description:
    "Plataforma de adopción de animales. Encuentra perros, gatos y otros animales que buscan un hogar lleno de amor.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <Suspense fallback={null}>
            {children}
            <Toaster />
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}

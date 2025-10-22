"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PawPrint, FileText, CheckCircle, XCircle, Clock, Heart } from "lucide-react"
import { getStats } from "@/lib/admin-api"

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalAnimals: 0,
    animalsReady: 0,
    animalsRecovering: 0,
    animalsAdopted: 0,
    totalApplications: 0,
    applicationsReceived: 0,
    applicationsInReview: 0,
    applicationsApproved: 0,
    applicationsRejected: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await getStats()
      setStats(data)
    } catch (error) {
      console.error("Error loading stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Animales",
      value: stats.totalAnimals,
      icon: PawPrint,
      color: "text-primary",
    },
    {
      title: "Listos para Adopción",
      value: stats.animalsReady,
      icon: Heart,
      color: "text-success",
    },
    {
      title: "En Recuperación",
      value: stats.animalsRecovering,
      icon: Clock,
      color: "text-warning",
    },
    {
      title: "Adoptados",
      value: stats.animalsAdopted,
      icon: CheckCircle,
      color: "text-success",
    },
    {
      title: "Total Solicitudes",
      value: stats.totalApplications,
      icon: FileText,
      color: "text-primary",
    },
    {
      title: "Recibidas",
      value: stats.applicationsReceived,
      icon: FileText,
      color: "text-info",
    },
    {
      title: "En Revisión",
      value: stats.applicationsInReview,
      icon: Clock,
      color: "text-warning",
    },
    {
      title: "Aprobadas",
      value: stats.applicationsApproved,
      icon: CheckCircle,
      color: "text-success",
    },
    {
      title: "Rechazadas",
      value: stats.applicationsRejected,
      icon: XCircle,
      color: "text-destructive",
    },
  ]

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Cargando...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Resumen general del sistema de adopciones</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

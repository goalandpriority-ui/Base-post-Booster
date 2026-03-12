"use client"

import { useEffect, useState } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"
import { Line, Bar } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    boosts: 0,
    revenue: 0,
    users: 0
  })

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/analytics")
        const data = await res.json()

        setStats({
          boosts: data.boosts || 0,
          revenue: data.revenue || 0,
          users: data.users || 0
        })
      } catch (err) {
        console.log("Analytics load error", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Boost Activity",
        data: [5, 9, 6, 12, 8, 15, 10],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.3)"
      }
    ]
  }

  const barData = {
    labels: ["Users", "Boosts", "Revenue"],
    datasets: [
      {
        label: "Platform Stats",
        data: [stats.users, stats.boosts, stats.revenue],
        backgroundColor: ["#22c55e", "#6366f1", "#f59e0b"]
      }
    ]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading analytics...
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">

      <h1 className="text-3xl font-bold">📊 Analytics Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-gray-500">Users</h2>
          <p className="text-2xl font-bold">{stats.users}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-gray-500">Boosts</h2>
          <p className="text-2xl font-bold">{stats.boosts}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-gray-500">Revenue</h2>
          <p className="text-2xl font-bold">${stats.revenue}</p>
        </div>

      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Weekly Boost Activity</h2>
        <Line data={lineData} />
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Platform Overview</h2>
        <Bar data={barData} />
      </div>

    </div>
  )
}

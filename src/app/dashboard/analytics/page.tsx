"use client"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js"
import { Bar, Doughnut, Line } from "react-chartjs-2"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export default function AnalyticsPage() {
  const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Budget Allocated ($)',
        data: [65000, 59000, 80000, 81000, 56000, 55000, 40000],
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
      {
        label: 'Actual Spent ($)',
        data: [28000, 48000, 40000, 19000, 86000, 27000, 90000],
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
    ],
  }

  const doughnutData = {
    labels: ['Planning', 'Active', 'On Hold', 'Completed'],
    datasets: [
      {
        data: [12, 19, 3, 5],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(148, 163, 184, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const lineData = {
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
    datasets: [
      {
        label: 'Task Completion Velocity',
        data: [12, 19, 15, 25, 22, 30, 28, 35],
        borderColor: 'rgb(99, 102, 241)',
        tension: 0.3,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
        <p className="text-muted-foreground">Deep dive into your project metrics and insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget vs Spent</CardTitle>
            <CardDescription>Financial performance over the last 7 months</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <Bar 
              data={barData} 
              options={{ maintainAspectRatio: false, responsive: true }} 
            />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>Project Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <Doughnut 
                data={doughnutData} 
                options={{ maintainAspectRatio: false, responsive: true, cutout: '70%' }} 
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Completion Velocity</CardTitle>
          <CardDescription>Team performance tracking over the past 8 weeks</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <Line 
            data={lineData} 
            options={{ maintainAspectRatio: false, responsive: true }} 
          />
        </CardContent>
      </Card>
    </div>
  )
}

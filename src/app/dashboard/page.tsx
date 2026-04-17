"use client"

import { useQuery } from "@tanstack/react-query"
import { BarChart3, Briefcase, CheckSquare, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // For MVP, we're fetching from multiple endpoints, normally this would be one /api/dashboard
      const [projectsRes, tasksRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/tasks')
      ])
      const [projects, tasks] = await Promise.all([
        projectsRes.ok ? projectsRes.json() : [],
        tasksRes.ok ? tasksRes.json() : []
      ])
      
      const activeProjects = projects.filter((p: any) => p.status === 'ACTIVE').length
      const completedTasks = tasks.filter((t: any) => t.status === 'COMPLETED').length
      
      return {
        totalProjects: projects.length,
        activeProjects,
        totalTasks: tasks.length,
        completedTasks,
        pendingTasks: tasks.length - completedTasks
      }
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back. Here's what's happening across your projects today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 bg-slate-100 rounded animate-pulse"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.totalProjects || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.activeProjects || 0} currently active
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasks Assigend</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 bg-slate-100 rounded animate-pulse"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.totalTasks || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.completedTasks || 0} completed
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Workforce</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 bg-slate-100 rounded animate-pulse"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground mt-1 text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> +2 this week
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading ? (
              <div className="h-8 bg-slate-100 rounded animate-pulse"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">42%</div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: `42%` }} />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common project management operations</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col items-center justify-center gap-2" asChild>
                <Link href="/dashboard/projects">
                  <Briefcase className="h-5 w-5" />
                  View Projects
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col items-center justify-center gap-2" asChild>
                <Link href="/dashboard/tasks">
                  <CheckSquare className="h-5 w-5" />
                  Manage Tasks
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col items-center justify-center gap-2" asChild>
                <Link href="/dashboard/analytics">
                  <BarChart3 className="h-5 w-5" />
                  View Reports
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col items-center justify-center gap-2" asChild>
                <Link href="/dashboard/budgets">
                  <TrendingUp className="h-5 w-5" />
                  Check Finances
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Latest alerts across your sites</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="flex gap-4 items-start pb-4 border-b last:border-0 last:pb-0">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-primary text-xs font-bold">A</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">New materials delivered to Site Alpha</p>
                      <p className="text-xs text-muted-foreground mt-0.5">2 hours ago</p>
                    </div>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

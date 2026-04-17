"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { format } from "date-fns"
import { Calendar, User, FileText, CheckSquare, Package, Wallet } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function ProjectDetails() {
  const params = useParams()
  const projectId = params.id as string

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}`)
      if (!res.ok) throw new Error('Failed to fetch project')
      return res.json()
    }
  })

  if (isLoading) {
    return <div className="space-y-4 animate-pulse">
      <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
      <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
    </div>
  }

  if (!project) return <div>Project not found</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
            <Badge variant="outline">{project.status}</Badge>
          </div>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        
        <div className="flex gap-4 text-sm bg-slate-50 dark:bg-slate-900 border px-4 py-2 rounded-lg">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-500" />
            <span>{project.manager?.name || "Unassigned"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-500" />
            <span>
              {project.startDate ? format(new Date(project.startDate), 'MMM dd, yyyy') : 'No start date'} 
              {' - '}
              {project.endDate ? format(new Date(project.endDate), 'MMM dd, yyyy') : 'No end date'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-slate-500">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.progress}%</div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: `${project.progress}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-slate-500">Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.members.length} Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-slate-500">Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.tasks?.length || 0} Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-slate-500">Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.materials?.length || 0} Items</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks" className="flex gap-2"><CheckSquare className="h-4 w-4" /> Tasks</TabsTrigger>
          <TabsTrigger value="budget" className="flex gap-2"><Wallet className="h-4 w-4" /> Budget</TabsTrigger>
          <TabsTrigger value="materials" className="flex gap-2"><Package className="h-4 w-4" /> Materials</TabsTrigger>
          <TabsTrigger value="documents" className="flex gap-2"><FileText className="h-4 w-4" /> Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates on this project</CardDescription>
            </CardHeader>
            <CardContent>  
              <p className="text-sm text-muted-foreground">Detailed activity feed will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Project Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {project.tasks?.length > 0 ? (
                <ul className="space-y-4">
                  {project.tasks.map((task: any) => (
                    <li key={task.id} className="flex justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                      <Badge>{task.status}</Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No tasks added yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Budget tracking module coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>Materials Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Material tracking module coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Project Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Document management module coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { Plus, Search, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Project {
  id: string
  title: string
  description: string
  status: string
  progress: number
  manager: { name: string, email: string }
  _count: { tasks: number, members: number }
  createdAt: string
}

export default function ProjectsPage() {
  const [search, setSearch] = useState("")

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch('/api/projects')
      if (!res.ok) throw new Error('Failed to fetch projects')
      return res.json()
    }
  })

  // Filter projects based on search
  const filteredProjects = projects?.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.description?.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'PLANNING': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'COMPLETED': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage and track your construction projects</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Note: This would typically open a modal to create a project */}
          <Button asChild>
            <Link href="/dashboard/projects/new">
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-slate-100 dark:bg-slate-800 rounded-t-xl" />
              <CardContent className="h-32 bg-slate-50 dark:bg-slate-900 rounded-b-xl" />
            </Card>
          ))}
        </div>
      ) : filteredProjects?.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-950 rounded-lg border border-dashed">
          <h3 className="text-lg font-medium">No projects found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search or create a new project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects?.map(project => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <CardTitle className="text-xl line-clamp-1">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-2 min-h-[40px]">
                    {project.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-4 border-t">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-muted-foreground pt-2">
                      <div className="flex items-center gap-4">
                        <span title="Tasks">📝 {project._count.tasks} Tasks</span>
                        <span title="Members">👥 {project._count.members} Members</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

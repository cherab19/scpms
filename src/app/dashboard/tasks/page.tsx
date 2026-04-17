"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Calendar, CheckCircle2, Circle, Clock, MoreHorizontal, Plus } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const statuses = ["PENDING", "IN_PROGRESS", "COMPLETED", "BLOCKED"]

export default function TasksPage() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await fetch('/api/tasks')
      if (!res.ok) throw new Error('Failed to fetch tasks')
      return res.json()
    }
  })

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-10 bg-slate-100 rounded w-1/4"></div>
      <div className="flex gap-4">
        {[1, 2, 3].map(i => <div key={i} className="flex-1 h-96 bg-slate-50 rounded-xl"></div>)}
      </div>
    </div>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'IN_PROGRESS': return <Clock className="h-4 w-4 text-blue-500" />
      case 'BLOCKED': return <Circle className="h-4 w-4 text-red-500" />
      default: return <Circle className="h-4 w-4 text-slate-400 border-dotted" />
    }
  }

  // Group tasks for Kanban board
  const getTasksByStatus = (status: string) => tasks?.filter((t: any) => t.status === status) || []

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage your assignments and tracking progress</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max h-full">
          {statuses.map(status => {
            const columnTasks = getTasksByStatus(status)
            return (
              <div key={status} className="w-80 flex flex-col bg-slate-100/50 dark:bg-slate-900/50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    {getStatusIcon(status)}
                    <span className="capitalize">{status.replace('_', ' ')}</span>
                  </h3>
                  <Badge variant="secondary">{columnTasks.length}</Badge>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3">
                  {columnTasks.map((task: any) => (
                    <Card key={task.id} className="cursor-pointer hover:border-primary/50 transition-colors shadow-sm">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <Badge variant="outline" className="mb-2 text-xs">
                            {task.project.title}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardTitle className="text-base font-medium leading-tight">
                          {task.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {task.description}
                        </p>
                        <div className="flex justify-between items-center text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {task.dueDate ? format(new Date(task.dueDate), 'MMM d') : 'No due date'}
                          </div>
                          {task.assignee ? (
                            <div className="flex items-center gap-1 font-medium bg-slate-100 px-2 py-0.5 rounded">
                              {task.assignee.name.split(' ')[0]}
                            </div>
                          ) : (
                            <div className="text-slate-400 italic">Unassigned</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {columnTasks.length === 0 && (
                     <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg h-24 flex items-center justify-center text-sm text-muted-foreground">
                        No tasks
                     </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

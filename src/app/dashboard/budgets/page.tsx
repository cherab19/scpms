"use client"

import { useQuery } from "@tanstack/react-query"
import { Wallet, TrendingDown, TrendingUp, DollarSign } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function BudgetsPage() {
  const { data: budgets, isLoading } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const res = await fetch('/api/budgets')
      if (!res.ok) throw new Error('Failed to fetch budgets')
      return res.json()
    }
  })

  // Mock aggregates for the dashboard until expense tracking is fully wired
  const totalAllocated = budgets?.reduce((acc: number, curr: any) => acc + curr.allocated, 0) || 0
  const totalSpent = totalAllocated * 0.45 // Simulated calculation
  const remaining = totalAllocated - totalSpent

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget Management</h1>
          <p className="text-muted-foreground">Track project budgets and expenses across the organization</p>
        </div>
        <Button>
          <DollarSign className="mr-2 h-4 w-4" /> Add Budget
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Total Budget
              <Wallet className="h-4 w-4 opacity-75" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalAllocated.toLocaleString()}</div>
            <p className="text-xs opacity-75 mt-1">Across all active projects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium flex items-center justify-between text-muted-foreground">
              Total Spent
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">45% of total budget</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium flex items-center justify-between text-muted-foreground">
              Remaining
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${remaining.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">55% available</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Allocations by Project</CardTitle>
          <CardDescription>A detailed breakdown of all project budgets.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-100 animate-pulse rounded"></div>)}
            </div>
          ) : budgets?.length > 0 ? (
            <div className="rounded-md border">
               <table className="w-full text-sm">
                 <thead className="border-b bg-slate-50/50 dark:bg-slate-900/50">
                    <tr>
                      <th className="p-4 text-left font-medium">Project</th>
                      <th className="p-4 text-left font-medium">Category</th>
                      <th className="p-4 text-right font-medium">Allocated</th>
                    </tr>
                 </thead>
                 <tbody>
                    {budgets.map((b: any) => (
                      <tr key={b.id} className="border-b">
                        <td className="p-4">{b.project?.title}</td>
                        <td className="p-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{b.category}</span></td>
                        <td className="p-4 text-right font-medium">${b.allocated.toLocaleString()}</td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">No budget allocations found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

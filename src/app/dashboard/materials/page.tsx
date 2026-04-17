"use client"

import { useQuery } from "@tanstack/react-query"
import { Package, Search, Plus, Filter, AlertTriangle } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function MaterialsPage() {
  const { data: materials, isLoading } = useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      const res = await fetch('/api/materials')
      if (!res.ok) throw new Error('Failed to fetch materials')
      return res.json()
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Material Inventory</h1>
          <p className="text-muted-foreground">Monitor materials usage and remaining stocks across projects</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Material
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search materials..." className="pl-8" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          [1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-lg border"></div>)
        ) : materials?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material: any) => {
              const stockPercentage = (material.remainingQuantity / material.quantity) * 100
              const isLowStock = stockPercentage < 20

              return (
                <Card key={material.id} className={isLowStock ? 'border-amber-200 dark:border-amber-900/50' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="mb-2">{material.project?.title}</Badge>
                      {isLowStock && (
                        <span className="flex items-center text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full font-medium">
                          <AlertTriangle className="h-3 w-3 mr-1" /> Low Stock
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg">{material.name}</CardTitle>
                    <CardDescription>{material.supplier?.name || 'No supplier specified'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Original Quantity</span>
                          <span className="font-semibold">{material.quantity} {material.unit}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Currently Available</span>
                          <span className="font-semibold">{material.remainingQuantity} {material.unit}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Availability</span>
                          <span className="font-medium">{Math.round(stockPercentage)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${isLowStock ? 'bg-amber-500' : 'bg-primary'}`}
                            style={{ width: `${Math.max(0, Math.min(100, stockPercentage))}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="py-12 border border-dashed rounded-lg text-center bg-white dark:bg-slate-950">
            <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium">No materials tracked</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Start adding materials to track inventory levels across your construction projects.
            </p>
            <Button className="mt-4" variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add your first material
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useQuery } from "@tanstack/react-query"
import { Truck, Search, Plus, Star, MapPin, Phone } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SuppliersPage() {
  const { data: suppliers, isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const res = await fetch('/api/suppliers')
      if (!res.ok) throw new Error('Failed to fetch suppliers')
      return res.json()
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground">Manage your material suppliers and vendors directory</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Supplier
        </Button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search suppliers by name..." className="pl-8" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Card key={i} className="h-48 animate-pulse bg-slate-50 border-0"></Card>)}
        </div>
      ) : suppliers?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier: any) => (
            <Card key={supplier.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex justify-between items-center">
                  <span className="truncate pr-4">{supplier.name}</span>
                  {supplier.rating && (
                    <span className="flex items-center text-sm px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full shrink-0">
                      <Star className="h-3 w-3 mr-1 fill-current" /> {supplier.rating}
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" /> {supplier.address || "No address provided"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Phone className="h-4 w-4" />
                  {supplier.contactInfo || "No phone provided"}
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t bg-slate-50/50 dark:bg-slate-900/50 rounded-b-xl flex justify-between">
                <span className="text-sm text-muted-foreground font-medium">
                  {supplier._count.materials} Materials supplied
                </span>
                <Button variant="ghost" size="sm">View details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border-2 border-dashed rounded-xl bg-slate-50 dark:bg-slate-900/50">
          <Truck className="h-12 w-12 mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No suppliers directory</h3>
          <p className="max-w-md mx-auto mt-2 text-slate-500 dark:text-slate-400 text-sm mb-6">
            Keep track of all your vendors and material suppliers in one centralized location.
          </p>
          <Button>Add your first supplier</Button>
        </div>
      )}
    </div>
  )
}

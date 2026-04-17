"use client"

import { useQuery } from "@tanstack/react-query"
import { FileText, Search, Plus, Upload, Download, Filter, MoreHorizontal } from "lucide-react"
import { format } from "date-fns"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function DocumentsPage() {
  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const res = await fetch('/api/documents')
      if (!res.ok) throw new Error('Failed to fetch documents')
      return res.json()
    }
  })

  const getFileIcon = (fileType: string) => {
    // simplified
    return <FileText className="h-8 w-8 text-blue-500" />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Management</h1>
          <p className="text-muted-foreground">Manage blueprints, contracts, and site reports</p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" /> Upload File
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search files by name..." className="pl-8" />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" /> Filter
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-full"></div>
          {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-50 dark:bg-slate-900 rounded animate-pulse w-full border"></div>)}
        </div>
      ) : documents?.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <table className="min-w-full text-sm">
                <thead className="border-b bg-slate-50/50 dark:bg-slate-900/50 text-left">
                  <tr>
                    <th className="p-4 font-medium text-slate-500">Name</th>
                    <th className="p-4 font-medium text-slate-500">Project</th>
                    <th className="p-4 font-medium text-slate-500">Uploaded By</th>
                    <th className="p-4 font-medium text-slate-500 hidden md:table-cell">Date</th>
                    <th className="p-4 font-medium text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc: any) => (
                    <tr key={doc.id} className="border-b last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {getFileIcon(doc.fileType)}
                          <div>
                            <p className="font-medium text-base">{doc.title}</p>
                            <p className="text-xs text-muted-foreground">v{doc.version} • {doc.fileType.toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{doc.project?.title}</Badge>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {doc.uploadedBy?.name || 'Unknown'}
                      </td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">
                        {format(new Date(doc.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="p-4 text-right">
                         <div className="flex justify-end gap-2">
                           <Button variant="ghost" size="sm" title="Download">
                             <Download className="h-4 w-4" />
                           </Button>
                           <Button variant="ghost" size="sm">
                             <MoreHorizontal className="h-4 w-4" />
                           </Button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="py-20 text-center border-2 border-dashed rounded-xl bg-slate-50 dark:bg-slate-900/50">
          <FileText className="h-12 w-12 mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No documents found</h3>
          <p className="max-w-md mx-auto mt-2 text-slate-500 dark:text-slate-400 text-sm mb-6">
            Upload blueprints, contracts, site reports, and other project-related files to share with your team.
          </p>
          <Button>
            <Upload className="mr-2 h-4 w-4" /> Upload Document
          </Button>
        </div>
      )}
    </div>
  )
}

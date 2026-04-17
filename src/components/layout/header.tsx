"use client"

import { LogOut, Menu, User } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <div className="flex items-center">
        <button className="md:hidden mr-4">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
            <User className="h-5 w-5 text-slate-500" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium leading-none">{session?.user?.name || 'Guest'}</p>
            <p className="text-xs text-muted-foreground">{session?.user?.email || 'Not logged in'}</p>
          </div>
        </div>
        
        {session && (
          <button 
            onClick={() => signOut()}
            className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-5 w-5 text-slate-500" />
          </button>
        )}
      </div>
    </header>
  )
}

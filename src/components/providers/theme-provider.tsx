"use client"

import * as React from "react"

// A simple proxy until shadcn-ui installs next-themes
// If shadcn doesn't configure it automatically, we will.

let ThemeProviderContext: any = null;
try {
  ThemeProviderContext = require("next-themes").ThemeProvider
} catch (e) {
  // next-themes not installed yet, proxy children
}

export function ThemeProvider({ children, ...props }: any) {
  if (!ThemeProviderContext) {
    return <>{children}</>
  }
  return <ThemeProviderContext {...props}>{children}</ThemeProviderContext>
}

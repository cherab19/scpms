import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ReactQueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });


export const metadata: Metadata = {
  title: "SCPMS - Smart Construction Project Management System",
  description: "Manage projects, tasks, workforce, materials, budgets, and documents in real time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <body
        className={`${inter.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ReactQueryProvider>
              {children}
            </ReactQueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


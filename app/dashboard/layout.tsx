import type { ReactNode } from "react"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/app/components/DashboardSidebar"

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider className="min-h-[calc(100svh-4rem)]">
      <DashboardSidebar />
      <SidebarInset>
        <header className="sticky top-16 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border/60 bg-background/80 px-4 backdrop-blur md:px-6">
          <SidebarTrigger />
          <div className="h-5 w-px bg-border/60" aria-hidden="true" />
          <span className="text-sm font-medium text-muted-foreground">
            Dashboard
          </span>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout

import { AppSidebar } from "@/components/App-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { RequerirAuth } from "@/features/auth/components/requerir-auth"

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <RequerirAuth>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col overflow-auto">
          <header className="sticky top-0 z-50 flex h-15 shrink-0 items-center border-b bg-background px-4">
            <SidebarTrigger />
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </RequerirAuth>
  )
}

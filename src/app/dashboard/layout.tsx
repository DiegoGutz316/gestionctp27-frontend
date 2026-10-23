import { AppSidebar } from "@/components/App-sidebar"
import { NavegacionMovil } from "@/components/navegacion-movil"
import { SelectorTema } from "@/components/selector-tema"
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
          <header className="sticky top-0 z-50 hidden h-15 shrink-0 items-center gap-2 border-b bg-background px-3 sm:px-4 md:flex print:hidden">
            <SidebarTrigger className="hidden size-8 md:inline-flex" />
            <div className="ml-auto">
              <SelectorTema />
            </div>
          </header>
          <main className="min-w-0 max-w-full flex-1 overflow-x-hidden overflow-y-auto p-4 pb-24 md:p-6 print:overflow-visible print:p-0">
            {children}
          </main>
          <NavegacionMovil />
        </SidebarInset>
      </SidebarProvider>
    </RequerirAuth>
  )
}

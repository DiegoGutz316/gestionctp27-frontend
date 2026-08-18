import { Skeleton } from "@/components/ui/skeleton";

export function DashboardCarga() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-72 max-w-full" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-32" />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-56 md:col-span-2" />
        <Skeleton className="h-56" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </div>
  );
}

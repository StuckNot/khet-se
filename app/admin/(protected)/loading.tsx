/**
 * ┌──────────────────────────────────────────────────────────────────────────────â”
 * │  KhetSe — Admin Loading Skeleton                                             │
 * │  File: app/admin/loading.tsx                                                 │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */
export default function AdminLoading() {
  return (
    <div className="max-w-6xl animate-pulse">
      {/* Page header skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 rounded-lg bg-brand-primary/10 mb-2" />
        <div className="h-4 w-80 rounded-lg bg-brand-primary/5" />
      </div>
      {/* Table skeleton */}
      <div className="rounded-xl border border-brand-primary/10 bg-white p-6">
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-4 items-center py-3 border-b border-brand-primary/5">
              <div className="h-4 w-24 rounded bg-brand-primary/10" />
              <div className="h-4 w-32 rounded bg-brand-primary/5" />
              <div className="h-4 w-16 rounded bg-brand-primary/10" />
              <div className="h-4 w-20 rounded bg-brand-accent/20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

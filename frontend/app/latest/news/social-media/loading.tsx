import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Hero Skeleton */}
      <div className="bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600 py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-6 bg-white/20" />
          <Skeleton className="h-16 w-3/4 mx-auto mb-6 bg-white/20" />
          <Skeleton className="h-6 w-2/3 mx-auto mb-8 bg-white/20" />
          <div className="flex gap-4 justify-center">
            <Skeleton className="h-12 w-40 bg-white/20" />
            <Skeleton className="h-12 w-40 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6 pb-6 text-center">
                <Skeleton className="h-12 w-12 rounded-full mx-auto mb-3" />
                <Skeleton className="h-8 w-20 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <Skeleton className="h-14 max-w-2xl mx-auto mb-8" />
        <div className="flex gap-3 justify-center mb-16">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-32" />
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-24 mb-4" />
                <Skeleton className="h-48 w-full mb-4 rounded-lg" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

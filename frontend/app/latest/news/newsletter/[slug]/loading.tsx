import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      {/* Hero Skeleton */}
      <section className="relative overflow-hidden bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <Skeleton className="h-10 w-48 mb-6 bg-white/20" />
          <Skeleton className="h-8 w-32 mb-4 bg-white/20" />
          <Skeleton className="h-12 w-full max-w-2xl mb-4 bg-white/20" />
          <Skeleton className="h-6 w-64 mb-6 bg-white/20" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-40 bg-white/20" />
            <Skeleton className="h-10 w-32 bg-white/20" />
          </div>
        </div>
      </section>

      {/* Image Skeleton */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <Skeleton className="h-64 md:h-96 rounded-xl" />
      </section>

      {/* Content Skeleton */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 lg:p-12 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-8 w-2/3 mt-8" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

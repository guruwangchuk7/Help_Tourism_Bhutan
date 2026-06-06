import React from "react"

// Base Skeleton Component with subtle pulsing animations
export const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200/80 dark:bg-gray-700/50 rounded-lg ${className}`}
    />
  )
}

// Skeleton for Grid Cards (Tours, Destinations, Hotels)
export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-minimal border border-primary/5 p-5 flex flex-col w-full h-[450px]">
      {/* Image Block Skeleton */}
      <Skeleton className="aspect-[4/3] rounded-3xl w-full mb-6" />
      {/* Title Skeleton */}
      <Skeleton className="h-6 w-3/4 mb-3" />
      {/* Description Line 1 */}
      <Skeleton className="h-4 w-full mb-2" />
      {/* Description Line 2 */}
      <Skeleton className="h-4 w-5/6 mb-6" />
      
      {/* Footer Block */}
      <div className="flex items-center justify-between pt-5 border-t border-primary/5 mt-auto">
        <div className="space-y-2 w-1/3">
          <Skeleton className="h-2 w-1/2" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
    </div>
  )
}

// Page Skeleton (Hero Banner + Content Blocks)
export const PageSkeleton: React.FC<{ cardCount?: number }> = ({ cardCount = 3 }) => {
  return (
    <div className="bg-bg-light min-h-[100dvh] w-full animate-pulse">
      {/* Banner Skeleton */}
      <div className="relative min-h-[80dvh] bg-gray-200/50 flex flex-col items-center justify-center p-6 border-b border-primary/5">
        <Skeleton className="h-12 sm:h-16 md:h-20 w-1/2 mb-6 rounded-2xl" />
        <Skeleton className="h-4 sm:h-5 w-1/3 rounded-full" />
      </div>
      
      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 w-full md:w-2/3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-10 w-1/2 rounded-xl" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-10 w-28 rounded-lg self-start md:self-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {Array.from({ length: cardCount }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Details Page Skeleton (Valley Details, Tour Details)
export const DetailSkeleton: React.FC = () => {
  return (
    <div className="bg-bg-light min-h-[100dvh]">
      {/* Hero Banner Area */}
      <div className="relative min-h-[70dvh] bg-gray-200/60 flex items-center justify-center">
        <div className="text-center max-w-xl space-y-4 px-6">
          <Skeleton className="h-16 w-3/4 mx-auto rounded-2xl" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
      </div>
      
      {/* Body Area */}
      <div className="max-w-4xl mx-auto px-6 py-20 space-y-12">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3 rounded-lg" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-primary/5 space-y-3">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-8 w-3/4" />
          </div>
          <div className="p-6 bg-white rounded-2xl border border-primary/5 space-y-3">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-8 w-3/4" />
          </div>
          <div className="p-6 bg-white rounded-2xl border border-primary/5 space-y-3">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-8 w-3/4" />
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-6 w-1/4" />
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Form Skeleton
export const FormSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 max-w-xl mx-auto p-6 bg-white rounded-3xl border border-primary/5 shadow-minimal">
      <Skeleton className="h-8 w-1/2 mb-8" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
      <Skeleton className="h-12 w-1/3 rounded-full mt-4" />
    </div>
  )
}

// Table/List Skeleton
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-primary/5 shadow-minimal overflow-hidden">
      <div className="px-6 py-5 border-b border-primary/5 flex justify-between items-center bg-gray-50/50">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
      <div className="p-6 space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-primary/5 last:border-b-0">
            <div className="flex items-center space-x-4 w-1/2">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Admin Dashboard Skeleton (Sidebar + Stats Grid + Table/Charts)
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-light flex">
      {/* Sidebar Skeleton */}
      <div className="w-64 bg-primary hidden md:block p-6 space-y-8">
        <Skeleton className="h-8 w-2/3 bg-white/10" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full bg-white/10 rounded-xl" />
          <Skeleton className="h-10 w-full bg-white/10 rounded-xl" />
          <Skeleton className="h-10 w-full bg-white/10 rounded-xl" />
          <Skeleton className="h-10 w-full bg-white/10 rounded-xl" />
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-10 space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-6 bg-white rounded-3xl border border-primary/5 shadow-minimal space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="w-8 h-8 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-1/2" />
            </div>
          ))}
        </div>

        {/* Table/List area */}
        <TableSkeleton rows={4} />
      </div>
    </div>
  )
}

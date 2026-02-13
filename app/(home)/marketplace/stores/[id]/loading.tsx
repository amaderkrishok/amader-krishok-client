
export default function StoreLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Store Header Skeleton */}
      <div className="rounded-lg overflow-hidden">
        <div className="h-48 md:h-64 w-full bg-gray-200 animate-pulse"></div>
        
        <div className="p-6 bg-white">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="h-24 w-24 rounded-lg bg-gray-200 animate-pulse -mt-16"></div>
            
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
              
              <div className="pt-4 space-y-2">
                <div className="h-5 bg-gray-200 animate-pulse rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Products Header Skeleton */}
      <div className="mt-8">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3 mb-6"></div>
        
        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="rounded-lg overflow-hidden">
              <div className="h-40 bg-gray-200 animate-pulse"></div>
              <div className="p-3 space-y-2">
                <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
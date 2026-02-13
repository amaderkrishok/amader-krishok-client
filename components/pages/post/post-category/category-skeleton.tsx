import { Skeleton } from '@/components/ui/skeleton';

export function CategorySkeleton() {
  return (
    <div className='container mx-auto px-4 py-10'>
      <div className='mb-8'>
        <Skeleton className='h-4 w-1/3 mb-8' />
      </div>

      {/* Category Banner Skeleton */}
      <div className='mb-10'>
        <Skeleton className='h-[200px] md:h-[300px] w-full rounded-xl' />
      </div>

      <div className='flex flex-col md:flex-row gap-8'>
        {/* Sidebar Skeleton */}
        <div className='md:w-1/4 hidden md:block'>
          <div className='space-y-6'>
            <div>
              <Skeleton className='h-6 w-1/2 mb-3' />
              <Skeleton className='h-10 w-full' />
            </div>

            <Skeleton className='h-1 w-full' />

            <div>
              <Skeleton className='h-6 w-1/2 mb-3' />
              <div className='space-y-2'>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className='h-5 w-full' />
                ))}
              </div>
            </div>

            <Skeleton className='h-1 w-full' />

            <div>
              <Skeleton className='h-6 w-1/2 mb-4' />
              <div className='space-y-4'>
                {[1, 2, 3].map((i) => (
                  <div key={i} className='flex gap-3'>
                    <Skeleton className='h-16 w-16 flex-shrink-0 rounded' />
                    <div className='space-y-1 flex-grow'>
                      <Skeleton className='h-4 w-full' />
                      <Skeleton className='h-4 w-3/4' />
                      <Skeleton className='h-3 w-1/3' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Button Skeleton */}
        <div className='md:hidden mb-6'>
          <Skeleton className='h-10 w-full' />
        </div>

        {/* Content Skeleton */}
        <div className='md:w-3/4'>
          <div className='flex justify-between items-center mb-6'>
            <Skeleton className='h-7 w-48' />
            <Skeleton className='h-5 w-16' />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className='border border-gray-100 rounded-lg overflow-hidden'
                >
                  <Skeleton className='h-48 w-full' />
                  <div className='p-4'>
                    <Skeleton className='h-5 w-20 mb-2' />
                    <Skeleton className='h-7 w-full mb-2' />
                    <Skeleton className='h-4 w-full mb-2' />
                    <Skeleton className='h-4 w-3/4 mb-4' />
                    <Skeleton className='h-4 w-32' />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
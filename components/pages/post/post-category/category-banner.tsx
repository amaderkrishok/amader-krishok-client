import Image from 'next/image';
import type { PostCategoryType } from '@/types/post';

interface CategoryBannerProps {
  category: PostCategoryType;
}

export function CategoryBanner({ category }: CategoryBannerProps) {
  return (
    <div className='mb-10 relative h-[200px] md:h-[300px] rounded-xl overflow-hidden'>
      <div className='absolute inset-0 bg-black/40 z-10'></div>
      {category.featuredImage ? (
        <Image
          src={category.featuredImage}
          alt={category.name}
          fill
          className='object-cover'
          priority
        />
      ) : (
        <div className='w-full h-full bg-gray-100'></div>
      )}
      <div className='absolute inset-0 flex flex-col justify-center items-center z-20 text-white p-6'>
        <h1 className='text-4xl md:text-5xl font-bold mb-4 text-center'>
          {category.name}
        </h1>
        {category.description && (
          <p className='text-lg text-center max-w-2xl'>
            {category.description}
          </p>
        )}
      </div>
    </div>
  );
}
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface CategoryBreadcrumbProps {
  categoryName: string;
}

export function CategoryBreadcrumb({ categoryName }: CategoryBreadcrumbProps) {
  return (
    <div className='text-sm text-gray-500 mb-8'>
      <Link href='/' className='hover:text-black transition-colors'>
        Home
      </Link>
      <ChevronRight className='inline w-4 h-4 mx-1' />
      <Link href='/post' className='hover:text-black transition-colors'>
        Blog
      </Link>
      <ChevronRight className='inline w-4 h-4 mx-1' />
      <span className='text-gray-700'>{categoryName}</span>
    </div>
  );
}
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { CategoryFilterSidebar } from './category-filter-sidebar';
import type { PostType, PostCategoryType } from '@/types/post';

interface MobileFilterButtonProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  categories: PostCategoryType[];
  currentCategory: PostCategoryType | null;
  recentPosts: PostType[];
  formatTimeAgo: (dateString: string) => string;
}

export function MobileFilterButton(props: MobileFilterButtonProps) {
  const { searchTerm } = props;
  
  return (
    <div className='md:hidden mb-6'>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline' className='w-full flex justify-between'>
            <div className='flex items-center'>
              <SlidersHorizontal className='mr-2 h-4 w-4' />
              Filters
            </div>
            <div className='flex items-center gap-2'>
              {searchTerm && <Badge variant='secondary'>Search</Badge>}
              <ChevronDown className='h-4 w-4' />
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent
          side='left'
          className='w-[300px] sm:w-[400px] overflow-y-auto'
        >
          <div className='py-6 pr-6'>
            <h2 className='text-2xl font-bold mb-6'>Filters</h2>
            <CategoryFilterSidebar {...props} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
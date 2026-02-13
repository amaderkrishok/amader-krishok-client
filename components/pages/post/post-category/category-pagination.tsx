import { Button } from '@/components/ui/button';

interface CategoryPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function CategoryPagination({ currentPage, totalPages, onPageChange }: CategoryPaginationProps) {
  return (
    <div className='flex justify-center mt-12'>
      <div className='flex gap-2'>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (page) => (
            <Button
              key={page}
              variant={
                page === currentPage ? 'default' : 'outline'
              }
              size='icon'
              disabled={page === currentPage}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          )
        )}
      </div>
    </div>
  );
}
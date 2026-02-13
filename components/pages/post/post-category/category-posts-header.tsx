interface CategoryPostsHeaderProps {
    categoryName: string;
    searchTerm: string;
    totalItems: number;
  }
  
  export function CategoryPostsHeader({ categoryName, searchTerm, totalItems }: CategoryPostsHeaderProps) {
    return (
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-bold'>
          {searchTerm
            ? `Search results in "${categoryName}"`
            : `Posts in ${categoryName}`}
        </h2>
        <span className='text-gray-500'>
          {totalItems} {totalItems === 1 ? 'post' : 'posts'}
        </span>
      </div>
    );
  }
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PostService } from '@/services/post-service';
import { PostCategoryService } from '@/services/post-category-service';
import type { PostType, PostCategoryType } from '@/types/post';
import { Skeleton } from '@/components/ui/skeleton';

// Import sub-components
import { CategoryBreadcrumb } from '@/components/pages/post/post-category/category-breadcrumb';
import { CategoryBanner } from '@/components/pages/post/post-category/category-banner';
import { CategoryFilterSidebar } from '@/components/pages/post/post-category/category-filter-sidebar';
import { MobileFilterButton } from '@/components/pages/post/post-category/mobile-filter-button';
import { CategoryActiveFilters } from '@/components/pages/post/post-category/category-active-filters';
import { CategoryPostsHeader } from '@/components/pages/post/post-category/category-posts-header';
import { CategoryPagination } from '@/components/pages/post/post-category/category-pagination';
import { BackToPostsButton } from '@/components/pages/post/post-category/back-to-posts-button';
import { CategorySkeleton } from './category-skeleton';
import { PostsGrid } from '@/components/pages/post/post-grid';
import { NotFoundMessage } from '../shared/not-found-message';

interface CategoryPageClientProps {
    initialCategory?: PostCategoryType | null;
    slug: string;
}

// Inner component that uses useSearchParams
function CategoryPageContent({
  initialCategory = null,
  slug,
}: CategoryPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Improve state management
  const [category, setCategory] = useState<PostCategoryType | null>(initialCategory);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [categories, setCategories] = useState<PostCategoryType[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(!initialCategory);
  const [postsLoading, setPostsLoading] = useState(true); // Always start with loading
  const [searchTerm, setSearchTerm] = useState('');
  const [meta, setMeta] = useState<{
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  }>({
    totalItems: 0,
    itemsPerPage: 10,
    currentPage: 1,
    totalPages: 1,
  });

  // Parse query params
  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchTerm(search);
    }
  }, [searchParams]);

  // Fetch current category if not provided
  useEffect(() => {
    const fetchCategory = async () => {
      if (initialCategory) return;

      try {
        setCategoryLoading(true);
        const response = await PostCategoryService.getCategoryBySlug(slug);
        setCategory(response.data);
      } catch (error) {
        console.error('Failed to load category:', error);
      } finally {
        setCategoryLoading(false);
      }
    };

    if (slug) {
      fetchCategory();
    }
  }, [slug, initialCategory]);

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await PostCategoryService.getAllCategories({
          hasPostsOnly: true,
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch posts with filters
  useEffect(() => {
    const fetchPosts = async () => {
      if (!category) return;

      try {
        setPostsLoading(true); // Use dedicated loading state for posts
        const params: any = {
          page: meta.currentPage,
          limit: 12,
          published: true,
          categoryId: category.id,
        };

        if (searchTerm) {
          params.search = searchTerm;
        }

        const response = await PostService.getPosts(params);
        setPosts(response.data);
        setMeta(response.meta);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setPostsLoading(false); // Update the dedicated state
      }
    };

    // Small delay to avoid too many requests while typing
    const timeoutId = setTimeout(() => {
      fetchPosts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [category, searchTerm, meta.currentPage]);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      router.push(`/post/categories/${slug}?search=${searchTerm}`);
    } else {
      router.push(`/post/categories/${slug}`);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    router.push(`/post/categories/${slug}`);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    window.scrollTo(0, 0);
    setMeta((prev) => ({ ...prev, currentPage: page }));
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 86400; // days
    if (interval > 1) {
      return Math.floor(interval) + ' days ago';
    }
    interval = seconds / 3600; // hours
    if (interval > 1) {
      return Math.floor(interval) + ' hours ago';
    }
    interval = seconds / 60; // minutes
    if (interval > 1) {
      return Math.floor(interval) + ' minutes ago';
    }
    return 'just now';
  };

  // Full page category skeleton when the entire category is loading
  if (categoryLoading) {
    return <CategorySkeleton />;
  }

  // Category not found
  if (!category && !categoryLoading) {
    return (
      <NotFoundMessage
        title='Category not found'
        message="The category you're looking for doesn't exist or has been removed."
        buttonText='Back to All Posts'
        buttonHref='/post'
      />
    );
  }

  return (
    <div className='container mx-auto px-4 py-10'>
      {/* Breadcrumb */}
      <CategoryBreadcrumb categoryName={category?.name || ''} />

      {/* Category Header Banner */}
      {category && <CategoryBanner category={category} />}

      {/* Main Content */}
      <div className='flex flex-col md:flex-row gap-8'>
        {/* Filter Sidebar - Desktop */}
        <aside className='md:w-1/4 hidden md:block'>
          <div className='sticky top-8'>
            <CategoryFilterSidebar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSearch={handleSearch}
              categories={categories}
              currentCategory={category}
              recentPosts={posts.slice(0, 3)}
              formatTimeAgo={formatTimeAgo}
            />
          </div>
        </aside>

        {/* Mobile Filter Button */}
        <MobileFilterButton
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          categories={categories}
          currentCategory={category}
          recentPosts={posts.slice(0, 3)}
          formatTimeAgo={formatTimeAgo}
        />

        {/* Posts Grid */}
        <div className='md:w-3/4'>
          {/* Active Filters */}
          {searchTerm && (
            <CategoryActiveFilters
              searchTerm={searchTerm}
              clearAllFilters={clearAllFilters}
            />
          )}

          {/* Post Header */}
          <CategoryPostsHeader
            categoryName={category?.name || ''}
            searchTerm={searchTerm}
            totalItems={meta.totalItems}
          />

          {/* Posts Grid with loading state */}
          <div className='bg-gray-50 p-6 rounded-lg'>
            {postsLoading ? (
              <PostsGridSkeleton />
            ) : posts.length > 0 ? (
              <PostsGrid
                loading={false}
                posts={posts}
                formatTimeAgo={formatTimeAgo}
                clearAllFilters={clearAllFilters}
              />
            ) : (
              <NotFoundMessage
                title='No posts found'
                message={
                  searchTerm
                    ? "We couldn't find any posts matching your search criteria."
                    : "This category doesn't have any posts yet."
                }
                buttonText={searchTerm ? 'Clear Search' : 'Browse All Posts'}
                buttonHref={searchTerm ? `/post/categories/${slug}` : '/post'}
              />
            )}
          </div>

          {/* Pagination - only show when not loading and has posts */}
          {!postsLoading && posts.length > 0 && meta.totalPages > 1 && (
            <CategoryPagination
              currentPage={meta.currentPage}
              totalPages={meta.totalPages}
              onPageChange={handlePageChange}
            />
          )}

          {/* Back Button */}
          <BackToPostsButton />
        </div>
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function CategoryPageClient(props: CategoryPageClientProps) {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryPageContent {...props} />
    </Suspense>
  );
}

// A simpler skeleton just for the posts grid area
function PostsGridSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      {Array(6)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className='border border-gray-100 bg-white rounded-lg overflow-hidden'
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
  );
}
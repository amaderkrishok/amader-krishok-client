'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { PostService } from '@/services/post-service';
import { PostCategoryService } from '@/services/post-category-service';
import type { PostType, PostCategoryType } from '@/types/post';
import { CategoryNav } from '@/components/pages/post/post-category-nav';
import { FilterSidebar } from '@/components/pages/post/post-sidebad-filter';
import { MobileFilterButton } from '@/components/pages/post/mobile-post-filter-button';
import { PostsGrid } from '@/components/pages/post/post-grid';
import { PostHeroCarousel } from '@/components/pages/post/post-hero-carousel';

// This component uses useSearchParams, so we isolate it in its own component
const PostsPageContent = () => {
  const router = useRouter();
  // Import useSearchParams only inside this component
  const searchParams = useSearchParams();

  const [posts, setPosts] = useState<PostType[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<PostType[]>([]);
  const [categories, setCategories] = useState<PostCategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [title, setTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [createdAfter, setCreatedAfter] = useState<Date | null>(null);
  const [createdBefore, setCreatedBefore] = useState<Date | null>(null);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
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
    const titleParam = searchParams.get('title');
    const categoryIdsParam = searchParams.getAll('categoryIds');
    const createdAfterParam = searchParams.get('createdAfter');
    const createdBeforeParam = searchParams.get('createdBefore');

    if (search) setSearchTerm(search);
    if (titleParam) setTitle(titleParam);
    if (categoryIdsParam.length > 0) {
      setSelectedCategories(categoryIdsParam.map((id) => parseInt(id)));
    }
    if (createdAfterParam) setCreatedAfter(new Date(createdAfterParam));
    if (createdBeforeParam) setCreatedBefore(new Date(createdBeforeParam));

    // Count active filters
    let count = 0;
    if (search) count++;
    if (titleParam) count++;
    if (categoryIdsParam.length > 0) count++;
    if (createdAfterParam) count++;
    if (createdBeforeParam) count++;
    setActiveFiltersCount(count);
  }, [searchParams]);

  // Fetch categories
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
      try {
        setLoading(true);
        const params: any = {
          page: meta.currentPage,
          limit: 12,
          published: true,
        };

        if (searchTerm) params.search = searchTerm;
        if (title) params.title = title;

        // Handle categories
        if (selectedCategories.length > 0) {
          // If there's only one category, use categoryId
          if (selectedCategories.length === 1) {
            params.categoryId = selectedCategories[0];
          } else {
            // For multiple categories, use categoryIds array
            params.categoryIds = selectedCategories;
          }
        }

        if (createdAfter) {
          params.createdAfter = format(createdAfter, 'yyyy-MM-dd');
        }
        if (createdBefore) {
          params.createdBefore = format(createdBefore, 'yyyy-MM-dd');
        }

        const response = await PostService.getPosts(params);
        setPosts(response.data);
        setMeta(response.meta);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setLoading(false);
      }
    };

    // Small delay to avoid too many requests while typing
    const timeoutId = setTimeout(() => {
      fetchPosts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    searchTerm,
    title,
    selectedCategories,
    createdAfter,
    createdBefore,
    meta.currentPage,
  ]);

  // Handle search and filter submission
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Build search params
    const params = new URLSearchParams();

    if (searchTerm) params.append('search', searchTerm);
    if (title) params.append('title', title);

    // Ensure each category ID is added individually to the URL params
    selectedCategories.forEach((categoryId) =>
      params.append('categoryIds', categoryId.toString())
    );

    if (createdAfter)
      params.append('createdAfter', format(createdAfter, 'yyyy-MM-dd'));

    if (createdBefore)
      params.append('createdBefore', format(createdBefore, 'yyyy-MM-dd'));

    // Update URL with all filters
    const queryString = params.toString();
    router.push(`/post${queryString ? `?${queryString}` : ''}`);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setTitle('');
    setSelectedCategories([]);
    setCreatedAfter(null);
    setCreatedBefore(null);
    router.push('/post');
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    window.scrollTo(0, 0);
    setMeta((prev) => ({ ...prev, currentPage: page }));
  };

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const response = await PostService.getPosts({
          limit: 5,
          published: true,
        });
        setFeaturedPosts(response.data);
      } catch (error) {
        console.error('Failed to load featured posts:', error);
      }
    };

    fetchFeaturedPosts();
  }, []);

  // Toggle category selection
  const toggleCategorySelection = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

  return (
		<div>
			<PostHeroCarousel posts={featuredPosts} formatTimeAgo={formatTimeAgo} />
			<div className='container mx-auto px-4 py-10'>
				{/* Hero Carousel */}

				{/* Page Title */}
				<div className='mb-8'>
					<h1 className='text-4xl font-bold mb-2'>আমাদের পোস্টগুলো</h1>
					<p className='text-lg text-gray-600'>
						কৃষি এবং কৃষি উদ্ভাবনের উপর আমাদের পোস্টগুলো ঘুরে দেখুন।
					</p>
				</div>

				{/* Category Navigation */}
				<CategoryNav
					categories={categories}
					onAllClick={() => router.push('/post')}
				/>

				{/* Main Content */}
				<div className='flex flex-col md:flex-row gap-8'>
					{/* Filter Sidebar - Desktop */}
					<aside className='md:w-1/4 hidden md:block'>
						<div className='sticky top-8'>
							<FilterSidebar
								searchTerm={searchTerm}
								setSearchTerm={setSearchTerm}
								selectedCategories={selectedCategories}
								toggleCategorySelection={toggleCategorySelection}
								categories={categories}
								handleFilterSubmit={handleFilterSubmit}
								clearAllFilters={clearAllFilters}
								formatDate={formatDate}
								recentPosts={posts}
							/>
						</div>
					</aside>

					{/* Mobile Filter Button */}
					<MobileFilterButton
						activeFiltersCount={activeFiltersCount}
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
						selectedCategories={selectedCategories}
						toggleCategorySelection={toggleCategorySelection}
						categories={categories}
						handleFilterSubmit={handleFilterSubmit}
						clearAllFilters={clearAllFilters}
						formatDate={formatDate}
						recentPosts={posts}
					/>

					{/* Posts Grid */}
					<div className='md:w-3/4'>
						<PostsGrid
							loading={loading}
							posts={posts}
							formatTimeAgo={formatTimeAgo}
							clearAllFilters={clearAllFilters}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

// Main component wraps the inner component with Suspense
export default function PostsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-10">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-10 bg-gray-200 w-1/3 mb-4 rounded"></div>
          <div className="h-6 bg-gray-200 w-1/2 mb-8 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <PostsPageContent />
    </Suspense>
  );
}
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { PostService } from '@/services/post-service';
import { PostCategoryService } from '@/services/post-category-service';
import type { PostType, PostCategoryType } from '@/types/post';
import { CategoryNav } from '@/components/pages/post/post-category-nav';
import { FilterSidebar } from '@/components/pages/post/post-sidebad-filter';
import { MobileFilterButton } from '@/components/pages/post/mobile-post-filter-button';
import { PostsGrid } from '@/components/pages/post/post-grid';
import { PostHeroCarousel } from '@/components/pages/post/post-hero-carousel';
import { ShieldCheck, ArrowRight, Sprout, BookOpen } from 'lucide-react';

// This component uses useSearchParams, so we isolate it in its own component
const PostsPageContent = () => {
  const router = useRouter();
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
          limit: 11, // 1 featured + 10 grid posts
          published: true,
        };

        if (searchTerm) params.search = searchTerm;
        if (title) params.title = title;

        // Handle categories
        if (selectedCategories.length > 0) {
          if (selectedCategories.length === 1) {
            params.categoryId = selectedCategories[0];
          } else {
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

    const params = new URLSearchParams();

    if (searchTerm) params.append('search', searchTerm);
    if (title) params.append('title', title);

    selectedCategories.forEach((categoryId) =>
      params.append('categoryIds', categoryId.toString())
    );

    if (createdAfter)
      params.append('createdAfter', format(createdAfter, 'yyyy-MM-dd'));

    if (createdBefore)
      params.append('createdBefore', format(createdBefore, 'yyyy-MM-dd'));

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
    window.scrollTo({ top: 400, behavior: 'smooth' });
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

  // Select single category or reset
  const handleSelectCategory = (categoryId: number | null) => {
    if (categoryId === null) {
      clearAllFilters();
    } else {
      setSelectedCategories([categoryId]);
    }
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bn-BD', {
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
      return Math.floor(interval) + ' দিন আগে';
    }
    interval = seconds / 3600; // hours
    if (interval > 1) {
      return Math.floor(interval) + ' ঘণ্টা আগে';
    }
    interval = seconds / 60; // minutes
    if (interval > 1) {
      return Math.floor(interval) + ' মিনিট আগে';
    }
    return 'এইমাত্র';
  };

  return (
		<div className='min-h-screen bg-[#F8FAF7] text-[#172018] font-sans antialiased'>
			{/* EDITORIAL HERO SECTION */}
			<PostHeroCarousel
				posts={featuredPosts.length > 0 ? featuredPosts : posts}
				formatTimeAgo={formatTimeAgo}
			/>

			{/* MAIN CONTAINER */}
			<div className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
				{/* PAGE INTRO SECTION */}
				<div className='mb-8 sm:mb-10 border-b border-gray-200/80 pb-6'>
					<div className='flex items-center gap-2 mb-2'>
						<div className='w-2 h-6 bg-[#2E7D32] rounded-full' />
						<h1 className='text-3xl sm:text-4xl font-extrabold text-[#172018] tracking-tight'>
							আমাদের পোস্টগুলো
						</h1>
					</div>
					<p className='text-base sm:text-lg text-[#6B7280] font-normal max-w-2xl leading-relaxed pl-4'>
						কৃষি ও কৃষি উদ্ভাবনের গুরুত্বপূর্ণ তথ্য, টিপস ও পরামর্শ পড়ুন।
					</p>
				</div>

				{/* CATEGORY NAVIGATION PILLS */}
				<CategoryNav
					categories={categories}
					selectedCategories={selectedCategories}
					onSelectCategory={handleSelectCategory}
					onAllClick={clearAllFilters}
				/>

				{/* TWO COLUMN MAIN CONTENT LAYOUT */}
				<div className='flex flex-col md:flex-row gap-8 items-start'>
					{/* Desktop Sidebar (280px width) */}
					<aside className='w-[280px] flex-shrink-0 hidden md:block sticky top-6'>
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
					</aside>

					{/* Mobile Filter Sheet */}
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

					{/* Main Content Area */}
					<main className='flex-1 min-w-0 w-full'>
						<PostsGrid
							loading={loading}
							posts={posts}
							formatTimeAgo={formatTimeAgo}
							clearAllFilters={clearAllFilters}
							meta={meta}
							onPageChange={handlePageChange}
						/>
					</main>
				</div>
			</div>

			{/* BOTTOM ECOSYSTEM CTA SECTION */}
			<section className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				<div className='bg-gradient-to-r from-[#4A5E3A] via-[#3D4F2E] to-[#4A5E3A] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-8'>
					<div className='space-y-3 max-w-xl text-center sm:text-left'>
						<div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBBF24]/20 border border-[#FBBF24]/30 text-[#FBBF24] text-xs font-bold'>
							<ShieldCheck className='w-4 h-4' />
							<span>আমাদের প্ল্যাটফর্ম</span>
						</div>
						<h3 className='text-2xl sm:text-3xl font-extrabold text-white tracking-tight'>
							ফসল চাষের নির্দেশিকা ও মার্কেটপ্লেসে যুক্ত হতে চান?
						</h3>
						<p className='text-gray-300 text-sm sm:text-base font-normal'>
							আমাদের কৃষক বাজার ও ফসল চাষ নির্দেশিকা থেকে সরাসরি বিশেষজ্ঞ তথ্য ও কৃষি উপাদান সংগ্রহ করুন।
						</p>
					</div>

					<div className='flex flex-wrap items-center justify-center gap-3 shrink-0'>
						<Link
							href='/crop-cultivation'
							className='px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-sm transition-all border border-white/20 flex items-center gap-2'
						>
							<Sprout className='w-4 h-4 text-[#FBBF24]' />
							<span>ফসল চাষ তথ্য</span>
						</Link>
						<Link
							href='/marketplace'
							className='px-7 py-3.5 bg-[#FBBF24] hover:bg-[#f5b316] text-[#1E2817] rounded-2xl font-extrabold text-sm transition-all shadow-lg flex items-center gap-2'
						>
							<span>কৃষকের বাজার</span>
							<ArrowRight className='w-4 h-4' />
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
};

// Main component wraps the inner component with Suspense
export default function PostsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-10">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-2xl mb-8"></div>
          <div className="h-10 bg-gray-200 w-1/3 mb-4 rounded"></div>
          <div className="h-6 bg-gray-200 w-1/2 mb-8 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <PostsPageContent />
    </Suspense>
  );
}
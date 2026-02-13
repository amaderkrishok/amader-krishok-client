'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { WebsiteWrapper } from './(home)/WebsiteWrapper';
import { Suspense } from 'react';

function NotFoundContent() {
	return (
		<WebsiteWrapper>
			<div className='flex min-h-[50vh] w-full items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16'>
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 text-center space-y-4 max-w-md mx-auto'>
					<h1 className='text-8xl font-bold text-gray-900 dark:text-gray-50'>
						404
					</h1>
					<p className='text-lg text-gray-500 dark:text-gray-400'>
						দুঃখিত! আপনি যে পৃষ্ঠা খুঁজছেন তা বিদ্যমান নেই।
					</p>
					<Link href='/'>
						<Button className='mt-5' variant='default'>
							হোম পেইজে যান
						</Button>
					</Link>
				</div>
			</div>
		</WebsiteWrapper>
	);
}

export default function NotFound() {
	return (
		<Suspense
			fallback={
				<div className='flex min-h-[50vh] w-full items-center justify-center'>
					<div className='animate-pulse'>
						<div className='h-8 w-24 bg-gray-200 mb-4 rounded'></div>
						<div className='h-4 w-48 bg-gray-200 rounded'></div>
					</div>
				</div>
			}
		>
			<NotFoundContent />
		</Suspense>
	);
}

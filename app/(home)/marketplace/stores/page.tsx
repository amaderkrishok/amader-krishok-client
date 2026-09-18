import { StoresContainer } from '@/components/pages/marketplace/stores/stores-container';
import { StoreService } from '@/services/store-service';

export async function generateMetadata() {
	return {
		title: 'কৃষকের বাজারের দোকানসমূহ | Amader Krishok',
		description:
			'আমাদের কৃষকের বাজারে সকল দোকানের তালিকা দেখুন এবং কৃষিপণ্য কিনুন।',
	};
}

export default async function StoresPage() {
	try {
		// Fetch stores for the first page
		const response = await StoreService.getStores({
			page: 1,
			limit: 100
		  });
		// Extract stores and pagination metadata
		const stores = response?.data || [];
		const meta = response?.meta || {
			itemsPerPage: 12,
			totalItems: 0,
			currentPage: 1,
			totalPages: 1,
		};

		return (
			<div className='w-full px-4 sm:px-6 lg:px-[10%] xl:px-[14%] 2xl:px-12 py-8 pt-28 md:pt-36'>
				<div className='max-w-7xl mx-auto'>
					<div className='mb-8'>
						<h1 className='text-3xl font-bold mb-2'>কৃষকের বাজারের দোকানসমূহ</h1>
						<p className='text-gray-600'>
							আমাদের কৃষকের বাজারে যোগদান করা সকল দোকানের তালিকা দেখুন এবং সরাসরি
							কৃষকদের কাছ থেকে তাজা পণ্য কিনুন।
						</p>
					</div>

					{/* StoresContainer will handle pagination and displaying the stores */}
					<StoresContainer initialStores={stores} initialMeta={meta} />
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error loading stores:', error);

		// Show error state if stores couldn't be loaded
		return (
			<div className='container mx-auto px-4 py-8'>
				<h1 className='text-3xl font-bold mb-8'>কৃষকের বাজারের দোকানসমূহ</h1>

				<div className='py-12 text-center bg-gray-50 rounded-lg'>
					<p className='text-lg text-gray-600'>
						দোকানসমূহ লোড করতে সমস্যা হয়েছে
					</p>
					<p className='mt-2 text-gray-500'>পরে আবার চেষ্টা করুন</p>
				</div>
			</div>
		);
	}
}

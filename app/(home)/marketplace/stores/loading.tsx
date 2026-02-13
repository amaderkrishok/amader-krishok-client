export default function StoresLoading() {
	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold mb-8'>কৃষকের বাজারের দোকানসমূহ</h1>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{Array.from({ length: 6 }).map((_, index) => (
					<div
						key={index}
						className='h-64 bg-gray-200 animate-pulse rounded-lg'
					></div>
				))}
			</div>
		</div>
	);
}

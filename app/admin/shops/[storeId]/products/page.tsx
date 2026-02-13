import { AdminShopProductsList } from '@/components/dashbaord/shops/admin-shop-products-list';

interface PageProps {
	params: Promise<{ storeId: string }>;
}

export default async function Page({ params }: PageProps) {
	const { storeId } = await params;
	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-2xl font-bold mb-6'>Shop Products</h1>
			<AdminShopProductsList storeId={storeId} />
		</div>
	);
}

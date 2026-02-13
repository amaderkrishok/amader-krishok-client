import { AdminShopsList } from '@/components/dashbaord/shops/admin-shops-list';

export default function Page() {
	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-2xl font-bold mb-6'>All Shops</h1>
			<AdminShopsList />
		</div>
	);
}

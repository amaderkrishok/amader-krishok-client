import { StoreManagementProvider } from '@/components/dashbaord/store/store-management-context';
import { StoreManagementDashboard } from '@/components/dashbaord/store/store-management-dashboard';

interface PageProps {
	params: Promise<{ storeId: string }>;
}

export default async function Page({ params }: PageProps) {
	const { storeId } = await params;
	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-2xl font-bold mb-6'>Manage Shop</h1>
			<StoreManagementProvider
				storeId={storeId}
				userRole='admin'
				viewMode='admin'
			>
				<StoreManagementDashboard />
			</StoreManagementProvider>
		</div>
	);
}

import { FertilizerDashboard } from '@/components/dashbaord/fertilizer/fertilizer-dashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Fertilizer Calculator Management',
	description: 'Manage fertilizer calculator data',
};

export default function FertilizerManagementPage() {
	return (
		<div className='p-6 space-y-6 w-full mx-auto'>
			<FertilizerDashboard />
		</div>
	);
}

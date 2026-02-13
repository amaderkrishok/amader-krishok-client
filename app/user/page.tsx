import { CurrentOrdersCard } from '@/components/user-dashboard/current-orders-card';
import { DashboardHeader } from '@/components/user-dashboard/dashboard-header';

import { OrderHistoryCard } from '@/components/user-dashboard/order-history-card';
import { StatsCards } from '@/components/user-dashboard/stats-cards';
import { UserProfileCard } from '@/components/user-dashboard/user-profile-card';

export default function Page() {
	return (
		<>
			<DashboardHeader
				heading='Customer Dashboard'
				text='Manage your profile, track orders, and view your purchase history.'
			/>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
				<StatsCards />
			</div>
			<div className='mt-4'>
				<OrderHistoryCard />
			</div>
		</>
	);
}

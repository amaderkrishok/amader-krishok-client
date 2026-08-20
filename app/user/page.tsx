import { DashboardHeader } from '@/components/user-dashboard/dashboard-header';
import { QuickActions } from '@/components/user-dashboard/quick-actions';
import { StatsCards } from '@/components/user-dashboard/stats-cards';
import { OrderHistoryCard } from '@/components/user-dashboard/order-history-card';
import { SpendingSummary } from '@/components/user-dashboard/spending-summary';
import { RecommendedProducts } from '@/components/user-dashboard/recommended-products';
import { SavedProductsPreview } from '@/components/user-dashboard/saved-products-preview';

export default function UserDashboardPage() {
	return (
		<div className='space-y-8 pb-8'>
			{/* 4. DASHBOARD WELCOME HEADER */}
			<DashboardHeader />

			{/* 6. QUICK ACTIONS */}
			<QuickActions />

			{/* 5. STATISTICS CARDS (4 CARDS) */}
			<StatsCards />

			{/* 7 & 8. RECENT ORDERS (WITH SHORT IDS & STATUS BADGES) */}
			<OrderHistoryCard />

			{/* 9. SPENDING SUMMARY */}
			<SpendingSummary />

			{/* 10. RECOMMENDED PRODUCTS */}
			<RecommendedProducts />

			{/* 11. SAVED PRODUCTS PREVIEW */}
			<SavedProductsPreview />
		</div>
	);
}

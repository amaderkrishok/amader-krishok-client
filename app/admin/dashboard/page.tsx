import { AnalyticsDateRangeProvider } from '@/components/dashbaord/analytics/analytics-date-range-context';
import { AnalyticsDateRangePicker } from '@/components/dashbaord/analytics/analytics-date-range-picker';
import { AnalyticsSummaryCards } from '@/components/dashbaord/analytics/analytics-summary-cards';
import { AnalyticsDevicePieChart } from '@/components/dashbaord/analytics/analytics-device-pie-chart';
import { AnalyticsTopPagesTable } from '@/components/dashbaord/analytics/analytics-top-pages-table';
import { AnalyticsGeoMap } from '@/components/dashbaord/analytics/analytics-geo-map';
import { AnalyticsTrafficSourcesBar } from '@/components/dashbaord/analytics/analytics-traffic-sources-bar';
import { AnalyticsUserDemographics } from '@/components/dashbaord/analytics/analytics-user-demographics';

export default function DashboardPage() {
	return (
		<AnalyticsDateRangeProvider>
			<div className='p-6 space-y-6 w-full mx-auto'>
				<div className='flex justify-between items-center mb-4'>
					<h1 className='text-2xl font-bold'>Analytics Dashboard</h1>
					<AnalyticsDateRangePicker />
				</div>
				<AnalyticsSummaryCards />
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<AnalyticsDevicePieChart />
					<AnalyticsGeoMap />
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<AnalyticsTrafficSourcesBar />
					<AnalyticsUserDemographics />
				</div>
				<AnalyticsTopPagesTable />
			</div>
		</AnalyticsDateRangeProvider>
	);
}

'use client';

import * as React from 'react';
import { useAnalyticsDateRange } from './analytics-date-range-context';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';
import {
	AreaChart,
	Area,
	CartesianGrid,
	XAxis,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';

// You may need to adjust these imports based on your actual shadcn/ui and chart setup
// import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

type AnalyticsDataPoint = {
	date: string;
	users: number;
	sessions: number;
	pageViews: number;
};

export function AnalyticsAreaChart() {
	const { range } = useAnalyticsDateRange();
	const [data, setData] = React.useState<AnalyticsDataPoint[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		setLoading(true);
		setError(null);
		fetch('/api/analytics?range=' + range)
			.then(async (res) => {
				if (!res.ok) throw new Error('Failed to fetch analytics');
				return res.json();
			})
			.then((json) => {
				setData(json.data || []);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, [range]);

	return (
		<Card className='pt-0 dark:bg-gray-900 bg-white'>
			<CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
				<div className='grid flex-1 gap-1'>
					<CardTitle>Website Analytics</CardTitle>
					<CardDescription>
						Showing users, sessions, and page views for the selected period
					</CardDescription>
				</div>
				{/* Date range is now controlled by context, picker is in dashboard */}
			</CardHeader>
			<CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
				{loading ? (
					<div className='h-[250px] flex items-center justify-center text-muted-foreground'>
						Loading...
					</div>
				) : error ? (
					<div className='h-[250px] flex items-center justify-center text-destructive'>
						{error}
					</div>
				) : (
					<ResponsiveContainer width='100%' height={250}>
						<AreaChart
							data={data}
							margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
						>
							<defs>
								<linearGradient id='colorUsers' x1='0' y1='0' x2='0' y2='1'>
									<stop offset='5%' stopColor='#6366f1' stopOpacity={0.8} />
									<stop offset='95%' stopColor='#6366f1' stopOpacity={0.1} />
								</linearGradient>
								<linearGradient id='colorSessions' x1='0' y1='0' x2='0' y2='1'>
									<stop offset='5%' stopColor='#22d3ee' stopOpacity={0.8} />
									<stop offset='95%' stopColor='#22d3ee' stopOpacity={0.1} />
								</linearGradient>
								<linearGradient id='colorPageViews' x1='0' y1='0' x2='0' y2='1'>
									<stop offset='5%' stopColor='#f59e42' stopOpacity={0.8} />
									<stop offset='95%' stopColor='#f59e42' stopOpacity={0.1} />
								</linearGradient>
							</defs>
							<CartesianGrid vertical={false} strokeDasharray='3 3' />
							<XAxis
								dataKey='date'
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								minTickGap={32}
								tickFormatter={(value: string) => {
									const date = new Date(value);
									return date.toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
									});
								}}
							/>
							<Tooltip
								labelFormatter={(value) => {
									const date = new Date(value as string);
									return date.toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
									});
								}}
							/>
							<Area
								type='monotone'
								dataKey='users'
								stroke='#6366f1'
								fill='url(#colorUsers)'
								name='Users'
							/>
							<Area
								type='monotone'
								dataKey='sessions'
								stroke='#22d3ee'
								fill='url(#colorSessions)'
								name='Sessions'
							/>
							<Area
								type='monotone'
								dataKey='pageViews'
								stroke='#f59e42'
								fill='url(#colorPageViews)'
								name='Page Views'
							/>
						</AreaChart>
					</ResponsiveContainer>
				)}
			</CardContent>
		</Card>
	);
}

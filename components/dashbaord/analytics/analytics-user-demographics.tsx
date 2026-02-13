'use client';

import * as React from 'react';
import { useAnalyticsDateRange } from './analytics-date-range-context';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

const chartConfig = {
	visitors: {
		label: 'Visitors',
	},
	desktop: {
		label: 'Desktop',
		color: 'var(--chart-1)',
	},
	mobile: {
		label: 'Mobile',
		color: 'var(--chart-2)',
	},
	tablet: {
		label: 'Tablet',
		color: '#f59e42',
	},
} satisfies ChartConfig;

export function AnalyticsUserDemographics() {
	const { range } = useAnalyticsDateRange();
	const [data, setData] = React.useState<any[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		setLoading(true);
		setError(null);
		fetch(`/api/analytics?report=devices&range=${range}`)
			.then(async (res) => {
				if (!res.ok) throw new Error('Failed to fetch analytics');
				return res.json();
			})
			.then((json) => {
				const rows = json.rows || [];
				// Build a map of date -> { desktop, mobile, tablet }
				const dateMap: Record<
					string,
					{ desktop: number; mobile: number; tablet: number }
				> = {};
				rows.forEach((row: any) => {
					const date = row.dimensionValues?.[0]?.value;
					const device = row.dimensionValues?.[1]?.value;
					const users = parseInt(row.metricValues?.[0]?.value || '0');
					if (!date) return;
					if (!dateMap[date]) {
						dateMap[date] = { desktop: 0, mobile: 0, tablet: 0 };
					}
					if (device === 'desktop') dateMap[date].desktop = users;
					if (device === 'mobile') dateMap[date].mobile = users;
					if (device === 'tablet') dateMap[date].tablet = users;
				});
				// Convert map to sorted array
				const chartData = Object.entries(dateMap)
					.map(([date, values]) => ({ date, ...values }))
					.sort((a, b) => a.date.localeCompare(b.date));
				setData(chartData);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, [range]);

	return (
		<Card className='pt-0'>
			<CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
				<div className='grid flex-1 gap-1'>
					<CardTitle>Device Usage</CardTitle>
					<CardDescription>
						Showing desktop, mobile, and tablet users for the selected period
					</CardDescription>
				</div>
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
					<ChartContainer
						config={chartConfig}
						className='aspect-auto h-[250px] w-full'
					>
						<AreaChart data={data}>
							<defs>
								<linearGradient id='fillDesktop' x1='0' y1='0' x2='0' y2='1'>
									<stop
										offset='5%'
										stopColor='var(--color-desktop)'
										stopOpacity={0.8}
									/>
									<stop
										offset='95%'
										stopColor='var(--color-desktop)'
										stopOpacity={0.1}
									/>
								</linearGradient>
								<linearGradient id='fillMobile' x1='0' y1='0' x2='0' y2='1'>
									<stop
										offset='5%'
										stopColor='var(--color-mobile)'
										stopOpacity={0.8}
									/>
									<stop
										offset='95%'
										stopColor='var(--color-mobile)'
										stopOpacity={0.1}
									/>
								</linearGradient>
								<linearGradient id='fillTablet' x1='0' y1='0' x2='0' y2='1'>
									<stop offset='5%' stopColor='#f59e42' stopOpacity={0.8} />
									<stop offset='95%' stopColor='#f59e42' stopOpacity={0.1} />
								</linearGradient>
							</defs>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey='date'
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								minTickGap={32}
								tickFormatter={(value) => {
									// GA4 returns date as yyyyMMdd string, e.g. '20250730'
									if (typeof value === 'string' && value.length === 8) {
										const year = Number(value.slice(0, 4));
										const month = Number(value.slice(4, 6)) - 1;
										const day = Number(value.slice(6, 8));
										const date = new Date(year, month, day);
										return date.toLocaleDateString('en-US', {
											month: 'short',
											day: 'numeric',
										});
									}
									return value;
								}}
							/>
							<ChartTooltip
								cursor={false}
								content={
									<ChartTooltipContent
										labelFormatter={(value) => {
											// GA4 returns date as yyyyMMdd string
											if (typeof value === 'string' && value.length === 8) {
												const year = Number(value.slice(0, 4));
												const month = Number(value.slice(4, 6)) - 1;
												const day = Number(value.slice(6, 8));
												const date = new Date(year, month, day);
												return date.toLocaleDateString('en-US', {
													month: 'short',
													day: 'numeric',
												});
											}
											return value;
										}}
										indicator='dot'
									/>
								}
							/>
							<Area
								dataKey='mobile'
								type='natural'
								fill='url(#fillMobile)'
								stroke='var(--color-mobile)'
								stackId='a'
							/>
							<Area
								dataKey='desktop'
								type='natural'
								fill='url(#fillDesktop)'
								stroke='var(--color-desktop)'
								stackId='a'
							/>
							<Area
								dataKey='tablet'
								type='natural'
								fill='url(#fillTablet)'
								stroke='#f59e42'
								stackId='a'
							/>
							<ChartLegend content={<ChartLegendContent />} />
						</AreaChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
}

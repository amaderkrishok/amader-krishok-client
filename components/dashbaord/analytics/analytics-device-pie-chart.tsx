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
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { PieChart, Pie, Label, Cell } from 'recharts';

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
		color: 'var(--chart-3)',
	},
} satisfies ChartConfig;

function getDeviceColor(device: string) {
	if (device === 'desktop') return 'var(--chart-1)';
	if (device === 'mobile') return 'var(--chart-2)';
	if (device === 'tablet') return 'var(--chart-3)';
	return 'var(--chart-4)';
}

function formatLabel(device: string) {
	if (device === 'desktop') return 'Desktop';
	if (device === 'mobile') return 'Mobile';
	if (device === 'tablet') return 'Tablet';
	return device.charAt(0).toUpperCase() + device.slice(1);
}

export function AnalyticsDevicePieChart() {
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
				// Aggregate users by device type for the whole range
				const deviceTotals: Record<string, number> = {};
				rows.forEach((row: any) => {
					// row.dimensionValues: [date, deviceCategory]
					const device =
						row.dimensionValues?.[1]?.value ||
						row.dimensionValues?.[0]?.value ||
						'unknown';
					const users = parseInt(row.metricValues?.[0]?.value || '0');
					if (!deviceTotals[device]) deviceTotals[device] = 0;
					deviceTotals[device] += users;
				});
				// Build pie chart data
				const deviceData = Object.entries(deviceTotals).map(
					([device, users]) => ({ device, users })
				);
				setData(deviceData);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, [range]);

	const totalUsers = React.useMemo(() => {
		return data.reduce((acc, curr) => acc + curr.users, 0);
	}, [data]);

	return (
		<Card className='flex flex-col'>
			<CardHeader className='items-center pb-0'>
				<CardTitle>Device Breakdown</CardTitle>
				<CardDescription>Users by device type</CardDescription>
			</CardHeader>
			<CardContent className='flex-1 pb-0'>
				<ChartContainer
					config={chartConfig}
					className='mx-auto aspect-square max-h-[250px]'
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={data}
							dataKey='users'
							nameKey='device'
							innerRadius={60}
							strokeWidth={5}
							isAnimationActive={false}
						>
							<Label
								content={({ viewBox }) => {
									if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor='middle'
												dominantBaseline='middle'
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className='fill-foreground text-3xl font-bold'
												>
													{totalUsers.toLocaleString()}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className='fill-muted-foreground'
												>
													Users
												</tspan>
											</text>
										);
									}
								}}
							/>
							{data.map((entry, idx) => (
								<Cell key={`cell-${idx}`} fill={getDeviceColor(entry.device)} />
							))}
						</Pie>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

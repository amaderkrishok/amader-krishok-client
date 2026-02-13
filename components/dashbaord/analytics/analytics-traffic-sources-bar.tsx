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
import { BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';

// Custom color palette for sources (blue gradient from image)
const SOURCE_COLORS = [
	'#93b4ff', // Chrome (light blue)
	'#4e8cff', // Safari (mid blue)
	'#2563eb', // Firefox (darker blue)
	'#1e40af', // Edge (deep blue)
	'#1e3a8a', // Other (darkest blue)
	'#1e293b', // fallback (very dark blue/gray)
	'#1e293b',
	'#1e293b',
	'#1e293b',
	'#1e293b',
];

function formatLabel(label: string) {
	return label
		.replace(/\(none\)/gi, 'Direct')
		.replace(/\(not set\)/gi, 'Unknown');
}

export function AnalyticsTrafficSourcesBar() {
	const { range } = useAnalyticsDateRange();
	const [data, setData] = React.useState<any[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		setLoading(true);
		setError(null);
		fetch(`/api/analytics?report=sources&range=${range}`)
			.then(async (res) => {
				if (!res.ok) throw new Error('Failed to fetch analytics');
				return res.json();
			})
			.then((json) => {
				const rows = json.rows || [];
				const sources = rows.map((row: any, idx: number) => ({
					source: row.dimensionValues?.[0]?.value || 'Unknown',
					sessions: parseInt(row.metricValues?.[0]?.value || '0'),
					users: parseInt(row.metricValues?.[1]?.value || '0'),
					fill: SOURCE_COLORS[idx % SOURCE_COLORS.length],
				}));
				setData(sources);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, [range]);

	const chartConfig: ChartConfig = {
		sessions: {
			label: 'Sessions',
		},
	};

	if (loading) {
		return (
			<Card className='p-6 animate-pulse dark:bg-gray-900 bg-white h-full' />
		);
	}
	if (error) {
		return (
			<Card className='p-6 dark:bg-gray-900 bg-white text-destructive'>
				{error}
			</Card>
		);
	}

	return (
		<Card className='p-6 dark:bg-gray-900 bg-white h-full'>
			<CardHeader>
				<CardTitle>Traffic Sources</CardTitle>
				<CardDescription>Sessions by source/medium (top 10)</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className='h-64'>
					<BarChart
						data={data}
						layout='vertical'
						margin={{ left: 0, right: 16, top: 8, bottom: 8 }}
					>
						<YAxis
							dataKey='source'
							type='category'
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={formatLabel}
							width={120}
						/>
						<XAxis dataKey='sessions' type='number' hide />
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Bar dataKey='sessions' layout='vertical' radius={5}>
							{data.map((entry, idx) => (
								<Cell key={`cell-${idx}`} fill={entry.fill} />
							))}
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

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
import { Users, BarChart2, Eye, TrendingDown, Clock } from 'lucide-react';

function formatNumber(num: string | number) {
	if (typeof num === 'string') num = parseFloat(num);
	return num.toLocaleString();
}

function formatDuration(seconds: string | number) {
	if (typeof seconds === 'string') seconds = parseFloat(seconds);
	const min = Math.floor(seconds / 60);
	const sec = Math.round(seconds % 60);
	return `${min}m ${sec}s`;
}

export function AnalyticsSummaryCards() {
	const { range } = useAnalyticsDateRange();
	const [data, setData] = React.useState<any>(null);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		setLoading(true);
		setError(null);
		fetch(`/api/analytics?report=summary&range=${range}`)
			.then(async (res) => {
				if (!res.ok) throw new Error('Failed to fetch analytics');
				return res.json();
			})
			.then((json) => {
				setData(json);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, [range]);

	if (loading) {
		return (
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
				{Array.from({ length: 5 }).map((_, i) => (
					<Card
						key={i}
						className='p-6 animate-pulse dark:bg-gray-900 bg-white'
					/>
				))}
			</div>
		);
	}
	if (error || !data) {
		return <div className='text-destructive'>{error || 'No data'}</div>;
	}

	// Extract metrics from API response (from first row's metricValues)
	const metrics = data.rows?.[0]?.metricValues?.map((m: any) => m.value) || [];
	// Order: activeUsers, sessions, screenPageViews, bounceRate, averageSessionDuration

	const cards = [
		{
			label: 'Users',
			value: formatNumber(metrics[0] || 0),
			icon: <Users className='h-6 w-6 text-primary' />,
			description: 'Active users',
		},
		{
			label: 'Sessions',
			value: formatNumber(metrics[1] || 0),
			icon: <BarChart2 className='h-6 w-6 text-primary' />,
			description: 'Total sessions',
		},
		{
			label: 'Page Views',
			value: formatNumber(metrics[2] || 0),
			icon: <Eye className='h-6 w-6 text-primary' />,
			description: 'Screen/page views',
		},
		{
			label: 'Bounce Rate',
			value: metrics[3] ? `${parseFloat(metrics[3]).toFixed(1)}%` : '0%',
			icon: <TrendingDown className='h-6 w-6 text-primary' />,
			description: 'Bounce rate',
		},
		{
			label: 'Avg. Session',
			value: formatDuration(metrics[4] || 0),
			icon: <Clock className='h-6 w-6 text-primary' />,
			description: 'Avg. session duration',
		},
	];

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
			{cards.map((card) => (
				<Card key={card.label} className='p-6 dark:bg-gray-900 bg-white'>
					<CardHeader className='flex flex-row items-center justify-between pb-2'>
						<CardTitle className='text-lg font-medium'>{card.label}</CardTitle>
						{card.icon}
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold mb-1'>{card.value}</div>
						<CardDescription>{card.description}</CardDescription>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

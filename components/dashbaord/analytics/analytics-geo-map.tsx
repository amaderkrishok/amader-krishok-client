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
import { Globe2 } from 'lucide-react';

export function AnalyticsGeoMap() {
	const { range } = useAnalyticsDateRange();
	const [data, setData] = React.useState<any[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		setLoading(true);
		setError(null);
		fetch(`/api/analytics?report=geo&range=${range}`)
			.then(async (res) => {
				if (!res.ok) throw new Error('Failed to fetch analytics');
				return res.json();
			})
			.then((json) => {
				const rows = json.rows || [];
				const countries = rows.map((row: any) => ({
					country: row.dimensionValues?.[0]?.value || 'Unknown',
					users: parseInt(row.metricValues?.[0]?.value || '0'),
					sessions: parseInt(row.metricValues?.[1]?.value || '0'),
				}));
				setData(countries);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, [range]);

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
				<CardTitle className='flex items-center gap-2'>
					<Globe2 className='h-5 w-5 text-primary' />
					Top Countries
				</CardTitle>
				<CardDescription>Users by country (top 10)</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-2'>
					{data.map((row) => (
						<div
							key={row.country}
							className='flex items-center justify-between py-1 border-b border-muted last:border-b-0'
						>
							<span className='font-medium text-sm'>{row.country}</span>
							<span className='text-xs text-muted-foreground'>
								{row.users.toLocaleString()} users
							</span>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

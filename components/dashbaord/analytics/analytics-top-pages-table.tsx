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
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table';
import { ExternalLink } from 'lucide-react';

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

export function AnalyticsTopPagesTable() {
	const { range } = useAnalyticsDateRange();
	const [data, setData] = React.useState<any[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		setLoading(true);
		setError(null);
		fetch(`/api/analytics?report=top-pages&range=${range}`)
			.then(async (res) => {
				if (!res.ok) throw new Error('Failed to fetch analytics');
				return res.json();
			})
			.then((json) => {
				const rows = json.rows || [];
				const pages = rows.map((row: any) => ({
					pagePath: row.dimensionValues?.[0]?.value || '',
					pageViews: parseInt(row.metricValues?.[0]?.value || '0'),
					users: parseInt(row.metricValues?.[1]?.value || '0'),
					avgSession: parseFloat(row.metricValues?.[2]?.value || '0'),
				}));
				setData(pages);
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
				<CardTitle>Top Pages</CardTitle>
				<CardDescription>
					Most visited pages in the selected period
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='overflow-x-auto'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Page Path</TableHead>
								<TableHead>Page Views</TableHead>
								<TableHead>Users</TableHead>
								<TableHead>Avg. Session</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.map((row) => (
								<TableRow key={row.pagePath}>
									<TableCell className='font-mono text-xs max-w-[200px] truncate'>
										<a
											href={
												row.pagePath.startsWith('http')
													? row.pagePath
													: `https://www.amaderkrishok.com${row.pagePath}`
											}
											target='_blank'
											rel='noopener noreferrer'
											className='flex items-center gap-1 hover:underline'
										>
											{row.pagePath}
											<ExternalLink className='h-3 w-3 text-muted-foreground' />
										</a>
									</TableCell>
									<TableCell>{formatNumber(row.pageViews)}</TableCell>
									<TableCell>{formatNumber(row.users)}</TableCell>
									<TableCell>{formatDuration(row.avgSession)}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}

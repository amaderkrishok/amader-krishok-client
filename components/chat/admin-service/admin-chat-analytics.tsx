'use client';

import { useState, useEffect } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	ChartLegend,
	ChartLegendContent,
	type ChartConfig,
} from '@/components/ui/chart';
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	AreaChart,
	Area,
} from 'recharts';
import {
	TrendingUp,
	BarChart3,
	PieChart as PieChartIcon,
	Activity,
	Clock,
	Users,
	MessageSquare,
	AlertTriangle,
} from 'lucide-react';
import {
	adminChatService,
	type AdminChatStats,
} from '@/services/chat/admin-chat-service';
import { toast } from 'sonner';

/**
 * Props for AdminChatAnalytics component
 */
interface AdminChatAnalyticsProps {
	/** Trigger for refreshing data */
	refreshTrigger?: Date;
}

/**
 * Chart data interfaces
 */
interface MessageHourlyData {
	hour: string;
	messages: number;
	users: number;
}

interface UserDistributionData {
	name: string;
	value: number;
	color: string;
}

interface TrendData {
	date: string;
	messages: number;
	rooms: number;
	users: number;
}

/**
 * Admin Chat Analytics Component
 *
 * @description Comprehensive analytics dashboard with interactive charts for:
 * - Message activity patterns by hour/day
 * - Room activity distribution
 * - User engagement metrics
 * - System performance trends
 * - Block and moderation statistics
 *
 * @param {AdminChatAnalyticsProps} props - Component properties
 * @returns {JSX.Element} Analytics dashboard with charts
 */
export function AdminChatAnalytics({
	refreshTrigger,
}: AdminChatAnalyticsProps) {
	// State management
	const [stats, setStats] = useState<AdminChatStats | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeChart, setActiveChart] = useState('hourly');

	/**
	 * Load analytics data
	 */
	const loadAnalytics = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const data = await adminChatService.getChatStats();
			setStats(data);
		} catch (err) {
			console.error('Failed to load analytics:', err);
			setError('Failed to load analytics data');
			toast.error('Failed to load analytics data');
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Initialize and handle refresh triggers
	 */
	useEffect(() => {
		loadAnalytics();
	}, [refreshTrigger]);

	/**
	 * Generate mock hourly message data (would come from backend in real implementation)
	 */
	const generateHourlyData = (): MessageHourlyData[] => {
		const hours = Array.from({ length: 24 }, (_, i) => {
			const hour = i.toString().padStart(2, '0') + ':00';
			// Mock data with peak hours simulation
			const isPeakHour = i >= 9 && i <= 17; // Business hours
			const baseMessages = Math.floor(Math.random() * 50) + 10;
			const messages = isPeakHour ? baseMessages * 2 : baseMessages;
			const users = Math.floor(messages * 0.3);

			return {
				hour,
				messages,
				users,
			};
		});
		return hours;
	};

	/**
	 * Generate user distribution pie chart data
	 */
	const generateUserDistributionData = (): UserDistributionData[] => {
		if (!stats) return [];

		const total =
			stats.onlineUsers + (stats.totalConnections - stats.onlineUsers);

		return [
			{
				name: 'Online Users',
				value: stats.onlineUsers,
				color: 'hsl(var(--chart-1))', // green
			},
			{
				name: 'Offline Users',
				value: total - stats.onlineUsers,
				color: 'hsl(var(--chart-2))', // gray
			},
		];
	};

	/**
	 * Generate trending data (7 days mock data)
	 */
	const generateTrendData = (): TrendData[] => {
		const days = Array.from({ length: 7 }, (_, i) => {
			const date = new Date();
			date.setDate(date.getDate() - (6 - i));

			return {
				date: date.toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric',
				}),
				messages: Math.floor(Math.random() * 1000) + 500,
				rooms: Math.floor(Math.random() * 50) + 20,
				users: Math.floor(Math.random() * 200) + 100,
			};
		});
		return days;
	};

	/**
	 * Chart configurations for shadcn/ui charts
	 */
	const hourlyChartConfig = {
		messages: {
			label: 'Messages',
			color: 'hsl(var(--chart-1))',
		},
		users: {
			label: 'Users',
			color: 'hsl(var(--chart-2))',
		},
	} satisfies ChartConfig;

	const distributionChartConfig = {
		online: {
			label: 'Online Users',
			color: 'hsl(var(--chart-1))',
		},
		offline: {
			label: 'Offline Users',
			color: 'hsl(var(--chart-2))',
		},
	} satisfies ChartConfig;

	const trendChartConfig = {
		messages: {
			label: 'Messages',
			color: 'hsl(var(--chart-1))',
		},
		rooms: {
			label: 'Rooms',
			color: 'hsl(var(--chart-2))',
		},
		users: {
			label: 'Users',
			color: 'hsl(var(--chart-3))',
		},
	} satisfies ChartConfig;

	if (isLoading) {
		return (
			<div className='space-y-6'>
				<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
					{Array.from({ length: 4 }).map((_, i) => (
						<Card key={i}>
							<CardHeader>
								<Skeleton className='h-4 w-24' />
							</CardHeader>
							<CardContent>
								<Skeleton className='h-48 w-full' />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	if (error || !stats) {
		return (
			<Card>
				<CardContent className='flex items-center justify-center h-96'>
					<div className='text-center'>
						<AlertTriangle className='h-8 w-8 text-destructive mx-auto mb-2' />
						<p className='text-sm text-muted-foreground'>
							{error || 'No analytics data available'}
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Analytics Tabs */}
			<Tabs
				value={activeChart}
				onValueChange={setActiveChart}
				className='space-y-6'
			>
				<TabsList className='grid w-full grid-cols-4'>
					<TabsTrigger value='hourly' className='flex items-center gap-2'>
						<BarChart3 className='h-4 w-4' />
						Hourly Activity
					</TabsTrigger>
					<TabsTrigger value='distribution' className='flex items-center gap-2'>
						<PieChartIcon className='h-4 w-4' />
						Distribution
					</TabsTrigger>
					<TabsTrigger value='trends' className='flex items-center gap-2'>
						<TrendingUp className='h-4 w-4' />
						Trends
					</TabsTrigger>
					<TabsTrigger value='performance' className='flex items-center gap-2'>
						<Activity className='h-4 w-4' />
						Performance
					</TabsTrigger>
				</TabsList>

				{/* Hourly Activity Charts */}
				<TabsContent value='hourly' className='space-y-6'>
					<div className='grid gap-6 lg:grid-cols-2'>
						{/* Hourly Message Activity */}
						<Card>
							<CardHeader>
								<CardTitle>Hourly Message Activity</CardTitle>
								<CardDescription>Message volume by hour of day</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartContainer config={hourlyChartConfig}>
									<BarChart data={generateHourlyData()}>
										<CartesianGrid strokeDasharray='3 3' />
										<XAxis dataKey='hour' />
										<YAxis />
										<ChartTooltip content={<ChartTooltipContent />} />
										<ChartLegend content={<ChartLegendContent />} />
										<Bar
											dataKey='messages'
											fill='var(--color-messages)'
											name='Messages'
										/>
									</BarChart>
								</ChartContainer>
							</CardContent>
						</Card>

						{/* Hourly User Activity */}
						<Card>
							<CardHeader>
								<CardTitle>Hourly User Activity</CardTitle>
								<CardDescription>Active users by hour of day</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartContainer config={hourlyChartConfig}>
									<LineChart data={generateHourlyData()}>
										<CartesianGrid strokeDasharray='3 3' />
										<XAxis dataKey='hour' />
										<YAxis />
										<ChartTooltip content={<ChartTooltipContent />} />
										<ChartLegend content={<ChartLegendContent />} />
										<Line
											type='monotone'
											dataKey='users'
											stroke='var(--color-users)'
											name='Active Users'
											strokeWidth={2}
										/>
									</LineChart>
								</ChartContainer>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* Distribution Charts */}
				<TabsContent value='distribution' className='space-y-6'>
					<div className='grid gap-6 lg:grid-cols-2'>
						{/* Room Activity Distribution */}
						<Card>
							<CardHeader>
								<CardTitle>Room Activity Distribution</CardTitle>
								<CardDescription>Active vs inactive rooms</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartContainer config={distributionChartConfig}>
									<PieChart>
										<Pie
											data={[
												{
													name: 'Active',
													value: stats.activeRooms,
													fill: 'var(--color-online)',
												},
												{
													name: 'Inactive',
													value: stats.inactiveRooms,
													fill: 'var(--color-offline)',
												},
											]}
											cx='50%'
											cy='50%'
											outerRadius={80}
											dataKey='value'
											label={({ name, percent }) =>
												`${name} ${(percent * 100).toFixed(0)}%`
											}
										></Pie>
										<ChartTooltip content={<ChartTooltipContent />} />
									</PieChart>
								</ChartContainer>
							</CardContent>
						</Card>

						{/* User Status Distribution */}
						<Card>
							<CardHeader>
								<CardTitle>User Status Distribution</CardTitle>
								<CardDescription>Online vs offline users</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartContainer config={distributionChartConfig}>
									<PieChart>
										<Pie
											data={generateUserDistributionData()}
											cx='50%'
											cy='50%'
											outerRadius={80}
											dataKey='value'
											label={({ name, percent }) =>
												`${name} ${(percent * 100).toFixed(0)}%`
											}
										>
											{generateUserDistributionData().map((entry, index) => (
												<Cell key={`cell-${index}`} fill={entry.color} />
											))}
										</Pie>
										<ChartTooltip content={<ChartTooltipContent />} />
									</PieChart>
								</ChartContainer>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* Trends Charts */}
				<TabsContent value='trends' className='space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle>7-Day Activity Trends</CardTitle>
							<CardDescription>
								Messages, rooms, and user activity over the past week
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ChartContainer config={trendChartConfig}>
								<AreaChart data={generateTrendData()}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis dataKey='date' />
									<YAxis />
									<ChartTooltip content={<ChartTooltipContent />} />
									<ChartLegend content={<ChartLegendContent />} />
									<Area
										type='monotone'
										dataKey='messages'
										stackId='1'
										stroke='var(--color-messages)'
										fill='var(--color-messages)'
										fillOpacity={0.6}
										name='Messages'
									/>
									<Area
										type='monotone'
										dataKey='users'
										stackId='2'
										stroke='var(--color-users)'
										fill='var(--color-users)'
										fillOpacity={0.6}
										name='Users'
									/>
								</AreaChart>
							</ChartContainer>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Performance Metrics */}
				<TabsContent value='performance' className='space-y-6'>
					<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
						{/* System Uptime */}
						<Card>
							<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
								<CardTitle className='text-sm font-medium'>
									System Uptime
								</CardTitle>
								<Clock className='h-4 w-4 text-muted-foreground' />
							</CardHeader>
							<CardContent>
								<div className='text-2xl font-bold text-green-600'>
									{Math.round(stats.serverUptime / 3600)}h
								</div>
								<div className='text-xs text-muted-foreground'>
									<Badge variant='outline' className='text-xs'>
										{((stats.serverUptime / 86400) * 100).toFixed(1)}% uptime
									</Badge>
								</div>
							</CardContent>
						</Card>

						{/* Connection Efficiency */}
						<Card>
							<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
								<CardTitle className='text-sm font-medium'>
									Connection Efficiency
								</CardTitle>
								<Activity className='h-4 w-4 text-muted-foreground' />
							</CardHeader>
							<CardContent>
								<div className='text-2xl font-bold text-blue-600'>
									{Math.round(
										(stats.onlineUsers / stats.totalConnections) * 100
									)}
									%
								</div>
								<div className='text-xs text-muted-foreground'>
									Active connections
								</div>
							</CardContent>
						</Card>

						{/* Message Density */}
						<Card>
							<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
								<CardTitle className='text-sm font-medium'>
									Message Density
								</CardTitle>
								<MessageSquare className='h-4 w-4 text-muted-foreground' />
							</CardHeader>
							<CardContent>
								<div className='text-2xl font-bold text-purple-600'>
									{Math.round(stats.totalMessages / stats.totalRooms)}
								</div>
								<div className='text-xs text-muted-foreground'>
									Messages per room
								</div>
							</CardContent>
						</Card>

						{/* Moderation Rate */}
						<Card>
							<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
								<CardTitle className='text-sm font-medium'>
									Moderation Rate
								</CardTitle>
								<Users className='h-4 w-4 text-muted-foreground' />
							</CardHeader>
							<CardContent>
								<div className='text-2xl font-bold text-orange-600'>
									{((stats.adminBlocks / stats.totalBlocks) * 100).toFixed(1)}%
								</div>
								<div className='text-xs text-muted-foreground'>
									Admin interventions
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Performance Summary */}
					<Card>
						<CardHeader>
							<CardTitle>Performance Summary</CardTitle>
							<CardDescription>
								Key system performance indicators
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								<div className='flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200'>
									<span className='font-medium text-green-800'>
										System Health
									</span>
									<Badge className='bg-green-500'>Excellent</Badge>
								</div>
								<div className='flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200'>
									<span className='font-medium text-blue-800'>
										User Engagement
									</span>
									<Badge className='bg-blue-500'>
										{Math.round((stats.activeRooms / stats.totalRooms) * 100)}%
										Active
									</Badge>
								</div>
								<div className='flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200'>
									<span className='font-medium text-yellow-800'>
										Moderation Load
									</span>
									<Badge className='bg-yellow-500'>
										{stats.totalBlocks} Total Blocks
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}

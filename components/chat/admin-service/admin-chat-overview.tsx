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
import {
	Users,
	MessageSquare,
	Shield,
	Activity,
	Clock,
	TrendingUp,
	TrendingDown,
	Globe,
	AlertTriangle,
} from 'lucide-react';
import {
	adminChatService,
	type AdminChatStats,
} from '@/services/chat/admin-chat-service';
import { toast } from 'sonner';

/**
 * Props for AdminChatOverview component
 */
interface AdminChatOverviewProps {
	/** Trigger for refreshing data */
	refreshTrigger?: Date;
}

/**
 * Admin Chat Overview Component
 *
 * @description Displays high-level chat system statistics and health metrics
 * - System-wide chat statistics
 * - Real-time activity indicators
 * - Performance metrics
 * - Health status indicators
 *
 * @param {AdminChatOverviewProps} props - Component properties
 * @returns {JSX.Element} Overview dashboard component
 */
export function AdminChatOverview({ refreshTrigger }: AdminChatOverviewProps) {
	// State management
	const [stats, setStats] = useState<AdminChatStats | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	/**
	 * Load chat statistics data
	 */
	const loadStats = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const data = await adminChatService.getChatStats();
			setStats(data);
		} catch (err) {
			console.error('Failed to load chat stats:', err);
			setError('Failed to load chat statistics');
			toast.error('Failed to load chat statistics');
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Initialize and handle refresh triggers
	 */
	useEffect(() => {
		loadStats();
	}, [refreshTrigger]);

	/**
	 * Calculate growth trends (mock implementation - would need historical data)
	 */
	const getTrendData = (current: number, type: string) => {
		// Mock trend data - in real implementation, compare with previous period
		const trends: Record<string, number> = {
			rooms: 12.5,
			messages: 8.3,
			users: 15.2,
			blocks: -5.1,
		};
		return trends[type] || 0;
	};

	/**
	 * Format large numbers with appropriate suffixes
	 */
	const formatNumber = (num: number): string => {
		if (num >= 1000000) {
			return `${(num / 1000000).toFixed(1)}M`;
		}
		if (num >= 1000) {
			return `${(num / 1000).toFixed(1)}K`;
		}
		return num.toString();
	};

	/**
	 * Get status color based on metric type and value
	 */
	const getStatusColor = (type: string, value: number): string => {
		switch (type) {
			case 'online':
				return value > 100
					? 'text-green-600'
					: value > 50
					? 'text-yellow-600'
					: 'text-red-600';
			case 'response':
				return value < 1000
					? 'text-green-600'
					: value < 5000
					? 'text-yellow-600'
					: 'text-red-600';
			default:
				return 'text-foreground';
		}
	};

	if (isLoading) {
		return (
			<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
				{Array.from({ length: 8 }).map((_, i) => (
					<Card key={i}>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<Skeleton className='h-4 w-24' />
							<Skeleton className='h-4 w-4' />
						</CardHeader>
						<CardContent>
							<Skeleton className='h-8 w-16 mb-2' />
							<Skeleton className='h-3 w-32' />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (error || !stats) {
		return (
			<Card>
				<CardContent className='flex items-center justify-center h-48'>
					<div className='text-center'>
						<AlertTriangle className='h-8 w-8 text-destructive mx-auto mb-2' />
						<p className='text-sm text-muted-foreground'>
							{error || 'No data available'}
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Main Statistics Grid */}
			<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
				{/* Total Rooms */}
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Rooms</CardTitle>
						<MessageSquare className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{formatNumber(stats.totalRooms)}
						</div>
						<div className='flex items-center text-xs text-muted-foreground'>
							<Badge
								variant={
									stats.activeRooms > stats.totalRooms * 0.6
										? 'default'
										: 'secondary'
								}
								className='text-xs'
							>
								{stats.activeRooms} active
							</Badge>
							{getTrendData(stats.totalRooms, 'rooms') > 0 ? (
								<TrendingUp className='h-3 w-3 text-green-600 ml-2' />
							) : (
								<TrendingDown className='h-3 w-3 text-red-600 ml-2' />
							)}
							<span className='ml-1'>
								{Math.abs(getTrendData(stats.totalRooms, 'rooms'))}%
							</span>
						</div>
					</CardContent>
				</Card>

				{/* Total Messages */}
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Total Messages
						</CardTitle>
						<MessageSquare className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{formatNumber(stats.totalMessages)}
						</div>
						<div className='flex items-center text-xs text-muted-foreground'>
							<Badge variant='secondary' className='text-xs'>
								System-wide
							</Badge>
							{getTrendData(stats.totalMessages, 'messages') > 0 ? (
								<TrendingUp className='h-3 w-3 text-green-600 ml-2' />
							) : (
								<TrendingDown className='h-3 w-3 text-red-600 ml-2' />
							)}
							<span className='ml-1'>
								{Math.abs(getTrendData(stats.totalMessages, 'messages'))}%
							</span>
						</div>
					</CardContent>
				</Card>

				{/* Online Users */}
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Online Users</CardTitle>
						<Users className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div
							className={`text-2xl font-bold ${getStatusColor(
								'online',
								stats.onlineUsers
							)}`}
						>
							{formatNumber(stats.onlineUsers)}
						</div>
						<div className='flex items-center text-xs text-muted-foreground'>
							<span>{formatNumber(stats.totalConnections)} connections</span>
							<Activity className='h-3 w-3 ml-2' />
						</div>
					</CardContent>
				</Card>

				{/* Blocked Users */}
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Blocks</CardTitle>
						<Shield className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{formatNumber(stats.totalBlocks)}
						</div>
						<div className='flex items-center text-xs text-muted-foreground'>
							<Badge
								variant={stats.adminBlocks > 0 ? 'destructive' : 'outline'}
								className='text-xs'
							>
								{stats.adminBlocks} admin blocks
							</Badge>
							{getTrendData(stats.totalBlocks, 'blocks') < 0 ? (
								<TrendingDown className='h-3 w-3 text-green-600 ml-2' />
							) : (
								<TrendingUp className='h-3 w-3 text-red-600 ml-2' />
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Performance Metrics */}
			<div className='grid gap-6 md:grid-cols-3'>
				{/* Server Uptime */}
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Server Uptime</CardTitle>
						<Clock className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{Math.round(stats.serverUptime / 3600)}h
						</div>
						<p className='text-xs text-muted-foreground'>System availability</p>
					</CardContent>
				</Card>

				{/* Total Connections */}
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Total Connections
						</CardTitle>
						<TrendingUp className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{formatNumber(stats.totalConnections)}
						</div>
						<p className='text-xs text-muted-foreground'>
							WebSocket connections
						</p>
					</CardContent>
				</Card>

				{/* Inactive Rooms */}
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Inactive Rooms
						</CardTitle>
						<Globe className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{formatNumber(stats.inactiveRooms)}
						</div>
						<p className='text-xs text-muted-foreground'>
							Dormant conversations
						</p>
					</CardContent>
				</Card>
			</div>

			{/* System Health Status */}
			<Card>
				<CardHeader>
					<CardTitle>System Health</CardTitle>
					<CardDescription>Real-time chat system status</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
						<div className='flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200'>
							<div>
								<p className='font-medium text-green-800'>Active Rooms</p>
								<p className='text-2xl font-bold text-green-900'>
									{stats.activeRooms}
								</p>
							</div>
							<div className='w-3 h-3 rounded-full bg-green-500'></div>
						</div>
						<div className='flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200'>
							<div>
								<p className='font-medium text-blue-800'>Online Users</p>
								<p className='text-2xl font-bold text-blue-900'>
									{stats.onlineUsers}
								</p>
							</div>
							<div className='w-3 h-3 rounded-full bg-blue-500'></div>
						</div>
						<div className='flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200'>
							<div>
								<p className='font-medium text-yellow-800'>Total Blocks</p>
								<p className='text-2xl font-bold text-yellow-900'>
									{stats.totalBlocks}
								</p>
							</div>
							<div className='w-3 h-3 rounded-full bg-yellow-500'></div>
						</div>
						<div className='flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200'>
							<div>
								<p className='font-medium text-red-800'>Admin Blocks</p>
								<p className='text-2xl font-bold text-red-900'>
									{stats.adminBlocks}
								</p>
							</div>
							<div className='w-3 h-3 rounded-full bg-red-500'></div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

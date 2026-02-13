'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Button } from '@/components/ui/button';
import {
	RefreshCw,
	Download,
	Settings,
	Shield,
	Users,
	MessageSquare,
	AlertTriangle,
	BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';
import {
	adminChatService,
	type ExportChatDataRequest,
} from '@/services/chat/admin-chat-service';
import { AdminChatOverview } from '@/components/chat/admin-service/admin-chat-overview';
import { AdminChatAnalytics } from '@/components/chat/admin-service/admin-chat-analytics';
import { AdminRoomManagement } from '@/components/chat/admin-service/admin-room-management';
import { AdminUserActivity } from '@/components/chat/admin-service/admin-user-activity';
import { AdminBlockManagement } from '@/components/chat/admin-service/admin-block-management';
import { AdminReportManagement } from '@/components/chat/admin-service/admin-report-management';
import { AdminChatSettings } from '@/components/chat/admin-service/admin-chat-settings';

/**
 * Admin Chat Service Main Page
 *
 * @description Comprehensive admin interface for chat system management including:
 * - Real-time analytics and insights
 * - Room and message moderation
 * - User activity monitoring
 * - Block and report management
 * - System configuration
 *
 * @implementation Follows SOLID principles:
 * - Single Responsibility: Each tab handles specific admin functions
 * - Open/Closed: Extensible for new admin features
 * - Interface Segregation: Focused component interfaces
 * - Dependency Inversion: Service-based architecture
 */
function AdminChatServicePage() {
	// State management
	const [isLoading, setIsLoading] = useState(true);
	const [activeTab, setActiveTab] = useState('overview');
	const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
	const [refreshing, setRefreshing] = useState(false);

	/**
	 * Initialize admin dashboard data
	 */
	useEffect(() => {
		initializeDashboard();
	}, []);

	/**
	 * Initialize dashboard data and components
	 */
	const initializeDashboard = async () => {
		try {
			setIsLoading(true);
			// Initial data loading will be handled by individual components
			setLastRefresh(new Date());
		} catch (error) {
			console.error('Failed to initialize admin dashboard:', error);
			toast.error('Failed to load admin dashboard');
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Refresh all dashboard data
	 */
	const handleRefreshAll = async () => {
		try {
			setRefreshing(true);
			// Trigger refresh in all child components
			setLastRefresh(new Date());
			toast.success('Dashboard refreshed successfully');
		} catch (error) {
			console.error('Failed to refresh dashboard:', error);
			toast.error('Failed to refresh dashboard');
		} finally {
			setRefreshing(false);
		}
	};

	/**
	 * Export chat data
	 */
	const handleExportData = async () => {
		try {
			const exportOptions: ExportChatDataRequest = {
				format: 'xlsx',
				type: 'messages',
				dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
				dateTo: new Date(),
			};

			const blob = await adminChatService.exportChatData(exportOptions);

			// Create download link
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `chat-data-export-${
				new Date().toISOString().split('T')[0]
			}.xlsx`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			toast.success('Data exported successfully');
		} catch (error) {
			console.error('Failed to export data:', error);
			toast.error('Failed to export data');
		}
	};

	if (isLoading) {
		return (
			<div className='container mx-auto p-6'>
				<div className='flex items-center justify-center h-96'>
					<div className='text-center'>
						<RefreshCw className='h-8 w-8 animate-spin mx-auto mb-4' />
						<p className='text-lg font-medium'>Loading Admin Dashboard...</p>
						<p className='text-sm text-muted-foreground'>
							Initializing chat service management
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='container mx-auto p-6 space-y-6'>
			{/* Header Section */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold'>Chat Service Administration</h1>
					<p className='text-muted-foreground'>
						Comprehensive chat system management and analytics
					</p>
					<p className='text-xs text-muted-foreground mt-1'>
						Last updated: {lastRefresh.toLocaleString()}
					</p>
				</div>
				<div className='flex gap-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={handleExportData}
						className='flex items-center gap-2'
					>
						<Download className='h-4 w-4' />
						Export Data
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={handleRefreshAll}
						disabled={refreshing}
						className='flex items-center gap-2'
					>
						<RefreshCw
							className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
						/>
						Refresh All
					</Button>
				</div>
			</div>

			{/* Main Dashboard Tabs */}
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className='space-y-6'
			>
				<TabsList className='grid w-full grid-cols-7'>
					<TabsTrigger value='overview' className='flex items-center gap-2'>
						<BarChart3 className='h-4 w-4' />
						Overview
					</TabsTrigger>
					<TabsTrigger value='analytics' className='flex items-center gap-2'>
						<BarChart3 className='h-4 w-4' />
						Analytics
					</TabsTrigger>
					<TabsTrigger value='rooms' className='flex items-center gap-2'>
						<MessageSquare className='h-4 w-4' />
						Rooms
					</TabsTrigger>
					<TabsTrigger value='users' className='flex items-center gap-2'>
						<Users className='h-4 w-4' />
						Users
					</TabsTrigger>
					<TabsTrigger value='blocks' className='flex items-center gap-2'>
						<Shield className='h-4 w-4' />
						Blocks
					</TabsTrigger>
					<TabsTrigger value='reports' className='flex items-center gap-2'>
						<AlertTriangle className='h-4 w-4' />
						Reports
					</TabsTrigger>
					<TabsTrigger value='settings' className='flex items-center gap-2'>
						<Settings className='h-4 w-4' />
						Settings
					</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value='overview' className='space-y-6'>
					<AdminChatOverview refreshTrigger={lastRefresh} />
				</TabsContent>

				{/* Analytics Tab */}
				<TabsContent value='analytics' className='space-y-6'>
					<AdminChatAnalytics refreshTrigger={lastRefresh} />
				</TabsContent>

				{/* Room Management Tab */}
				<TabsContent value='rooms' className='space-y-6'>
					<AdminRoomManagement refreshTrigger={lastRefresh} />
				</TabsContent>

				{/* User Activity Tab */}
				<TabsContent value='users' className='space-y-6'>
					<AdminUserActivity refreshTrigger={lastRefresh} />
				</TabsContent>

				{/* Block Management Tab */}
				<TabsContent value='blocks' className='space-y-6'>
					<AdminBlockManagement refreshTrigger={lastRefresh} />
				</TabsContent>

				{/* Report Management Tab */}
				<TabsContent value='reports' className='space-y-6'>
					<AdminReportManagement refreshTrigger={lastRefresh} />
				</TabsContent>

				{/* Settings Tab */}
				<TabsContent value='settings' className='space-y-6'>
					<AdminChatSettings refreshTrigger={lastRefresh} />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default AdminChatServicePage;

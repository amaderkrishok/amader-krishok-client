'use client';

import { useState, useEffect } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Search,
	Filter,
	MoreHorizontal,
	Eye,
	Shield,
	AlertTriangle,
	MessageSquare,
	Users,
	Clock,
	RefreshCw,
} from 'lucide-react';
import {
	adminChatService,
	type AdminRoomDetails,
} from '@/services/chat/admin-chat-service';
import { toast } from 'sonner';

/**
 * Props for AdminRoomManagement component
 */
interface AdminRoomManagementProps {
	/** Trigger for refreshing data */
	refreshTrigger?: Date;
}

/**
 * Admin Room Management Component
 *
 * @description Comprehensive room management interface for administrators:
 * - View all chat rooms with detailed information
 * - Search and filter rooms
 * - Monitor room activity and status
 * - Take moderation actions on rooms
 * - View room participants and messages
 *
 * @param {AdminRoomManagementProps} props - Component properties
 * @returns {JSX.Element} Room management interface
 */
export function AdminRoomManagement({
	refreshTrigger,
}: AdminRoomManagementProps) {
	// State management
	const [rooms, setRooms] = useState<AdminRoomDetails[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const [selectedRoom, setSelectedRoom] = useState<AdminRoomDetails | null>(
		null
	);
	const [showRoomDetails, setShowRoomDetails] = useState(false);

	/**
	 * Load rooms data with pagination
	 */
	const loadRooms = async (page: number = 1, reset: boolean = false) => {
		try {
			if (reset) {
				setIsLoading(true);
				setError(null);
			}

			const response = await adminChatService.getAllRooms({ page, limit: 20 });

			if (reset) {
				setRooms(response.rooms);
			} else {
				setRooms((prev) => [...prev, ...response.rooms]);
			}

			setHasMore(response.pagination.hasMore);
			setCurrentPage(page);
		} catch (err) {
			console.error('Failed to load rooms:', err);
			setError('Failed to load rooms');
			toast.error('Failed to load rooms');
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Initialize and handle refresh triggers
	 */
	useEffect(() => {
		loadRooms(1, true);
	}, [refreshTrigger]);

	/**
	 * Handle search filtering
	 */
	const filteredRooms = rooms.filter((room) => {
		const searchLower = searchQuery.toLowerCase();
		return (
			room.id.toLowerCase().includes(searchLower) ||
			room.initiator.role.toLowerCase().includes(searchLower) ||
			room.participant.role.toLowerCase().includes(searchLower)
		);
	});

	/**
	 * Load more rooms (pagination)
	 */
	const handleLoadMore = () => {
		if (hasMore && !isLoading) {
			loadRooms(currentPage + 1, false);
		}
	};

	/**
	 * View room details
	 */
	const handleViewRoom = (room: AdminRoomDetails) => {
		setSelectedRoom(room);
		setShowRoomDetails(true);
	};

	/**
	 * Monitor room
	 */
	const handleMonitorRoom = async (roomId: string) => {
		try {
			// This would call the monitor room API - placeholder implementation
			console.log('Monitoring room:', roomId);
			toast.success('Room monitoring enabled');
		} catch (error) {
			console.error('Failed to monitor room:', error);
			toast.error('Failed to enable room monitoring');
		}
	};

	/**
	 * Format date for display
	 */
	const formatDate = (date: Date | string): string => {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	/**
	 * Get room status badge
	 */
	const getRoomStatusBadge = (room: AdminRoomDetails) => {
		if (!room.isActive) {
			return <Badge variant='secondary'>Inactive</Badge>;
		}
		if (room.totalMessages === 0) {
			return <Badge variant='outline'>New</Badge>;
		}
		return <Badge variant='default'>Active</Badge>;
	};

	/**
	 * Get participant role badge
	 */
	const getRoleBadge = (role: string) => {
		const variant =
			role === 'VENDOR'
				? 'default'
				: role === 'ADMIN'
				? 'destructive'
				: 'secondary';
		return <Badge variant={variant}>{role}</Badge>;
	};

	if (isLoading && rooms.length === 0) {
		return (
			<div className='space-y-6'>
				<Card>
					<CardHeader>
						<Skeleton className='h-6 w-48' />
						<Skeleton className='h-4 w-96' />
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							{Array.from({ length: 5 }).map((_, i) => (
								<Skeleton key={i} className='h-16 w-full' />
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Header and Controls */}
			<Card>
				<CardHeader>
					<div className='flex items-center justify-between'>
						<div>
							<CardTitle className='flex items-center gap-2'>
								<MessageSquare className='h-5 w-5' />
								Room Management
							</CardTitle>
							<CardDescription>
								Monitor and manage all chat rooms in the system
							</CardDescription>
						</div>
						<Button
							variant='outline'
							size='sm'
							onClick={() => loadRooms(1, true)}
							disabled={isLoading}
						>
							<RefreshCw
								className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
							/>
							Refresh
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className='flex items-center gap-4 mb-6'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
							<Input
								placeholder='Search rooms by ID, participant role...'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='pl-10'
							/>
						</div>
						<Button variant='outline' size='sm'>
							<Filter className='h-4 w-4 mr-2' />
							Filters
						</Button>
					</div>

					{/* Statistics Summary */}
					<div className='grid gap-4 md:grid-cols-4 mb-6'>
						<div className='flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200'>
							<MessageSquare className='h-8 w-8 text-blue-600' />
							<div>
								<p className='text-sm font-medium text-blue-800'>Total Rooms</p>
								<p className='text-2xl font-bold text-blue-900'>
									{rooms.length}
								</p>
							</div>
						</div>
						<div className='flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200'>
							<Users className='h-8 w-8 text-green-600' />
							<div>
								<p className='text-sm font-medium text-green-800'>
									Active Rooms
								</p>
								<p className='text-2xl font-bold text-green-900'>
									{rooms.filter((r) => r.isActive).length}
								</p>
							</div>
						</div>
						<div className='flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200'>
							<Clock className='h-8 w-8 text-yellow-600' />
							<div>
								<p className='text-sm font-medium text-yellow-800'>
									Recent Activity
								</p>
								<p className='text-2xl font-bold text-yellow-900'>
									{
										rooms.filter((r) => {
											const lastActivity = new Date(r.lastActivityAt);
											const oneDayAgo = new Date(
												Date.now() - 24 * 60 * 60 * 1000
											);
											return lastActivity > oneDayAgo;
										}).length
									}
								</p>
							</div>
						</div>
						<div className='flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200'>
							<AlertTriangle className='h-8 w-8 text-red-600' />
							<div>
								<p className='text-sm font-medium text-red-800'>
									Requires Attention
								</p>
								<p className='text-2xl font-bold text-red-900'>
									{
										rooms.filter((r) => r.totalMessages === 0 && r.isActive)
											.length
									}
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Rooms Table */}
			<Card>
				<CardHeader>
					<CardTitle>All Rooms ({filteredRooms.length})</CardTitle>
				</CardHeader>
				<CardContent>
					{filteredRooms.length > 0 ? (
						<div className='space-y-4'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Room ID</TableHead>
										<TableHead>Participants</TableHead>
										<TableHead>Messages</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Last Activity</TableHead>
										<TableHead>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredRooms.map((room) => (
										<TableRow key={room.id}>
											<TableCell className='font-mono text-sm'>
												{room.id.substring(0, 8)}...
											</TableCell>
											<TableCell>
												<div className='flex items-center gap-2'>
													<Avatar className='h-6 w-6'>
														<AvatarFallback className='text-xs'>
															{room.initiator.role.charAt(0)}
														</AvatarFallback>
													</Avatar>
													{getRoleBadge(room.initiator.role)}
													<span className='text-muted-foreground'>↔</span>
													<Avatar className='h-6 w-6'>
														<AvatarFallback className='text-xs'>
															{room.participant.role.charAt(0)}
														</AvatarFallback>
													</Avatar>
													{getRoleBadge(room.participant.role)}
												</div>
											</TableCell>
											<TableCell>
												<div className='flex items-center gap-2'>
													<span className='font-medium'>
														{room.totalMessages}
													</span>
													{(room.unreadCountInitiator > 0 ||
														room.unreadCountParticipant > 0) && (
														<Badge variant='destructive' className='text-xs'>
															{room.unreadCountInitiator +
																room.unreadCountParticipant}{' '}
															unread
														</Badge>
													)}
												</div>
											</TableCell>
											<TableCell>{getRoomStatusBadge(room)}</TableCell>
											<TableCell className='text-sm text-muted-foreground'>
												{formatDate(room.lastActivityAt)}
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant='ghost' size='sm'>
															<MoreHorizontal className='h-4 w-4' />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end'>
														<DropdownMenuItem
															onClick={() => handleViewRoom(room)}
														>
															<Eye className='h-4 w-4 mr-2' />
															View Details
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleMonitorRoom(room.id)}
														>
															<Shield className='h-4 w-4 mr-2' />
															Monitor Room
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>

							{/* Load More Button */}
							{hasMore && (
								<div className='flex justify-center'>
									<Button
										variant='outline'
										onClick={handleLoadMore}
										disabled={isLoading}
									>
										{isLoading ? (
											<RefreshCw className='h-4 w-4 mr-2 animate-spin' />
										) : null}
										Load More Rooms
									</Button>
								</div>
							)}
						</div>
					) : (
						<div className='text-center py-8'>
							<MessageSquare className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
							<p className='text-lg font-medium'>No rooms found</p>
							<p className='text-sm text-muted-foreground'>
								{searchQuery
									? 'Try adjusting your search criteria'
									: 'No chat rooms have been created yet'}
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Room Details Dialog */}
			<Dialog open={showRoomDetails} onOpenChange={setShowRoomDetails}>
				<DialogContent className='max-w-4xl'>
					<DialogHeader>
						<DialogTitle>Room Details</DialogTitle>
						<DialogDescription>
							Detailed information about the selected chat room
						</DialogDescription>
					</DialogHeader>
					{selectedRoom && (
						<div className='space-y-6'>
							{/* Room Information */}
							<div className='grid gap-4 md:grid-cols-2'>
								<Card>
									<CardHeader>
										<CardTitle className='text-sm'>Room Information</CardTitle>
									</CardHeader>
									<CardContent className='space-y-2'>
										<div className='flex justify-between'>
											<span className='text-sm text-muted-foreground'>
												Room ID:
											</span>
											<span className='font-mono text-sm'>
												{selectedRoom.id}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-muted-foreground'>
												Status:
											</span>
											{getRoomStatusBadge(selectedRoom)}
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-muted-foreground'>
												Total Messages:
											</span>
											<span className='font-medium'>
												{selectedRoom.totalMessages}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-muted-foreground'>
												Created:
											</span>
											<span className='text-sm'>
												{formatDate(selectedRoom.createdAt)}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-muted-foreground'>
												Last Activity:
											</span>
											<span className='text-sm'>
												{formatDate(selectedRoom.lastActivityAt)}
											</span>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className='text-sm'>Participants</CardTitle>
									</CardHeader>
									<CardContent className='space-y-4'>
										<div className='flex items-center justify-between p-3 rounded-lg border'>
											<div className='flex items-center gap-3'>
												<Avatar>
													<AvatarFallback>
														{selectedRoom.initiator.role.charAt(0)}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className='font-medium'>Initiator</p>
													<p className='text-sm text-muted-foreground'>
														ID: {selectedRoom.initiator.id}
													</p>
												</div>
											</div>
											{getRoleBadge(selectedRoom.initiator.role)}
										</div>
										<div className='flex items-center justify-between p-3 rounded-lg border'>
											<div className='flex items-center gap-3'>
												<Avatar>
													<AvatarFallback>
														{selectedRoom.participant.role.charAt(0)}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className='font-medium'>Participant</p>
													<p className='text-sm text-muted-foreground'>
														ID: {selectedRoom.participant.id}
													</p>
												</div>
											</div>
											{getRoleBadge(selectedRoom.participant.role)}
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Unread Counts */}
							<Card>
								<CardHeader>
									<CardTitle className='text-sm'>Unread Messages</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='grid gap-4 md:grid-cols-2'>
										<div className='flex items-center justify-between p-3 rounded-lg bg-blue-50'>
											<span className='font-medium'>Initiator Unread:</span>
											<Badge
												variant={
													selectedRoom.unreadCountInitiator > 0
														? 'destructive'
														: 'outline'
												}
											>
												{selectedRoom.unreadCountInitiator}
											</Badge>
										</div>
										<div className='flex items-center justify-between p-3 rounded-lg bg-green-50'>
											<span className='font-medium'>Participant Unread:</span>
											<Badge
												variant={
													selectedRoom.unreadCountParticipant > 0
														? 'destructive'
														: 'outline'
												}
											>
												{selectedRoom.unreadCountParticipant}
											</Badge>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

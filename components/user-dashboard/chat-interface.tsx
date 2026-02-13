'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Send,
	Phone,
	Video,
	Search,
	MoreVertical,
	Paperclip,
	Smile,
	ImageIcon,
	ArrowLeft,
	Menu,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';

type Message = {
	id: string;
	content: string;
	sender: 'user' | 'vendor';
	timestamp: Date;
	read: boolean;
};

type Vendor = {
	id: string;
	name: string;
	avatar: string;
	company: string;
	status: 'online' | 'offline' | 'away';
	lastMessage?: string;
	lastMessageTime?: Date;
	unreadCount?: number;
};

export function ChatInterface() {
	const [message, setMessage] = useState('');
	const [activeVendor, setActiveVendor] = useState<string>('v1');
	const [searchQuery, setSearchQuery] = useState('');
	const [showChatList, setShowChatList] = useState(true);
	const isMobile = useIsMobile();

	// Mock data for vendors
	const vendors: Vendor[] = [
		{
			id: 'v1',
			name: 'Sarah Miller',
			avatar: '/placeholder.svg?height=40&width=40',
			company: 'Swiss Precision Watches',
			status: 'online',
			lastMessage:
				'Your order is currently in transit and should arrive by April 22nd.',
			lastMessageTime: new Date(Date.now() - 2400000),
			unreadCount: 0,
		},
		{
			id: 'v2',
			name: 'Michael Johnson',
			avatar: '/placeholder.svg?height=40&width=40',
			company: 'Alpine Leather Goods',
			status: 'away',
			lastMessage:
				"We've processed your return request. You should receive the refund within 3-5 business days.",
			lastMessageTime: new Date(Date.now() - 86400000),
			unreadCount: 2,
		},
		{
			id: 'v3',
			name: 'Emma Schmidt',
			avatar: '/placeholder.svg?height=40&width=40',
			company: 'Swiss Army Products',
			status: 'offline',
			lastMessage:
				'Thank you for your purchase! Let me know if you have any questions about your knife.',
			lastMessageTime: new Date(Date.now() - 172800000),
			unreadCount: 0,
		},
		{
			id: 'v4',
			name: 'Thomas Weber',
			avatar: '/placeholder.svg?height=40&width=40',
			company: 'Luxury Fountain Pens',
			status: 'online',
			lastMessage:
				'The limited edition pen you inquired about is now back in stock!',
			lastMessageTime: new Date(Date.now() - 259200000),
			unreadCount: 3,
		},
		{
			id: 'v5',
			name: 'Anna Müller',
			avatar: '/placeholder.svg?height=40&width=40',
			company: 'Swiss Winter Apparel',
			status: 'offline',
			lastMessage:
				"We've just launched our new winter collection. Would you like to see a preview?",
			lastMessageTime: new Date(Date.now() - 345600000),
			unreadCount: 0,
		},
	];

	// Mock data for messages with different vendors
	const allMessages: Record<string, Message[]> = {
		v1: [
			{
				id: '1',
				content: 'Hello! How can I help you with your recent order?',
				sender: 'vendor',
				timestamp: new Date(Date.now() - 3600000),
				read: true,
			},
			{
				id: '2',
				content:
					'I have a question about the delivery time for my Swiss Automatic Watch.',
				sender: 'user',
				timestamp: new Date(Date.now() - 3000000),
				read: true,
			},
			{
				id: '3',
				content:
					"Of course! Your order is currently in transit and should arrive by April 22nd. Is there anything specific you'd like to know?",
				sender: 'vendor',
				timestamp: new Date(Date.now() - 2400000),
				read: true,
			},
		],
		v2: [
			{
				id: '1',
				content:
					"Hello! I'm Michael from Alpine Leather Goods. How may I assist you today?",
				sender: 'vendor',
				timestamp: new Date(Date.now() - 172800000),
				read: true,
			},
			{
				id: '2',
				content:
					"I'd like to return the leather belt I purchased. It's too small for me.",
				sender: 'user',
				timestamp: new Date(Date.now() - 100800000),
				read: true,
			},
			{
				id: '3',
				content:
					"I'm sorry to hear that. I'd be happy to process a return for you. Could you provide your order number?",
				sender: 'vendor',
				timestamp: new Date(Date.now() - 90000000),
				read: true,
			},
			{
				id: '4',
				content: "It's ORD-4321",
				sender: 'user',
				timestamp: new Date(Date.now() - 87000000),
				read: true,
			},
			{
				id: '5',
				content:
					"Thank you. I've found your order and initiated the return process.",
				sender: 'vendor',
				timestamp: new Date(Date.now() - 86500000),
				read: true,
			},
			{
				id: '6',
				content:
					"We've processed your return request. You should receive the refund within 3-5 business days.",
				sender: 'vendor',
				timestamp: new Date(Date.now() - 86400000),
				read: false,
			},
			{
				id: '7',
				content: 'Would you like to order a replacement in a larger size?',
				sender: 'vendor',
				timestamp: new Date(Date.now() - 86300000),
				read: false,
			},
		],
		v3: [
			{
				id: '1',
				content: 'Thank you for your purchase of the Swiss Army Knife!',
				sender: 'vendor',
				timestamp: new Date(Date.now() - 172800000),
				read: true,
			},
			{
				id: '2',
				content: "You're welcome! I've been wanting one for a long time.",
				sender: 'user',
				timestamp: new Date(Date.now() - 172700000),
				read: true,
			},
			{
				id: '3',
				content:
					'Thank you for your purchase! Let me know if you have any questions about your knife.',
				sender: 'vendor',
				timestamp: new Date(Date.now() - 172600000),
				read: true,
			},
		],
		v4: [
			{
				id: '1',
				content:
					'Hello from Luxury Fountain Pens! Thank you for your interest in our products.',
				sender: 'vendor',
				timestamp: new Date(Date.now() - 345700000),
				read: true,
			},
			{
				id: '2',
				content:
					"I'm looking for a limited edition fountain pen. Do you have any in stock?",
				sender: 'user',
				timestamp: new Date(Date.now() - 345600000),
				read: true,
			},
			{
				id: '3',
				content:
					"We're currently out of stock, but we're expecting a new shipment next week.",
				sender: 'vendor',
				timestamp: new Date(Date.now() - 345500000),
				read: true,
			},
			{
				id: '4',
				content:
					"I'll add you to our notification list and let you know as soon as they arrive.",
				sender: 'vendor',
				timestamp: new Date(Date.now() - 345400000),
				read: true,
			},
			{
				id: '5',
				content:
					'The limited edition pen you inquired about is now back in stock!',
				sender: 'vendor',
				timestamp: new Date(Date.now() - 259200000),
				read: false,
			},
			{
				id: '6',
				content: 'Would you like me to reserve one for you?',
				sender: 'vendor',
				timestamp: new Date(Date.now() - 259100000),
				read: false,
			},
			{
				id: '7',
				content: 'We also have a special promotion running this week.',
				sender: 'vendor',
				timestamp: new Date(Date.now() - 259000000),
				read: false,
			},
		],
		v5: [
			{
				id: '1',
				content: 'Welcome to Swiss Winter Apparel! How can I assist you today?',
				sender: 'vendor',
				timestamp: new Date(Date.now() - 432000000),
				read: true,
			},
			{
				id: '2',
				content:
					"I'm looking for a warm winter scarf. Do you have any recommendations?",
				sender: 'user',
				timestamp: new Date(Date.now() - 431900000),
				read: true,
			},
			{
				id: '3',
				content:
					'Our wool winter scarves are very popular and come in various colors.',
				sender: 'vendor',
				timestamp: new Date(Date.now() - 431800000),
				read: true,
			},
			{
				id: '4',
				content:
					"We've just launched our new winter collection. Would you like to see a preview?",
				sender: 'vendor',
				timestamp: new Date(Date.now() - 345600000),
				read: true,
			},
		],
	};

	const [messages, setMessages] = useState<Message[]>(
		allMessages[activeVendor] || []
	);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		// Update messages when active vendor changes
		setMessages(allMessages[activeVendor] || []);

		// On mobile, when selecting a vendor, show the chat
		if (isMobile) {
			setShowChatList(false);
		}
	}, [activeVendor, isMobile]);

	// Reset to showing the chat list when on mobile and component mounts
	useEffect(() => {
		if (isMobile) {
			setShowChatList(true);
		}
	}, [isMobile]);

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!message.trim()) return;

		const newMessage: Message = {
			id: Date.now().toString(),
			content: message,
			sender: 'user',
			timestamp: new Date(),
			read: true,
		};

		// Update messages for the current vendor
		const updatedMessages = [...messages, newMessage];
		setMessages(updatedMessages);
		allMessages[activeVendor] = updatedMessages;
		setMessage('');

		// Simulate vendor response after a short delay
		setTimeout(() => {
			const vendorResponse: Message = {
				id: (Date.now() + 1).toString(),
				content:
					"Thank you for your message. I'll check on that for you right away.",
				sender: 'vendor',
				timestamp: new Date(),
				read: true,
			};
			const updatedWithResponse = [...updatedMessages, vendorResponse];
			setMessages(updatedWithResponse);
			allMessages[activeVendor] = updatedWithResponse;
		}, 2000);
	};

	const handleVendorSelect = (vendorId: string) => {
		setActiveVendor(vendorId);
		if (isMobile) {
			setShowChatList(false);
		}
	};

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	const formatDate = (date: Date) => {
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (date.toDateString() === today.toDateString()) {
			return 'Today';
		} else if (date.toDateString() === yesterday.toDateString()) {
			return 'Yesterday';
		} else {
			return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
		}
	};

	const getActiveVendor = () => {
		return vendors.find((vendor) => vendor.id === activeVendor) || vendors[0];
	};

	const filteredVendors = vendors.filter(
		(vendor) =>
			vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			vendor.company.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Render the chat list for both mobile and desktop
	const renderChatList = () => (
		<Card
			className={`${
				isMobile && !showChatList ? 'hidden' : 'flex'
			} flex-col h-full overflow-hidden`}
		>
			<div className='p-3 border-b'>
				<div className='relative'>
					<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
					<Input
						type='search'
						placeholder='Search vendors...'
						className='pl-8'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>
			<ScrollArea className='flex-1'>
				<div className='p-2 space-y-1'>
					{filteredVendors.map((vendor) => (
						<button
							key={vendor.id}
							className={`w-full text-left rounded-lg p-2.5 transition-colors ${
								activeVendor === vendor.id
									? 'bg-primary/10 hover:bg-primary/15'
									: 'hover:bg-muted'
							}`}
							onClick={() => handleVendorSelect(vendor.id)}
						>
							<div className='flex items-start gap-3'>
								<div className='relative'>
									<Avatar className='h-10 w-10'>
										<AvatarImage
											src={vendor.avatar || '/placeholder.svg'}
											alt={vendor.name}
										/>
										<AvatarFallback>{vendor.name.charAt(0)}</AvatarFallback>
									</Avatar>
									<span
										className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
											vendor.status === 'online'
												? 'bg-green-500'
												: vendor.status === 'away'
												? 'bg-yellow-500'
												: 'bg-gray-500'
										}`}
									></span>
								</div>
								<div className='flex-1 min-w-0'>
									<div className='flex justify-between items-start'>
										<p className='font-medium text-sm truncate'>
											{vendor.name}
										</p>
										{vendor.lastMessageTime && (
											<span className='text-xs text-muted-foreground'>
												{formatDate(vendor.lastMessageTime)}
											</span>
										)}
									</div>
									<p className='text-xs text-muted-foreground truncate'>
										{vendor.company}
									</p>
									{vendor.lastMessage && (
										<p className='text-xs truncate mt-1'>
											{vendor.lastMessage}
										</p>
									)}
								</div>
								{vendor.unreadCount ? (
									<Badge className='ml-auto shrink-0 bg-primary'>
										{vendor.unreadCount}
									</Badge>
								) : null}
							</div>
						</button>
					))}
				</div>
			</ScrollArea>
		</Card>
	);

	// Render the chat area for both mobile and desktop
	const renderChatArea = () => (
		<Card
			className={`${
				isMobile && showChatList ? 'hidden' : 'flex'
			} flex-col h-full`}
		>
			<div className='border-b p-3 flex justify-between items-center'>
				<div className='flex items-center gap-2'>
					{isMobile && (
						<Button
							variant='ghost'
							size='icon'
							className='h-8 w-8 mr-1'
							onClick={() => setShowChatList(true)}
						>
							<ArrowLeft className='h-4 w-4' />
							<span className='sr-only'>Back to chat list</span>
						</Button>
					)}
					<Avatar className='h-9 w-9'>
						<AvatarImage
							src={getActiveVendor().avatar || '/placeholder.svg'}
							alt={getActiveVendor().name}
						/>
						<AvatarFallback>{getActiveVendor().name.charAt(0)}</AvatarFallback>
					</Avatar>
					<div>
						<p className='text-sm font-medium'>{getActiveVendor().name}</p>
						<div className='flex items-center'>
							<span
								className={`h-2 w-2 rounded-full mr-1 ${
									getActiveVendor().status === 'online'
										? 'bg-green-500'
										: getActiveVendor().status === 'away'
										? 'bg-yellow-500'
										: 'bg-gray-500'
								}`}
							></span>
							<span className='text-xs capitalize text-muted-foreground'>
								{getActiveVendor().status}
							</span>
						</div>
					</div>
				</div>
				<div className='flex items-center gap-1'>
					<Button variant='ghost' size='icon' className='h-8 w-8'>
						<Phone className='h-4 w-4' />
						<span className='sr-only'>Call</span>
					</Button>
					<Button variant='ghost' size='icon' className='h-8 w-8'>
						<Video className='h-4 w-4' />
						<span className='sr-only'>Video</span>
					</Button>
					{isMobile && (
						<Sheet>
							<SheetTrigger asChild>
								<Button variant='ghost' size='icon' className='h-8 w-8'>
									<Menu className='h-4 w-4' />
									<span className='sr-only'>Vendor Info</span>
								</Button>
							</SheetTrigger>
							<SheetContent side='right' className='w-full sm:max-w-md p-0'>
								{renderVendorInfo()}
							</SheetContent>
						</Sheet>
					)}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' size='icon' className='h-8 w-8'>
								<MoreVertical className='h-4 w-4' />
								<span className='sr-only'>More options</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuLabel>Options</DropdownMenuLabel>
							<DropdownMenuItem>View vendor profile</DropdownMenuItem>
							<DropdownMenuItem>Search in conversation</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Mute notifications</DropdownMenuItem>
							<DropdownMenuItem>Block vendor</DropdownMenuItem>
							<DropdownMenuItem className='text-destructive'>
								Clear chat history
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<ScrollArea className='flex-1 p-4'>
				<div className='space-y-4'>
					{messages.length > 0 ? (
						<>
							{/* Group messages by date */}
							{messages.map((msg, index) => {
								// Check if we need to show a date separator
								const showDateSeparator =
									index === 0 ||
									formatDate(msg.timestamp) !==
										formatDate(messages[index - 1].timestamp);

								return (
									<div key={msg.id}>
										{showDateSeparator && (
											<div className='flex items-center my-4'>
												<Separator className='flex-grow' />
												<span className='mx-2 text-xs text-muted-foreground'>
													{formatDate(msg.timestamp)}
												</span>
												<Separator className='flex-grow' />
											</div>
										)}
										<div
											className={`flex ${
												msg.sender === 'user' ? 'justify-end' : 'justify-start'
											}`}
										>
											{msg.sender === 'vendor' && (
												<Avatar className='h-8 w-8 mr-2 mt-1 flex-shrink-0'>
													<AvatarImage
														src={getActiveVendor().avatar || '/placeholder.svg'}
														alt={getActiveVendor().name}
													/>
													<AvatarFallback>
														{getActiveVendor().name.charAt(0)}
													</AvatarFallback>
												</Avatar>
											)}
											<div
												className={`max-w-[80%] rounded-lg p-3 ${
													msg.sender === 'user'
														? 'bg-primary text-primary-foreground rounded-tr-none'
														: 'bg-muted rounded-tl-none'
												}`}
											>
												<p className='text-sm'>{msg.content}</p>
												<p className='text-xs mt-1 opacity-70 text-right'>
													{formatTime(msg.timestamp)}
												</p>
											</div>
										</div>
									</div>
								);
							})}
						</>
					) : (
						<div className='flex items-center justify-center h-full'>
							<p className='text-muted-foreground'>
								No messages yet. Start a conversation!
							</p>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>
			</ScrollArea>

			<div className='p-3 border-t'>
				<form onSubmit={handleSendMessage} className='flex gap-2'>
					<Button
						type='button'
						variant='ghost'
						size='icon'
						className='flex-shrink-0'
					>
						<Paperclip className='h-5 w-5' />
						<span className='sr-only'>Attach file</span>
					</Button>
					<Input
						placeholder='Type your message...'
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						className='flex-1'
					/>
					<Button
						type='button'
						variant='ghost'
						size='icon'
						className='flex-shrink-0'
					>
						<ImageIcon className='h-5 w-5' />
						<span className='sr-only'>Send image</span>
					</Button>
					<Button
						type='button'
						variant='ghost'
						size='icon'
						className='flex-shrink-0'
					>
						<Smile className='h-5 w-5' />
						<span className='sr-only'>Emoji</span>
					</Button>
					<Button type='submit' size='icon' className='flex-shrink-0'>
						<Send className='h-4 w-4' />
						<span className='sr-only'>Send</span>
					</Button>
				</form>
			</div>
		</Card>
	);

	// Render the vendor info panel
	const renderVendorInfo = () => (
		<Tabs defaultValue='info' className='h-full flex flex-col'>
			<TabsList className='w-full grid grid-cols-2'>
				<TabsTrigger value='info'>Info</TabsTrigger>
				<TabsTrigger value='orders'>Orders</TabsTrigger>
			</TabsList>
			<ScrollArea className='flex-1'>
				<TabsContent value='info' className='p-4 space-y-4 mt-0'>
					<div className='flex flex-col items-center'>
						<Avatar className='h-20 w-20 mb-2'>
							<AvatarImage
								src={getActiveVendor().avatar || '/placeholder.svg'}
								alt={getActiveVendor().name}
							/>
							<AvatarFallback>
								{getActiveVendor().name.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<h3 className='font-medium text-lg'>{getActiveVendor().name}</h3>
						<p className='text-sm text-muted-foreground'>
							{getActiveVendor().company}
						</p>
						<Badge
							variant='outline'
							className={`mt-2 ${
								getActiveVendor().status === 'online'
									? 'text-green-500 border-green-200'
									: getActiveVendor().status === 'away'
									? 'text-yellow-500 border-yellow-200'
									: 'text-gray-500 border-gray-200'
							}`}
						>
							<span
								className={`h-2 w-2 rounded-full mr-1.5 ${
									getActiveVendor().status === 'online'
										? 'bg-green-500'
										: getActiveVendor().status === 'away'
										? 'bg-yellow-500'
										: 'bg-gray-500'
								}`}
							></span>
							<span className='capitalize'>{getActiveVendor().status}</span>
						</Badge>
					</div>

					<div className='space-y-2 mt-4'>
						<h4 className='text-sm font-medium'>Contact Information</h4>
						<div className='text-sm'>
							<p className='flex justify-between py-1'>
								<span className='text-muted-foreground'>Email:</span>
								<span>
									{getActiveVendor().name.toLowerCase().replace(' ', '.')}@
									{getActiveVendor().company.toLowerCase().replace(' ', '')}.com
								</span>
							</p>
							<p className='flex justify-between py-1'>
								<span className='text-muted-foreground'>Phone:</span>
								<span>+41 123 456 789</span>
							</p>
							<p className='flex justify-between py-1'>
								<span className='text-muted-foreground'>Working Hours:</span>
								<span>9AM - 5PM CET</span>
							</p>
						</div>
					</div>

					<div className='space-y-2 mt-4'>
						<h4 className='text-sm font-medium'>About</h4>
						<p className='text-sm text-muted-foreground'>
							{getActiveVendor().company} specializes in high-quality Swiss
							products with a focus on craftsmanship and precision. Our team is
							dedicated to providing exceptional customer service.
						</p>
					</div>

					<div className='space-y-2 mt-4'>
						<h4 className='text-sm font-medium'>Actions</h4>
						<div className='grid grid-cols-2 gap-2'>
							<Button variant='outline' size='sm' className='w-full'>
								<Phone className='h-3.5 w-3.5 mr-1.5' />
								Call
							</Button>
							<Button variant='outline' size='sm' className='w-full'>
								<Video className='h-3.5 w-3.5 mr-1.5' />
								Video
							</Button>
						</div>
					</div>
				</TabsContent>
				<TabsContent value='orders' className='p-4 mt-0'>
					<h4 className='text-sm font-medium mb-2'>
						Your Orders with this Vendor
					</h4>
					<div className='space-y-2'>
						{activeVendor === 'v1' && (
							<>
								<div className='border rounded-md p-2'>
									<p className='text-sm font-medium'>Swiss Automatic Watch</p>
									<p className='text-xs text-muted-foreground'>
										Order #ORD-7893
									</p>
									<div className='flex justify-between mt-1'>
										<span className='text-xs'>$1,299.00</span>
										<span className='text-xs text-blue-500'>In Transit</span>
									</div>
								</div>
							</>
						)}
						{activeVendor === 'v2' && (
							<>
								<div className='border rounded-md p-2'>
									<p className='text-sm font-medium'>Premium Leather Belt</p>
									<p className='text-xs text-muted-foreground'>
										Order #ORD-4321
									</p>
									<div className='flex justify-between mt-1'>
										<span className='text-xs'>$89.00</span>
										<span className='text-xs text-yellow-500'>
											Return Processing
										</span>
									</div>
								</div>
							</>
						)}
						{activeVendor === 'v3' && (
							<>
								<div className='border rounded-md p-2'>
									<p className='text-sm font-medium'>Swiss Army Knife</p>
									<p className='text-xs text-muted-foreground'>
										Order #ORD-3210
									</p>
									<div className='flex justify-between mt-1'>
										<span className='text-xs'>$49.00</span>
										<span className='text-xs text-green-500'>Delivered</span>
									</div>
								</div>
							</>
						)}
						{activeVendor === 'v4' && (
							<>
								<div className='border rounded-md p-2'>
									<p className='text-sm font-medium'>Luxury Fountain Pen</p>
									<p className='text-xs text-muted-foreground'>
										Order #ORD-2109
									</p>
									<div className='flex justify-between mt-1'>
										<span className='text-xs'>$129.00</span>
										<span className='text-xs text-green-500'>Delivered</span>
									</div>
								</div>
							</>
						)}
						{activeVendor === 'v5' && (
							<>
								<div className='border rounded-md p-2'>
									<p className='text-sm font-medium'>Wool Winter Scarf</p>
									<p className='text-xs text-muted-foreground'>
										Order #ORD-1098
									</p>
									<div className='flex justify-between mt-1'>
										<span className='text-xs'>$59.00</span>
										<span className='text-xs text-green-500'>Delivered</span>
									</div>
								</div>
							</>
						)}
						<Button variant='outline' size='sm' className='w-full mt-2'>
							View All Orders
						</Button>
					</div>
				</TabsContent>
			</ScrollArea>
		</Tabs>
	);

	return (
		<div className='grid grid-cols-1 md:grid-cols-4 gap-4 h-[calc(100vh-240px)]'>
			{/* Vendors List Sidebar - Only visible on desktop or when showChatList is true on mobile */}
			<div
				className={`${
					isMobile ? (showChatList ? 'block' : 'hidden') : 'block'
				} md:col-span-1`}
			>
				{renderChatList()}
			</div>

			{/* Chat Area - Only visible on desktop or when showChatList is false on mobile */}
			<div
				className={`${
					isMobile ? (showChatList ? 'hidden' : 'block') : 'block'
				} md:col-span-2`}
			>
				{renderChatArea()}
			</div>

			{/* Vendor Info Panel - Only visible on desktop */}
			<div className='hidden md:block md:col-span-1'>
				<Card className='h-full'>{renderVendorInfo()}</Card>
			</div>
		</div>
	);
}

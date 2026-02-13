'use client';

import type React from 'react';

import {
	SidebarProvider,
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarFooter,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupContent,
	SidebarInset,
	SidebarTrigger,
	useSidebar,
} from '@/components/ui/sidebar';
import {
	Home,
	Package,
	User,
	Settings,
	LogOut,
	Bell,
	HelpCircle,
	MessageSquare,
	TicketIcon,
	X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from '../providers/session-provider';
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@radix-ui/react-separator';

interface DashboardShellProps {
	children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
	return (
		<SidebarProvider>
			<DashboardContent>{children}</DashboardContent>
		</SidebarProvider>
	);
}

function DashboardContent({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const { toggleSidebar, isMobile } = useSidebar();

	const handleLogout = async () => {
		try {
			await fetch('/api/auth/logout', {
				method: 'POST',
				credentials: 'include', // if cookies are used
			});

			// Redirect or clear state
			router.push('/');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	const menuItems = [
		{ icon: Home, label: 'Dashboard', href: '/user' },
		{ icon: Package, label: 'My Orders', href: '/user/orders' },
		{ icon: MessageSquare, label: 'Chat with Vendor', href: '/user/chat' },
		// { icon: TicketIcon, label: 'Support Tickets', href: '/user/support' },
		{ icon: User, label: 'Profile', href: '/user/profile' },
		// { icon: Settings, label: 'Settings', href: '/user/settings' },
		// { icon: HelpCircle, label: 'Help', href: '/user/help' },
	];
	const { data: session, status } = useSession();

	return (
		<div className='flex min-h-screen w-full bg-background'>
			<Sidebar variant='inset' collapsible='offcanvas'>
				<SidebarHeader>
					<div className='flex items-center justify-between w-full px-2 py-3'>
						<div className='flex items-center gap-2 overflow-hidden '>
							<div className='flex-shrink-0 w-8 h-8 rounded-md bg-green-600 text-white flex items-center justify-center'>
								<Image
									src='/images/logo-transparent.png'
									alt='Amader Krishok Logo'
									className='w-5 h-5'
									width={20}
									height={20}
									priority
								/>
							</div>
							<Link href='/'>
								<div className='truncate '>
									<h3 className='text-sm font-medium leading-none'>
										আমাদের কৃষক
									</h3>
									<p className='text-xs text-muted-foreground'>
										Amader Krishok
									</p>
								</div>
							</Link>
						</div>

						{isMobile && (
							<button
								onClick={toggleSidebar}
								className='p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md'
								aria-label='Close sidebar'
							>
								<X size={18} />
							</button>
						)}
					</div>
				</SidebarHeader>
				<Separator />
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Menu</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{menuItems.map((item) => (
									<SidebarMenuItem key={item.label}>
										<SidebarMenuButton
											asChild
											isActive={pathname === item.href}
											tooltip={item.label}
										>
											<Link href={item.href}>
												<item.icon className='h-4 w-4' />
												<span>{item.label}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter className='border-t p-4'>
					{status === 'loading' ? (
						// Show skeleton loader while session is loading
						<div className='flex items-center gap-2 animate-pulse'>
							<div className='h-8 w-8 rounded-full bg-muted'></div>
							<div className='flex-1'>
								<div className='h-4 w-24 bg-muted rounded'></div>
								<div className='h-3 w-32 bg-muted rounded mt-1'></div>
							</div>
							<div className='h-8 w-8 rounded bg-muted ml-auto'></div>
						</div>
					) : (
						// Show actual content once session is loaded
						<div className='flex items-center gap-2'>
							<Avatar className='h-8 w-8'>
								<AvatarImage
									src={session?.user?.image || ''}
									alt={session?.user?.name || 'User'}
								/>
								<AvatarFallback>
									{session?.user?.name
										? session.user.name.charAt(0).toUpperCase()
										: 'U'}
								</AvatarFallback>
							</Avatar>
							<div className='flex flex-col'>
								<span className='text-sm font-medium'>
									{session?.user?.name || 'User'}
								</span>
							</div>
							<Button
								onClick={handleLogout}
								variant='ghost'
								size='icon'
								className='ml-auto'
							>
								<LogOut className='h-4 w-4' />
								<span className='sr-only'>Log out</span>
							</Button>
						</div>
					)}
				</SidebarFooter>
			</Sidebar>
			<SidebarInset className='h-screen overflow-hidden'>
				<div className='flex flex-col h-full'>
					{/* Fixed header */}
					<header className='sticky top-0 z-10 bg-background p-6 flex items-center gap-2 border-b'>
						<SidebarTrigger className='md:hidden mr-2' />
						<Button variant='outline' size='icon' className='ml-auto'>
							<Bell className='h-4 w-4' />
							<span className='sr-only'>Notifications</span>
						</Button>
					</header>

					{/* Scrollable content area */}
					<div className='flex-1 overflow-auto p-8'>{children}</div>
				</div>
			</SidebarInset>
		</div>
	);
}

'use client';

import * as React from 'react';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
	useSidebar,
} from '@/components/ui/sidebar';

import { useSession } from '@/components/providers/session-provider';
import { getNavigationByRole } from '@/config/dashboard-navigation';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { toggleSidebar, isMobile } = useSidebar();
	const { data: session, status } = useSession();
	const userRole = session?.user?.role || 'user';

	// Get the appropriate navigation items based on user role
	const navigationItems = React.useMemo(() => {
		return getNavigationByRole(userRole);
	}, [userRole]);

	// If still loading session, you might want to show a skeleton sidebar
	if (status === 'loading') {
		return <SidebarSkeleton />;
	}

	return (
		<Sidebar collapsible='icon' {...props}>
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
								<p className='text-xs text-muted-foreground'>Amader Krishok</p>
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
				<NavMain items={navigationItems} />
			</SidebarContent>
			<Separator />
			<SidebarFooter>
				{status !== 'authenticated' ? (
					<div className='px-3 py-2 animate-pulse'>
						<div className='flex items-center gap-2'>
							<div className='h-8 w-8 rounded-full bg-muted'></div>
							<div className='flex-1'>
								<div className='h-4 w-24 bg-muted rounded'></div>
								<div className='h-3 w-32 bg-muted rounded mt-1'></div>
							</div>
						</div>
					</div>
				) : session?.user ? (
					<NavUser
						user={{
							name: session.user.name || 'Unknown',
							email: session.user.phoneNumber || '',
							image: session.user.image || '/avatars/default.png',
							role: session.user.role || 'user',
						}}
					/>
				) : (
					<div className='px-3 py-2 text-sm text-muted-foreground'>
						Not signed in
					</div>
				)}
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}

// Simple skeleton for loading state
function SidebarSkeleton() {
	return (
		<div className='w-64 bg-muted/20 h-screen animate-pulse'>
			<div className='h-14 border-b border-muted/30 px-4 py-3'>
				<div className='h-full bg-muted rounded-md'></div>
			</div>
			<div className='p-4 space-y-3'>
				{Array(6)
					.fill(0)
					.map((_, i) => (
						<div key={i} className='h-8 bg-muted rounded-md'></div>
					))}
			</div>
			<div className='absolute bottom-0 w-full p-4 border-t border-muted/30'>
				<div className='flex items-center gap-2'>
					<div className='h-9 w-9 rounded-full bg-muted'></div>
					<div className='flex-1'>
						<div className='h-4 w-24 bg-muted rounded'></div>
						<div className='h-3 w-32 bg-muted rounded mt-1'></div>
					</div>
				</div>
			</div>
		</div>
	);
}

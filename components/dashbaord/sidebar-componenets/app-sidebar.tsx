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
import Image from 'next/image';
import Link from 'next/link';
import { X, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { toggleSidebar, isMobile } = useSidebar();
	const { user, isLoading } = useSession();
	const userRole = user?.role || 'user';

	const navigationItems = React.useMemo(() => {
		return getNavigationByRole(userRole);
	}, [userRole]);

	const handleLogout = async () => {
		try {
			await fetch('/api/auth/logout', {
				method: 'POST',
				credentials: 'include',
			});
			window.location.href = '/';
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	if (isLoading) {
		return <SidebarSkeleton />;
	}

	return (
		<Sidebar collapsible='icon' className='w-64 border-r-0 bg-[#26351B] text-white' {...props}>
			{/* BRAND HEADER */}
			<SidebarHeader className='bg-[#26351B] px-4 py-4 border-b border-[#354126]'>
				<div className='flex items-center justify-between w-full'>
					<Link href='/' className='flex items-center gap-3 overflow-hidden group'>
						<div className='flex-shrink-0 w-9 h-9 rounded-xl bg-[#F5B800]/20 flex items-center justify-center p-1 border border-[#F5B800]/40'>
							<Image
								src='/images/logo-transparent.png'
								alt='Amader Krishok Logo'
								width={36}
								height={36}
								className='w-full h-full object-contain transition-transform duration-300 group-hover:scale-105'
								priority
							/>
						</div>
						<div className='flex flex-col min-w-0'>
							<span className='text-[15px] font-extrabold text-white tracking-tight leading-tight group-hover:text-[#F5B800] transition-colors'>
								Amader Krishok
							</span>
							<span className='text-[11px] font-bold text-[#F5B800] tracking-wide leading-none mt-0.5'>
								কৃষকের বাজার
							</span>
						</div>
					</Link>

					{isMobile && (
						<button
							onClick={toggleSidebar}
							className='p-1.5 hover:bg-white/10 rounded-xl text-white/80 transition-colors ml-auto'
							aria-label='Close sidebar'
						>
							<X size={18} />
						</button>
					)}
				</div>
			</SidebarHeader>

			<SidebarContent className='bg-[#26351B] px-3 py-2'>
				<NavMain items={navigationItems} />
			</SidebarContent>

			{/* VENDOR PROFILE FOOTER (Single Clean Card) */}
			<SidebarFooter className='bg-[#26351B] border-t border-[#354126] p-3.5 mt-auto'>
				<div className='flex items-center gap-2.5 bg-[#1F2A16] p-3 rounded-2xl border border-white/10 shadow-xs'>
					<div className='relative flex-shrink-0'>
						<Avatar className='h-9 w-9 border-2 border-[#F5B800] shadow-xs'>
							<AvatarImage
								src={user?.image || ''}
								alt={user?.name || 'Vendor'}
							/>
							<AvatarFallback className='bg-[#F5B800] text-[#172033] font-black text-xs'>
								{user?.name ? user.name.charAt(0).toUpperCase() : 'V'}
							</AvatarFallback>
						</Avatar>
						<span className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#1F2A16]' />
					</div>

					<div className='flex flex-col min-w-0 flex-1'>
						<span className='text-xs font-extrabold text-white truncate'>
							{user?.name || 'Test Vendor'}
						</span>
						<span className='text-[10px] font-semibold text-[#F5B800] flex items-center gap-1 truncate'>
							<span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse' />
							{user?.phoneNumber || 'Vendor / বিক্রেতা'}
						</span>
					</div>

					<button
						onClick={handleLogout}
						className='p-2 hover:bg-red-500/20 text-red-300 hover:text-red-100 rounded-xl transition-colors flex-shrink-0 cursor-pointer'
						title='লগআউট করুন'
					>
						<LogOut className='w-4 h-4' />
					</button>
				</div>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}

function SidebarSkeleton() {
	return (
		<div className='w-60 bg-[#26351B] h-screen animate-pulse p-4 space-y-4'>
			<div className='h-12 bg-white/10 rounded-xl'></div>
			<div className='space-y-3 pt-4'>
				{[1, 2, 3, 4, 5].map((i) => (
					<div key={i} className='h-9 bg-white/10 rounded-xl'></div>
				))}
			</div>
		</div>
	);
}

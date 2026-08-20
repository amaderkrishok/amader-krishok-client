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
	SidebarGroupContent,
	SidebarInset,
	SidebarTrigger,
	useSidebar,
} from '@/components/ui/sidebar';
import {
	Home,
	Package,
	User,
	LogOut,
	Bell,
	MessageSquare,
	X,
	Bookmark,
	ShoppingCart,
	Sprout,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from '../providers/session-provider';
import { useCart } from '@/context/cart-context';
import Link from 'next/link';

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
	const { data: session, status } = useSession();
	const { toggleCart, itemCount } = useCart();

	const handleLogout = async () => {
		try {
			await fetch('/api/auth/logout', {
				method: 'POST',
				credentials: 'include',
			});
			router.push('/');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	const menuItems = [
		{ icon: Home, label: 'Dashboard', href: '/user' },
		{ icon: Package, label: 'আমার অর্ডার', href: '/user/orders' },
		{ icon: Bookmark, label: 'সংরক্ষিত পণ্য', href: '/user/saved-products' },
		{ icon: MessageSquare, label: 'বিক্রেতার সাথে চ্যাট', href: '/user/chat' },
		{ icon: User, label: 'আমার প্রোফাইল', href: '/user/profile' },
	];

	return (
		<div className='flex min-h-screen w-full bg-[#F7F6F0] selection:bg-[#F4B400] selection:text-[#172033]'>
			{/* BRANDED DARK OLIVE SIDEBAR */}
			<Sidebar className='border-r-0 bg-[#28321A] text-white'>
				<SidebarHeader className='bg-[#28321A] px-4 py-5 border-b border-[#343D20]'>
					<div className='flex items-center justify-between w-full'>
						<Link href='/' className='flex items-center gap-3 overflow-hidden group'>
							<div className='flex-shrink-0 w-10 h-10 rounded-xl bg-[#F4B400] text-[#172033] flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform'>
								<Sprout className='w-6 h-6 text-[#172033]' />
							</div>
							<div className='truncate'>
								<h3 className='text-base font-extrabold tracking-tight text-white leading-tight'>
									আমাদের কৃষক
								</h3>
								<p className='text-[11px] text-[#F4B400] font-semibold tracking-wider uppercase'>
									Amader Krishok
								</p>
							</div>
						</Link>

						{isMobile && (
							<button
								onClick={toggleSidebar}
								className='p-1.5 hover:bg-white/10 rounded-xl text-white/80 transition-colors'
								aria-label='Close sidebar'
							>
								<X size={18} />
							</button>
						)}
					</div>
				</SidebarHeader>

				<SidebarContent className='bg-[#28321A] px-3 py-4'>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarMenu className='space-y-1.5'>
								{menuItems.map((item) => {
									const isActive =
										pathname === item.href ||
										(item.href !== '/user' && pathname.startsWith(item.href));

									return (
										<SidebarMenuItem key={item.label}>
											<SidebarMenuButton
												asChild
												isActive={isActive}
												tooltip={item.label}
												className={`w-full px-3.5 py-3 rounded-xl transition-all duration-200 ${
													isActive
														? 'bg-[#F4B400] text-[#172033] font-extrabold shadow-md hover:bg-[#E5A700]'
														: 'text-white/85 hover:text-white hover:bg-white/10 font-medium'
												}`}
											>
												<Link href={item.href} className='flex items-center gap-3 w-full'>
													<item.icon className={`h-4.5 w-4.5 ${isActive ? 'text-[#172033]' : 'text-[#F4B400]'}`} />
													<span className='text-sm'>{item.label}</span>
													{isActive && (
														<span className='ml-auto w-2 h-2 rounded-full bg-[#172033]' />
													)}
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>

				{/* USER PROFILE MINI CARD AT FOOTER */}
				<SidebarFooter className='bg-[#28321A] border-t border-[#343D20] p-4'>
					{status === 'loading' ? (
						<div className='flex items-center gap-3 animate-pulse'>
							<div className='h-10 w-10 rounded-full bg-white/10'></div>
							<div className='flex-1 space-y-1'>
								<div className='h-3.5 w-24 bg-white/10 rounded'></div>
								<div className='h-3 w-16 bg-white/10 rounded'></div>
							</div>
						</div>
					) : (
						<div className='flex flex-col gap-2.5 bg-[#343D20] p-3 rounded-2xl border border-white/10 shadow-sm'>
							<div className='flex items-center gap-3'>
								<Avatar className='h-10 w-10 border-2 border-[#F4B400] shadow-sm flex-shrink-0'>
									<AvatarImage
										src={session?.user?.image || ''}
										alt={session?.user?.name || 'User'}
									/>
									<AvatarFallback className='bg-[#F4B400] text-[#172033] font-bold'>
										{session?.user?.name
											? session.user.name.charAt(0).toUpperCase()
											: 'U'}
									</AvatarFallback>
								</Avatar>
								<div className='flex flex-col min-w-0 flex-1'>
									<span className='text-xs font-extrabold text-white truncate'>
										{session?.user?.name || 'Test User Mahi'}
									</span>
									<span className='text-[10px] font-semibold text-[#F4B400] tracking-wide'>
										Customer / গ্রাহক
									</span>
								</div>
							</div>

							<button
								onClick={handleLogout}
								className='w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white border border-red-500/30 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98'
								title='লগআউট করুন'
							>
								<LogOut className='h-3.5 w-3.5 text-red-300' />
								<span>লগআউট</span>
							</button>
						</div>
					)}
				</SidebarFooter>
			</Sidebar>

			{/* MAIN INSET CONTENT WITH TOP HEADER */}
			<SidebarInset className='flex-1 bg-[#F7F6F0] h-screen overflow-y-auto overflow-x-hidden'>
				<div className='flex flex-col min-h-screen w-full'>
					{/* TOP HEADER */}
					<header className='sticky top-0 z-30 bg-white/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-[#E5E7EB] shadow-xs'>
						<div className='flex items-center gap-3'>
							<SidebarTrigger className='text-[#172033] hover:bg-gray-100 rounded-xl p-2' />
						</div>

						<div className='flex items-center gap-3'>
							{/* Cart Icon Button */}
							<button
								onClick={toggleCart}
								className='relative p-2.5 rounded-xl bg-gray-50 hover:bg-[#FFF9E8] border border-[#E5E7EB] hover:border-[#F4B400]/40 text-[#172033] transition-all hover:scale-105'
								title='কার্ট দেখুন'
							>
								<ShoppingCart className='h-5 w-5 text-[#28321A]' />
								{itemCount > 0 && (
									<span className='absolute -top-1.5 -right-1.5 bg-[#F4B400] text-[#172033] text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-xs'>
										{itemCount}
									</span>
								)}
							</button>

							{/* Notification Icon */}
							<button
								className='p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-[#E5E7EB] text-[#172033] transition-all hover:scale-105'
								title='নোটিফিকেশন'
							>
								<Bell className='h-5 w-5 text-gray-600' />
							</button>

							{/* User Avatar */}
							<div className='h-9 w-9 rounded-xl overflow-hidden border border-[#E5E7EB] bg-[#FFF9E8] flex items-center justify-center font-bold text-sm text-[#28321A] ml-1 shadow-xs'>
								<Avatar className='h-full w-full'>
									<AvatarImage src={session?.user?.image || ''} />
									<AvatarFallback className='bg-[#FFF9E8] text-[#28321A] font-bold'>
										{session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
									</AvatarFallback>
								</Avatar>
							</div>
						</div>
					</header>

					{/* SCROLLABLE MAIN CONTENT */}
					<main className='flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8'>
						{children}
					</main>
				</div>
			</SidebarInset>
		</div>
	);
}

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { User, LogIn, UserCircle, LayoutDashboard, LogOut, ShoppingCart } from 'lucide-react';

import { getRedirectPathByRole } from '@/routes';
import { useSession } from '../providers/session-provider';
import { useCart } from '@/context/cart-context';

const menuItems: { href: string; label: string }[] = [
	{ href: '/', label: 'হোম' },
	{ href: '/marketplace', label: 'কৃষকের বাজার' },
	{ href: '/crop-cultivation', label: 'ফসল চাষ প্রক্রিয়া' },
	{ href: '/crop-calculator', label: 'সার ক্যালকুলেটর' },
	{ href: '/weather', label: 'আবহাওয়া আপডেট' },
	{ href: '/post', label: 'পোস্ট' },
	{ href: '/about', label: 'এবাউট' },
];

export function NavBar({ navClassName = '' }: { navClassName?: string }) {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const { user, isAuthenticated, logout } = useSession();
	const { toggleCart, itemCount } = useCart();
	const router = useRouter();

	const [showUserMenu, setShowUserMenu] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		setIsOpen(false);
	}, [pathname]);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 20) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		handleScroll();
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Determine dashboard redirect path based on user role
	const dashboardPath = user ? getRedirectPathByRole(user.role) : '/auth/login';

	const isHomePage = pathname === '/';
	const isTransparent = isHomePage;

	return (
		<nav
			className={`w-full px-4 sm:px-6 lg:px-8 xl:px-12 fixed top-0 left-0 z-50 transition-all duration-300 h-[72px] flex items-center ${
				isTransparent
					? 'bg-[rgba(38,53,27,0.85)] backdrop-blur-md border-b border-white/10 text-white shadow-lg'
					: 'bg-[#26351B] backdrop-blur-md border-b border-white/10 shadow-md text-white'
			} ${navClassName}`}
		>
			<div className='max-w-7xl mx-auto w-full flex items-center justify-between gap-4'>
				{/* Logo */}
				<Link href='/' className='flex items-center space-x-2 flex-shrink-0'>
					<Image
						src='/images/logo-transparent.png'
						width={130}
						height={60}
						alt='Amader Krishok Logo'
						className='transition-transform duration-300 hover:scale-105 w-[100px] sm:w-[120px] lg:w-[130px] h-auto object-contain'
						priority
					/>
				</Link>

				{/* Desktop & Laptop Navigation Container (lg: 1024px+) */}
				<div className='hidden lg:flex items-center gap-2 xl:gap-3 2xl:gap-5 flex-shrink-0'>
					{/* Navigation Items */}
					<div className='flex items-center space-x-1'>
						{menuItems.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									className={`
                    px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold whitespace-nowrap
                    transition-all duration-200
                    ${
											isTransparent
												? isActive
													? 'bg-white/13 text-[#F5B800] font-bold'
													: 'text-white hover:text-[#F5B800] hover:bg-white/10'
												: isActive
													? 'bg-[#F5F3EA] text-[#3F6212] font-bold'
													: 'text-[#172033] hover:text-[#3F6212] hover:bg-gray-100/80'
										}
                  `}
								>
									{item.label}
								</Link>
							);
						})}
					</div>

					{/* Cart Icon Button */}
					<button
						onClick={toggleCart}
						className={`relative p-2.5 rounded-full transition-all focus:outline-none flex-shrink-0 ${
							isTransparent
								? 'text-white hover:text-[#F5B800] hover:bg-white/10'
								: 'text-[#172033] hover:text-[#3F6212] hover:bg-gray-100'
						}`}
						aria-label='কার্ট দেখুন'
					>
						<ShoppingCart className='h-5 w-5 xl:h-5 xl:w-5' />
						{itemCount > 0 && (
							<span
								className={`absolute -top-1 -right-1 text-white text-[10px] xl:text-[11px] font-black rounded-full h-4 w-4 xl:h-5 xl:w-5 flex items-center justify-center border-2 ${
									isTransparent
										? 'bg-[#F5B800] text-[#26351B] border-[#1B2813]'
										: 'bg-rose-500 text-white border-white'
								}`}
							>
								{itemCount}
							</span>
						)}
					</button>

					{/* Auth Button */}
					<Button
						asChild
						className={`text-xs xl:text-sm h-10 px-5 rounded-xl font-bold transition-all shadow-sm flex-shrink-0 border-none ${
							isTransparent
								? 'bg-[#F5B800] text-[#26351B] hover:bg-[#e0a800]'
								: 'bg-[#26351B] text-white hover:bg-[#1B2813]'
						}`}
					>
						<Link href={dashboardPath} className='flex items-center gap-2 whitespace-nowrap'>
							{isAuthenticated ? (
								<>
									<User size={16} />
									<span>ড্যাশবোর্ড</span>
								</>
							) : (
								<>
									<LogIn size={16} />
									<span>লগইন</span>
								</>
							)}
						</Link>
					</Button>

					{/* Logout button - only shown when authenticated */}
					{isAuthenticated && (
						<Button
							variant='destructive'
							size='sm'
							className='bg-red-600 hover:bg-red-700 text-white text-xs xl:text-sm h-9 xl:h-10 px-3 rounded-xl font-bold flex-shrink-0'
							onClick={async () => {
								router.push('/');
								setTimeout(async () => {
									await logout();
									console.log('Logout completed after navigation');
								}, 100);
							}}
						>
							<LogOut size={16} className='mr-1' />
							<span>লগআউট</span>
						</Button>
					)}
				</div>

				{/* Mobile & Tablet Actions (< lg: 1024px) */}
				<div className='flex items-center gap-3 sm:gap-4 lg:hidden'>
					{/* Mobile/Tablet Cart Icon Button */}
					<button
						onClick={toggleCart}
						className={`relative p-1.5 focus:outline-none rounded-full transition-colors ${
							isTransparent ? 'text-white hover:bg-white/10' : 'text-[#172033] hover:bg-gray-100'
						}`}
						aria-label='কার্ট দেখুন'
					>
						<ShoppingCart className='h-5 w-5 sm:h-6 sm:w-6' />
						{itemCount > 0 && (
							<span
								className={`absolute -top-1 -right-1 text-white text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center border ${
									isTransparent
										? 'bg-[#F5B800] text-[#172033] border-[#1B2813]'
										: 'bg-rose-500 text-white border-white'
								}`}
							>
								{itemCount}
							</span>
						)}
					</button>

					{/* User Icon with Dropdown (only when authenticated) */}
					{isAuthenticated && (
						<div className='relative'>
							<button
								className={`p-1 focus:outline-none rounded-full transition-colors ${
									isTransparent ? 'text-white hover:bg-white/10' : 'text-[#172033] hover:bg-gray-100'
								}`}
								onClick={() => setShowUserMenu(!showUserMenu)}
							>
								<User size={22} className='sm:w-6 sm:h-6' />
							</button>

							{/* User dropdown menu */}
							<AnimatePresence>
								{showUserMenu && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.2 }}
										className='absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 border border-gray-100 z-50 text-[#172033]'
									>
										<Link
											href='/account'
											className='flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50'
											onClick={() => setShowUserMenu(false)}
										>
											<UserCircle size={16} className='text-[#26351B]' />
											<span>প্রোফাইল</span>
										</Link>
										<Link
											href={dashboardPath}
											className='flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50'
											onClick={() => setShowUserMenu(false)}
										>
											<LayoutDashboard size={16} className='text-[#26351B]' />
											<span>ড্যাশবোর্ড</span>
										</Link>
										<button
											onClick={async () => {
												setShowUserMenu(false);
												router.push('/');
												setTimeout(async () => {
													await logout();
													console.log('Logout completed after navigation');
												}, 100);
											}}
											className='flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-50'
										>
											<LogOut size={16} />
											<span>লগআউট</span>
										</button>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					)}

					{/* Hamburger Menu Icon */}
					<button
						className={`p-1.5 focus:outline-none rounded-xl transition-colors ${
							isTransparent ? 'text-white hover:bg-white/10' : 'text-[#172033] hover:bg-gray-100'
						}`}
						onClick={() => setIsOpen(!isOpen)}
						aria-label='Toggle menu'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={2}
							stroke='currentColor'
							className='w-6 h-6'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
							/>
						</svg>
					</button>
				</div>
			</div>

			{/* Mobile & Tablet Drawer Menu (< lg) */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
						className={`lg:hidden absolute top-full left-0 right-0 shadow-2xl overflow-hidden ${
							isTransparent
								? 'bg-[#1B2813] border-t border-white/10 text-white'
								: 'bg-white border-t border-gray-200 text-[#172033]'
						}`}
					>
						<div className='px-4 sm:px-6 py-4 space-y-1.5 max-h-[80vh] overflow-y-auto'>
							{menuItems.map((item) => {
								const isActive = pathname === item.href;
								return (
									<Link
										key={item.href}
										href={item.href}
										className={`
                      block px-4 py-2.5 rounded-xl text-sm font-bold transition-colors duration-200
                      ${
												isTransparent
													? isActive
														? 'bg-white/20 text-[#F5B800]'
														: 'text-white hover:bg-white/10'
													: isActive
														? 'bg-[#F5F3EA] text-[#3F6212]'
														: 'text-[#172033] hover:bg-gray-100'
											}
                    `}
										onClick={() => setIsOpen(false)}
									>
										{item.label}
									</Link>
								);
							})}

							{/* Auth Button - Mobile/Tablet Drawer */}
							<div className={`pt-3 border-t mt-2 ${isTransparent ? 'border-white/10' : 'border-gray-200'}`}>
								<Link
									href={dashboardPath}
									className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
										isTransparent
											? 'bg-[#F5B800] text-[#172033] hover:bg-[#e0a800]'
											: 'bg-[#26351B] text-white hover:bg-[#1B2813]'
									}`}
									onClick={() => setIsOpen(false)}
								>
									{isAuthenticated ? (
										<>
											<User size={18} />
											<span>ড্যাশবোর্ড</span>
										</>
									) : (
										<>
											<LogIn size={18} />
											<span>লগইন করুন</span>
										</>
									)}
								</Link>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
}

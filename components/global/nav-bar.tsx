'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { User, LogIn, UserCircle, LayoutDashboard, LogOut } from 'lucide-react';

import { getRedirectPathByRole } from '@/routes';
import { useSession } from '../providers/session-provider';

const menuItems: { href: string; label: string }[] = [
	{ href: '/', label: 'হোম' },
	{ href: '/about', label: 'এবাউট' },
	{ href: '/crop-cultivation', label: 'ফসল চাষ প্রক্রিয়া' },
	{ href: '/crop-calculator', label: 'সার ক্যালকুলেটর' },
	{ href: '/weather', label: 'আবহাওয়া আপডেট' },
	{ href: '/post', label: 'পোস্ট' },
	{ href: '/marketplace', label: 'কৃষকের বাজার' },
];

export function NavBar() {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const { user, isAuthenticated, logout } = useSession();
	const router = useRouter();

	const [showUserMenu, setShowUserMenu] = useState(false);

	useEffect(() => {
		setIsOpen(false);
	}, [pathname]);

	// Determine dashboard redirect path based on user role
	const dashboardPath = user ? getRedirectPathByRole(user.role) : '/auth/login';

	return (
		<nav className='w-full px-6 py-4 bg-[#064E3B] fixed top-0 left-0 z-50 shadow-lg border-b border-white/20'>
			<div className='max-w-7xl mx-auto flex items-center justify-between'>
				{/* Logo */}
				<Link href='/' className='flex items-center space-x-2'>
					<Image
						src='/images/logo-transparent.png'
						width={130}
						height={60}
						alt='Logo'
						className='transition-transform duration-300 hover:scale-105'
					/>
				</Link>

				{/* Right side container for navigation and auth button */}
				<div className='hidden md:flex items-center gap-6'>
					{/* Navigation Items (moved to right) */}
					<div className='flex items-center space-x-1'>
						{menuItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`
                text-white px-3 py-2 rounded-md text-base font-medium
                transition-colors duration-200
                ${
									pathname === item.href
										? 'bg-white/10 font-bold'
										: 'hover:bg-white/5'
								}
              `}
							>
								{item.label}
							</Link>
						))}
					</div>

					{/* Auth Button */}
					<Button
						asChild
						variant='outline'
						className='bg-white/10 hover:bg-white/20 text-white border-white/20 hover:text-white'
					>
						<Link href={dashboardPath} className='flex items-center gap-2'>
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
							className='bg-red-600/80 hover:bg-red-700 text-white'
							onClick={async () => {
								// First, navigate to home page to avoid race conditions
								router.push('/');

								// Then perform logout after a small delay
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

				{/* Mobile Actions */}
				<div className='flex items-center gap-4 md:hidden'>
					{/* User Icon with Dropdown (only when authenticated) */}
					{isAuthenticated && (
						<div className='relative'>
							<button
								className='text-white focus:outline-none'
								onClick={() => setShowUserMenu(!showUserMenu)}
							>
								<User size={24} />
							</button>

							{/* User dropdown menu */}
							<AnimatePresence>
								{showUserMenu && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.2 }}
										className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50'
									>
										<Link
											href='/account'
											className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
											onClick={() => setShowUserMenu(false)}
										>
											<UserCircle size={16} />
											<span>প্রোফাইল</span>
										</Link>
										<Link
											href={dashboardPath}
											className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
											onClick={() => setShowUserMenu(false)}
										>
											<LayoutDashboard size={16} />
											<span>ড্যাশবোর্ড</span>
										</Link>
										<button
											onClick={async () => {
												setShowUserMenu(false);

												// First, navigate to home page to avoid race conditions
												router.push('/');

												// Then perform logout after a small delay
												setTimeout(async () => {
													await logout();
													console.log('Logout completed after navigation');
												}, 100);
											}}
											className='flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
										>
											<LogOut size={16} />
											<span>লগআউট</span>
										</button>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					)}

					{/* Hamburger Icon */}
					<button
						className='text-white focus:outline-none'
						onClick={() => setIsOpen(!isOpen)}
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

			{/* Mobile Menu */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
						className='md:hidden absolute top-full left-0 right-0 bg-[#064E3B] border-t border-white/10 shadow-lg'
					>
						<div className='px-4 py-2 space-y-2'>
							{menuItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className={`
                    block px-3 py-2 rounded-md text-base font-medium text-white
                    transition-colors duration-200
                    ${
											pathname === item.href
												? 'bg-white/10 font-bold'
												: 'hover:bg-white/5'
										}
                  `}
									onClick={() => setIsOpen(false)}
								>
									{item.label}
								</Link>
							))}
							{/* Auth Button - Mobile  */}
							<Link
								href={dashboardPath}
								className={`
     px-3 py-2 rounded-md text-base font-medium text-white
    bg-white/10 hover:bg-white/20 mt-4 flex items-center gap-2
  `}
								onClick={() => setIsOpen(false)}
							>
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
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
}

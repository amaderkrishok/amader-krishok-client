'use client';

import { useState } from 'react';
import { useSession } from '@/components/providers/session-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfileForm } from '@/components/ui/user/user-profile-form';
import { PasswordForm } from '@/components/ui/user/user-password-chnage-form';
import { User, Lock, Phone, ShieldCheck, CheckCircle2, UserCheck, ShieldAlert } from 'lucide-react';

export default function ProfilePage() {
	const { data: session } = useSession();
	const [activeTab, setActiveTab] = useState<string>('profile');

	const userInitials = session?.user?.name
		? session.user.name
				.split(' ')
				.map((n) => n[0])
				.join('')
				.toUpperCase()
		: 'U';

	return (
		<div className='space-y-6 pb-8'>
			{/* 2. PROFILE PAGE HEADER */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-[#FFF9E8] to-white p-6 sm:p-7 rounded-2xl border border-[#E5E7EB] shadow-xs'>
				<div className='space-y-1'>
					<h1 className='text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2'>
						🌱 প্রোফাইল সেটিংস
					</h1>
					<p className='text-sm text-[#64748B] font-medium'>
						আপনার ব্যক্তিগত তথ্য, অ্যাকাউন্ট এবং নিরাপত্তা সেটিংস পরিচালনা করুন।
					</p>
				</div>

				{/* Profile Status Indicator */}
				<div className='inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs'>
					<span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
					● অ্যাকাউন্ট সক্রিয়
				</div>
			</div>

			{/* 3. PROFILE OVERVIEW SECTION */}
			<div className='bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
				<div className='flex items-center gap-4'>
					<Avatar className='h-16 w-16 border-2 border-[#F4B400] shadow-xs'>
						<AvatarImage src={session?.user?.image || ''} />
						<AvatarFallback className='bg-[#F4B400] text-[#172033] font-black text-xl'>
							{userInitials}
						</AvatarFallback>
					</Avatar>
					<div className='space-y-1 min-w-0'>
						<div className='flex items-center gap-2'>
							<h2 className='text-lg font-extrabold text-[#111827] truncate'>
								{session?.user?.name || 'Test User Mahi'}
							</h2>
							<span className='bg-[#FFF9E8] text-[#28321A] text-[11px] font-extrabold px-2.5 py-0.5 rounded-md border border-[#F4B400]/30'>
								Customer / গ্রাহক
							</span>
						</div>
						<div className='flex flex-wrap items-center gap-3 text-xs text-[#64748B] font-medium'>
							<span className='flex items-center gap-1'>
								<Phone className='w-3.5 h-3.5 text-[#F4B400]' />
								{session?.user?.phoneNumber || '01797576842'}
							</span>
							<span>•</span>
							<span className='text-emerald-700 font-bold flex items-center gap-1'>
								<ShieldCheck className='w-3.5 h-3.5 text-emerald-600' />
								অ্যাকাউন্ট সক্রিয়
							</span>
						</div>
					</div>
				</div>

				<button
					onClick={() => setActiveTab('profile')}
					className='px-4 py-2 bg-[#FFF9E8] hover:bg-[#FFF4CC] text-[#28321A] border border-[#F4B400]/40 rounded-xl text-xs font-bold transition-all shadow-xs'
				>
					✏️ প্রোফাইল সম্পাদনা
				</button>
			</div>

			{/* 4. SETTINGS TABS */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className='w-full space-y-6'>
				<TabsList className='flex items-center gap-2 bg-transparent p-0 h-auto border-b border-transparent'>
					<TabsTrigger
						value='profile'
						className='flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 border cursor-pointer data-[state=active]:bg-[#28321A] data-[state=active]:text-white data-[state=active]:border-[#28321A] data-[state=active]:shadow-xs bg-white text-[#111827] border-[#E5E7EB] hover:bg-[#FFF4CC]'
					>
						<User className='w-4 h-4 text-[#F4B400]' />
						প্রোফাইল তথ্য
					</TabsTrigger>
					<TabsTrigger
						value='password'
						className='flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 border cursor-pointer data-[state=active]:bg-[#28321A] data-[state=active]:text-white data-[state=active]:border-[#28321A] data-[state=active]:shadow-xs bg-white text-[#111827] border-[#E5E7EB] hover:bg-[#FFF4CC]'
					>
						<Lock className='w-4 h-4 text-[#F4B400]' />
						পাসওয়ার্ড ও নিরাপত্তা
					</TabsTrigger>
				</TabsList>

				{/* PROFILE FORM CONTENT */}
				<TabsContent value='profile' className='mt-0 space-y-6'>
					<Card className='p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs'>
						<UserProfileForm />
					</Card>

					{/* 8. ACCOUNT SECURITY CARD */}
					<div className='bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3'>
						<h4 className='text-sm font-extrabold text-[#111827] flex items-center gap-2'>
							🔐 অ্যাকাউন্ট নিরাপত্তা
						</h4>
						<div className='grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold'>
							<div className='flex items-center justify-between p-3 rounded-xl bg-[#FFF9E8] border border-[#F4B400]/20'>
								<span className='text-[#64748B]'>অ্যাকাউন্ট স্ট্যাটাস</span>
								<span className='text-emerald-700 font-bold'>● সক্রিয়</span>
							</div>
							<div className='flex items-center justify-between p-3 rounded-xl bg-[#FFF9E8] border border-[#F4B400]/20'>
								<span className='text-[#64748B]'>ফোন নম্বর</span>
								<span className='text-blue-700 font-bold'>✓ যাচাইকৃত</span>
							</div>
							<div className='flex items-center justify-between p-3 rounded-xl bg-[#FFF9E8] border border-[#F4B400]/20'>
								<span className='text-[#64748B]'>পাসওয়ার্ড</span>
								<span className='text-[#28321A] font-bold'>● নিরাপদ</span>
							</div>
						</div>
					</div>
				</TabsContent>

				{/* PASSWORD FORM CONTENT */}
				<TabsContent value='password' className='mt-0 space-y-6'>
					<Card className='p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs'>
						<PasswordForm />
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}

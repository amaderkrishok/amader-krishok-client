'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WhatsAppSupportProps {
	phoneNumber?: string;
	agentName?: string;
	messageText?: string;
	whatsappMessage?: string;
}

export function WhatsAppSupport({
	phoneNumber = '8801311848915',
	agentName = 'সাপোর্ট প্রতিনিধি',
	messageText = 'স্যার, কিভাবে সহযোগিতা করতে পারি?',
	whatsappMessage = 'আসসালামু আলাইকুম, আমি আমাদের কৃষক ওয়েবসাইট থেকে সহায়তার জন্য যোগাযোগ করছি।',
}: WhatsAppSupportProps) {
	const [showBubble, setShowBubble] = useState(true);
	const [isVisible, setIsVisible] = useState(false);

	// Delay appearance slightly for a nice pop-up effect
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, 1200);
		return () => clearTimeout(timer);
	}, []);

	const handleOpenWhatsApp = () => {
		const encodedMsg = encodeURIComponent(whatsappMessage);
		const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMsg}`;
		window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
	};

	if (!isVisible) return null;

	return (
		<div className='fixed bottom-38 right-6 z-40 flex items-center justify-end font-sans group'>
			<AnimatePresence>
				{/* Speech Bubble Box */}
				{showBubble && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8, x: 20 }}
						animate={{ opacity: 1, scale: 1, x: 0 }}
						exit={{ opacity: 0, scale: 0.8, x: 20 }}
						transition={{ type: 'spring', stiffness: 300, damping: 25 }}
						className='relative mr-3 cursor-pointer'
						onClick={handleOpenWhatsApp}
					>
						<div className='bg-white text-gray-800 p-3.5 sm:p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-gray-100 max-w-[220px] sm:max-w-[250px] relative group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-x-1'>
							{/* Dismiss/Close Button */}
							<button
								onClick={(e) => {
									e.stopPropagation();
									setShowBubble(false);
								}}
								className='absolute -top-2 -left-2 bg-gray-100 hover:bg-red-500 hover:text-white text-gray-600 rounded-full p-1 shadow-md transition-colors border border-gray-200 z-10'
								aria-label='Close message'
								title='বন্ধ করুন'
							>
								<X size={12} />
							</button>

							{/* Message Content */}
							<div className='space-y-1 text-right sm:text-left'>
								<p className='text-xs sm:text-sm font-bold text-gray-900 leading-snug'>
									{messageText}
								</p>
								<div className='flex items-center gap-1 text-[10px] font-bold text-emerald-600 pt-0.5 justify-end sm:justify-start'>
									<MessageCircle size={12} className='text-emerald-500 fill-emerald-500' />
									<span>হোয়াটসঅ্যাপে চ্যাট করুন</span>
								</div>
							</div>

							{/* Right Arrow pointer connecting bubble to avatar */}
							<div className='absolute top-1/2 -right-2.5 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-l-[10px] border-l-white drop-shadow-xs' />
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Avatar Button */}
			<motion.div
				initial={{ scale: 0, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ type: 'spring', stiffness: 260, damping: 20 }}
				onClick={handleOpenWhatsApp}
				className='relative cursor-pointer flex-shrink-0'
			>
				{/* Glowing Pulsing Outer Ring */}
				<span className='absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping opacity-75' />

				{/* Avatar Container */}
				<div className='relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-xl hover:scale-110 transition-transform duration-300 border-2 border-white overflow-hidden'>
					<Image
						src='/images/logo-transparent.png' // Avatar fallback image / agent logo
						alt={agentName}
						width={56}
						height={56}
						className='w-full h-full object-cover rounded-full bg-[#2D331F]'
						onError={(e) => {
							// Fallback to SVG if image fails
							(e.target as HTMLElement).style.display = 'none';
						}}
					/>
					<div className='w-full h-full bg-[#2D331F] rounded-full flex items-center justify-center text-emerald-400'>
						<MessageCircle size={26} className='fill-emerald-400 text-[#2D331F]' />
					</div>

					{/* Green Online Dot */}
					<span className='absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-md' />
				</div>
			</motion.div>
		</div>
	);
}

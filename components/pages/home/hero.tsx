'use client';
import { useState, useEffect } from 'react';

export function Hero() {
	const messages = [
		'আমরা কৃষকদের সবচেয়ে বড় খুচরা চেইনের সাথে সংযুক্ত করি',
		'আমরা কৃষকদের জন্য সর্বোত্তম সুযোগ নিশ্চিত করি',
		'কৃষিক্ষেত্রে উন্নয়ন আনতে আমরা প্রতিশ্রুতিবদ্ধ',
		'টেকসই কৃষির জন্য আমরা কাজ করি',
	];

	const [currentIndex, setCurrentIndex] = useState(0);
	const [fadeIn, setFadeIn] = useState(true);

	useEffect(() => {
		const interval = setInterval(() => {
			setFadeIn(false); // Start fade-out effect
			setTimeout(() => {
				setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
				setFadeIn(true); // Start fade-in effect
			}, 500); // Match with fade-out duration
		}, 4000); // Change message every 4 seconds

		return () => clearInterval(interval);
	}, [messages.length]);

	return (
		<div className='min-h-[60vh] flex flex-col items-center justify-center text-center px-4'>
			<h1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-2'>
				আমাদের কৃষক
			</h1>
			<h1
				className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white transition-opacity duration-500 mt-3 ${
					fadeIn ? 'opacity-100' : 'opacity-0'
				}`}
			>
				{messages[currentIndex]}
			</h1>
		</div>
	);
}

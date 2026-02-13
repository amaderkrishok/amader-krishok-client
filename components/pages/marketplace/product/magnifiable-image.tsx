'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface MagnifiableImageProps {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	fill?: boolean;
	className?: string;
	magnifyScale?: number; // Scale factor for magnification
	sizes?: string;
	priority?: boolean;
	objectFit?: 'cover' | 'contain';
}

export function MagnifiableImage({
	src,
	alt,
	width,
	height,
	fill = false,
	className,
	magnifyScale = 1.5, // Default magnification scale
	sizes,
	priority = false,
	objectFit = 'contain',
}: MagnifiableImageProps) {
	const [magnifying, setMagnifying] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const imageRef = useRef<HTMLDivElement>(null);
	const [isMobile, setIsMobile] = useState(false);
	const [isLoading, setIsLoading] = useState(true);


	// Check if device is touch-enabled on component mount
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);

		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	const handleMouseEnter = () => {
		if (!isMobile) setMagnifying(true);
	};

	const handleMouseLeave = () => {
		setMagnifying(false);
	};

	const handleTouch = (e: React.TouchEvent) => {
		e.preventDefault(); // Prevent scrolling while touching the image

		if (imageRef.current) {
			const touch = e.touches[0];
			const rect = imageRef.current.getBoundingClientRect();

			// Calculate position as percentage
			const x = ((touch.clientX - rect.left) / rect.width) * 100;
			const y = ((touch.clientY - rect.top) / rect.height) * 100;

			setPosition({ x, y });
			setMagnifying(true);

			// Add event handlers for touch end and touch cancel
			document.addEventListener('touchend', handleTouchEnd);
			document.addEventListener('touchcancel', handleTouchEnd);
		}
	};

	const handleTouchEnd = () => {
		setMagnifying(false);
		document.removeEventListener('touchend', handleTouchEnd);
		document.removeEventListener('touchcancel', handleTouchEnd);
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (imageRef.current) {
			const rect = imageRef.current.getBoundingClientRect();

			// Calculate position as percentage
			const x = ((e.clientX - rect.left) / rect.width) * 100;
			const y = ((e.clientY - rect.top) / rect.height) * 100;

			setPosition({ x, y });
		}
	};

	return (
		<div
			ref={imageRef}
			className={cn('relative overflow-hidden group', className)}
			style={{
				width: fill ? '100%' : width,
				height: fill ? '100%' : height,
				cursor: 'zoom-in',
			}}
			onMouseEnter={handleMouseEnter}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			onTouchStart={handleTouch}
		>
			<>
				{/* Base image */}
				{isLoading && (
					<div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
						<div className='w-8 h-8 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin'></div>
					</div>
				)}
				<Image
					src={src || '/placeholder.svg'}
					alt={alt}
					fill={fill}
					width={!fill ? width : undefined}
					height={!fill ? height : undefined}
					className={cn(
						'transition-opacity duration-300',
						magnifying ? 'opacity-30' : 'opacity-100',
						isLoading ? 'opacity-0' : 'opacity-100'
					)}
					sizes={sizes}
					priority={priority}
					style={{ objectFit }}
					onLoad={() => setIsLoading(false)}
				/>
			</>

			{/* Magnified image */}
			{magnifying && (
				<div
					className='absolute inset-0 pointer-events-none z-10'
					style={{
						backgroundImage: `url(${src})`,
						backgroundRepeat: 'no-repeat',
						backgroundPosition: `${position.x}% ${position.y}%`,
						backgroundSize: `${magnifyScale * 100}%`,
					}}
				/>
			)}

			{/* Touch instruction for mobile - only shown on first interaction */}
			{isMobile && (
				<div className='absolute bottom-2 left-0 right-0 text-center text-white text-xs bg-black/50 py-1 rounded z-20 pointer-events-none opacity-80'>
					ছবি বড় করে দেখতে ট্যাপ করুন
				</div>
			)}
		</div>
	);
}

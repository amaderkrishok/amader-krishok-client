'use client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';

interface Slide {
	id: number;
	image: string;
	text: string;
}

interface SliderProps {
	slides: Slide[];
}

export default function Slider({ slides }: SliderProps) {
	const [currentSlide, setCurrentSlide] = useState(0);
	// const [loading, setLoading] = useState(true);

	const nextSlide = useCallback(() => {
		setCurrentSlide((prev) => (prev + 1) % slides.length);
	}, [slides.length]);

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
	};

	useEffect(() => {
		const intervalId = setInterval(() => {
			nextSlide();
		}, 5000);

		return () => clearInterval(intervalId);
	}, [nextSlide]);

	return (
		<div className='h-[87%] w-full overflow-hidden aspect-[16/9]'>
			<div className='relative w-full h-full'>
				{slides.map((slide, index) => (
					<div
						key={slide.id}
						className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
							index === currentSlide ? 'opacity-100' : 'opacity-0'
						}`}
					>
						<Image
							src={slide.image}
							alt={`Slide ${slide.id}`}
							fill
							priority
							className='object-cover'
						/>
					</div>
				))}

				{/* Slide Text & Controls */}
				<div className='absolute  bottom-4 lg:bottom-24 left-12  text-white z-10'>
					<div className='text-4xl font-light mb-8 max-w-md'>
						{slides[currentSlide].text}
					</div>
					<div className='flex items-center space-x-4 '>
						<span className='text-xl'>{currentSlide + 1}</span>
						<div className='w-12 h-px bg-white'></div>
						<span className='text-xl'>{slides.length}</span>
						<div className='ml-4 flex space-x-2'>
							<Button
								variant='outline'
								size='icon'
								className='rounded-full border-white  hover:bg-white'
								onClick={prevSlide}
							>
								<ArrowLeft className='h-4 w-4 text-black' />
							</Button>
							<Button
								variant='outline'
								size='icon'
								className='rounded-full border-white  hover:bg-white'
								onClick={nextSlide}
							>
								<ArrowRight className='h-4 w-4 text-black' />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

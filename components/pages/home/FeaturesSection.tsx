'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Leaf } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const sliderContent = [
	{
		title: 'টেকসই কৃষি উন্নয়নে আপনার নির্ভরযোগ্য অংশীদার',
		description:
			'পরিবেশবান্ধব চর্চা ও আধুনিক প্রযুক্তির মাধ্যমে কৃষিতে বিপ্লব ঘটাচ্ছে।',
		motto: 'সবুজ ভবিষ্যৎ গড়ি',
		image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449',
	},
	{
		title: 'সুনির্দিষ্ট চাষাবাদে সর্বোচ্চ উৎপাদন',
		description:
			'ডেটা-ভিত্তিক বিশ্লেষণ ব্যবহার করে আপনার ফসল উৎপাদন দক্ষতার সাথে বৃদ্ধি করুন।',
		motto: 'বুদ্ধিমত্তার সাথে চাষ',
		image:
			'https://images.unsplash.com/photo-1589923188651-268a9765e432?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
	},
	{
		title: 'নবপ্রবর্তিত সেচ ব্যবস্থা',
		description:
			'জল সংরক্ষণ করুন এবং আমাদের স্মার্ট সেচ পদ্ধতির মাধ্যমে ফসলের স্বাস্থ্যের উন্নতি করুন।',
		motto: 'জল বাঁচান, ফল বাড়ান',
		image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b',
	},
	{
		title: 'জৈব কীটনাশক ব্যবস্থাপনা',
		description: 'পরিবেশবান্ধব পদ্ধতিতে আপনার ফসলকে প্রাকৃতিকভাবে রক্ষা করুন।',
		motto: 'প্রকৃতির ছোঁয়ায় সুরক্ষা',
		image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d',
	},
];



export default function FeaturesSection() {
	const [currentSlide, setCurrentSlide] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderContent.length);
		}, 4000);

		return () => clearInterval(timer);
	}, []);

	return (
		<section className='py-20 px-4 md:px-8 '>
			<div className='max-w-6xl mx-auto text-center px-4 mb-5'>
				<span className='text-sm  mb-2 block'>
					আমাদের বিশ্বাস
				</span>
				<h2 className='text-4xl md:text-5xl font-light text-gray-900 mb-4'>
					আমাদের কাজের ক্ষেত্র
				</h2>
				<p className='text-gray-600 max-w-2xl mx-auto'>
					আমরা বিশ্বাস করি যে একটি ছোট কিন্তু প্রতিজ্ঞাবদ্ধ ও লক্ষ্যনিষ্ঠ দল
					টেকসই কৃষিতে দীর্ঘস্থায়ী প্রভাব রাখতে পারে।
				</p>
			</div>
			<div className='max-w-7xl mx-auto'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[250px]'>
					{/* Feature 1 - Large Slider */}
					<motion.div
						className='relative overflow-hidden rounded-3xl lg:col-span-2 row-span-2 group'
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 0.9, y: 0.9 }}
						viewport={{ once: true }}
					>
						<AnimatePresence mode='wait'>
							<motion.div
								key={currentSlide}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.5 }}
								className='absolute inset-0'
							>
								<Image
									src={sliderContent[currentSlide].image || '/placeholder.svg'}
									alt={sliderContent[currentSlide].title}
									fill
									className='object-cover'
								/>
								<div className='absolute inset-0 bg-black/20' />
							</motion.div>
						</AnimatePresence>
						<div className='relative h-full p-8 flex flex-col justify-between'>
							<div className='flex items-center space-x-2'>
								<span className='text-sm text-white/80'>
									0{currentSlide + 1}
								</span>
								<div className='h-[1px] w-8 bg-white/40' />
								<span className='text-sm text-white/80'>
									{sliderContent[currentSlide].motto}
								</span>
							</div>
							<AnimatePresence mode='wait'>
								<motion.div
									key={currentSlide}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.5 }}
								>
									<h2 className='text-4xl font-light text-white mb-4'>
										{sliderContent[currentSlide].title}
									</h2>
									<p className='text-white/80 mb-4'>
										{sliderContent[currentSlide].description}
									</p>
								</motion.div>
							</AnimatePresence>
						</div>
					</motion.div>

					{/* Feature 2 - Green Card */}
					<Link href={`/marketplace`}>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className='relative rounded-3xl p-8 flex flex-col justify-between group cursor-pointer overflow-hidden'
							style={{
								backgroundImage: `url('https://images.unsplash.com/photo-1632776350300-11016768b521?q=80&w=1831&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
								height: '200px', // Adjust height as needed
							}}
						>
							{/* Overlay */}
							<div className='absolute inset-0 bg-black/30 rounded-3xl'></div>

							{/* Content */}
							<div className='relative z-10'>
								<h3 className='text-xl text-white'>
									Find and sell eco produce easily
								</h3>
								<div className='flex justify-end mt-4'>
									<ArrowUpRight className='text-white h-6 w-6 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform' />
								</div>
							</div>
						</motion.div>
					</Link>

					{/* Feature 3 - Stats Card */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className='bg-green rounded-3xl p-8 flex flex-col justify-between'
					>
						<div className='flex justify-between items-start'>
							<h3 className='text-xl text-gray-900'>Sustainable Impact</h3>
							<Leaf className='h-6 w-6 text-[#4ade80]' />
						</div>
						<div className='grid grid-cols-2 gap-4'>
							<div>
								<p className='text-3xl font-light text-gray-900'>40%</p>
								<p className='text-sm text-gray-600'>Water Saved</p>
							</div>
							<div>
								<p className='text-3xl font-light text-gray-900'>2.5M</p>
								<p className='text-sm text-gray-600'>Trees Planted</p>
							</div>
						</div>
					</motion.div>

					{/* Feature 4 - Image Card */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className='relative overflow-hidden rounded-3xl group'
					>
						<Image
							src='https://images.unsplash.com/photo-1574943320219-553eb213f72d'
							alt='Precision Farming'
							fill
							className='object-cover group-hover:scale-105 transition-transform duration-500'
						/>
						<div className='absolute inset-0 bg-black/20' />
						<div className='relative h-full p-8 flex flex-col justify-end'>
							<h3 className='text-xl text-white mb-2'>
								সুনির্দিষ্ট কৃষি বা প্রিসিশন কৃষি
							</h3>
							<p className='text-white/80 text-sm'>
								স্মার্ট প্রযুক্তি নির্ভর উন্নত ও কার্যকর চাষাবাদ।
							</p>
						</div>
					</motion.div>

					{/* Feature 5 - Image Card */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className='relative overflow-hidden rounded-3xl group'
					>
						<Image
							src='https://images.unsplash.com/photo-1568727349458-1bb59fb3fb63?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
							alt='Precision Farming'
							fill
							className='object-cover group-hover:scale-105 transition-transform duration-500'
						/>
						<div className='absolute inset-0 bg-black/20' />
						<div className='relative h-full p-8 flex flex-col justify-end'>
							<h3 className='text-xl text-white mb-2'>মাছ চাষ</h3>
							<p className='text-white/80 text-sm'>
								উন্নত প্রযুক্তিতে লাভজনক ও টেকসই মাছ চাষ।
							</p>
						</div>
					</motion.div>

					{/* Feature 6 - Image Card */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className='relative overflow-hidden rounded-3xl group'
					>
						<Image
							src='https://images.unsplash.com/photo-1615671524827-c1fe3973b648?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
							alt='Precision Farming'
							fill
							className='object-cover group-hover:scale-105 transition-transform duration-500'
						/>
						<div className='absolute inset-0 bg-black/20' />
						<div className='relative h-full p-8 flex flex-col justify-end'>
							<h3 className='text-xl text-white mb-2'>ছাদ কৃষি</h3>
							<p className='text-white/80 text-sm'>
								শহরে টেকসই ও স্বাস্থ্যকর সবুজ চাষাবাদ।
							</p>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}

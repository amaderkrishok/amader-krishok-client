'use client';

import { useEffect, useState } from 'react';
import { CurrentWeather } from '@/components/pages/weather/current-weather';
import { WeatherForecast } from '@/components/pages/weather/forecast';
import { WeatherOverview } from '@/components/pages/weather/overview';
import { SmartFarmingRecommendations } from '@/components/pages/weather/smart-farming-recommendations';
import { AirQualityCard } from '@/components/pages/weather/air-quality-card';
import { Input } from '@/components/ui/input';
import { Search, Leaf, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const dynamic = 'force-dynamic';

export default function WeatherPage() {
	const [error, setError] = useState('');
	const [weatherdata, setWeatherdata] = useState<any>(null);
	const [location, setLocation] = useState('');
	const [isSearching, setIsSearching] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);

	const popularLocations = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'সিলেট'];

	const floatingLeaves = [
		{ left: '6%', top: '15%', scale: 1.1, duration: 8, delay: 0 },
		{ left: '88%', top: '12%', scale: 0.9, duration: 9, delay: 1 },
		{ left: '80%', top: '75%', scale: 1.2, duration: 10, delay: 1.5 },
		{ left: '10%', top: '80%', scale: 0.8, duration: 7, delay: 0.5 },
	];

	// Automatically fetch weather data based on user geolocation or fallback to Dhaka
	useEffect(() => {
		const fetchInitialWeather = async () => {
			setInitialLoading(true);
			if ('geolocation' in navigator) {
				navigator.geolocation.getCurrentPosition(
					async (position) => {
						const { latitude, longitude } = position.coords;
						try {
							const response = await fetch(
								`/api/weather?lat=${latitude}&lon=${longitude}`
							);
							const data = await response.json();
							if (response.ok) {
								setWeatherdata(data);
								setError('');
							} else {
								// Fallback to Dhaka if lat/lon fails
								fetchWeatherForCity('Dhaka');
							}
						} catch {
							fetchWeatherForCity('Dhaka');
						} finally {
							setInitialLoading(false);
						}
					},
					() => {
						// Geolocation denied or unavailable -> Fallback to Dhaka
						fetchWeatherForCity('Dhaka');
						setInitialLoading(false);
					}
				);
			} else {
				fetchWeatherForCity('Dhaka');
				setInitialLoading(false);
			}
		};

		fetchInitialWeather();
	}, []);

	// Helper to fetch weather for a specific city
	const fetchWeatherForCity = async (cityName: string) => {
		setIsSearching(true);
		try {
			const response = await fetch(
				`/api/weather?location=${encodeURIComponent(cityName)}`
			);
			const data = await response.json();
			if (response.ok) {
				setWeatherdata(data);
				setError('');
			} else {
				setError(data.error || 'আবহাওয়ার তথ্য পাওয়া যায়নি।');
			}
		} catch {
			setError('আবহাওয়ার তথ্য আনতে সমস্যা হয়েছে।');
		} finally {
			setIsSearching(false);
			setInitialLoading(false);
		}
	};

	// Handle search input change
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLocation(e.target.value);
	};

	// Handle search submit
	const handleSearch = () => {
		if (!location.trim()) {
			setError('অনুগ্রহ করে একটি শহরের নাম লিখুন।');
			return;
		}
		fetchWeatherForCity(location);
	};

	// Handle popular location chip click
	const handlePopularClick = (cityName: string) => {
		setLocation(cityName);
		fetchWeatherForCity(cityName);
	};

	return (
		<div className='min-h-screen bg-[#F8F8F8] text-[#2A351F] selection:bg-[#FBBF24] selection:text-[#1E2817] font-sans overflow-x-hidden pb-20'>
			
			{/* ==================================================== */}
			{/* HERO SECTION                                         */}
			{/* ==================================================== */}
			<section className='relative bg-gradient-to-b from-[#37462A] via-[#2F3C23] to-[#37462A] text-white pt-28 sm:pt-36 pb-20 md:pb-24 w-full px-4 sm:px-6 lg:px-8 xl:px-20 2xl:px-12 overflow-hidden'>
				
				{/* Background Glows & Floating Leaves */}
				<div className='absolute inset-0 pointer-events-none z-0'>
					<div className='absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.12)_0%,transparent_60%)] blur-2xl' />
					<div className='absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-[radial-gradient(circle,rgba(76,175,80,0.12)_0%,transparent_60%)] blur-2xl' />

					{floatingLeaves.map((leaf, i) => (
						<motion.div
							key={i}
							className='absolute text-[#4CAF50] opacity-[0.08]'
							style={{ left: leaf.left, top: leaf.top }}
							animate={{
								y: [-12, 12, -12],
								rotate: [0, 18, -18, 0],
								scale: [leaf.scale, leaf.scale * 1.1, leaf.scale],
							}}
							transition={{
								duration: leaf.duration,
								repeat: Infinity,
								ease: 'easeInOut',
								delay: leaf.delay,
							}}
						>
							<Leaf className='w-12 h-12 md:w-16 md:h-16' />
						</motion.div>
					))}
				</div>

				<div className='relative z-10 max-w-7xl mx-auto'>
					<div className='max-w-[760px] mx-auto text-center space-y-6'>
					
					{/* Top Glass Badge */}
					<motion.div
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
						className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] backdrop-blur-md shadow-xs'
					>
						<span className='text-sm sm:text-base'>🌤️</span>
						<span className='text-xs sm:text-sm font-semibold text-[#FBBF24] tracking-wide uppercase'>
							আবহাওয়া আপডেট
						</span>
					</motion.div>

					{/* Main Heading */}
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className='text-[34px] sm:text-[46px] lg:text-[58px] font-extrabold text-[#FBBF24] leading-[1.1] tracking-tight drop-shadow-xs'
					>
						আবহাওয়া পূর্বাভাস
					</motion.h1>

					{/* Subheading */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className='text-white/80 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-[720px] mx-auto'
					>
						বাংলাদেশের যেকোনো এলাকার বর্তমান আবহাওয়া, আগামী ৭ দিনের পূর্বাভাস এবং কৃষিকাজের উপযোগী পরামর্শ এক জায়গায়।
					</motion.p>

					{/* Premium Search Bar */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className='pt-2 max-w-[680px] mx-auto'
					>
						<div className='relative flex items-center bg-white rounded-full p-2 shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-white/20 focus-within:ring-4 focus-within:ring-[#4CAF50]/20 transition-all'>
							<MapPin className='w-5 h-5 text-[#4CAF50] absolute left-5 pointer-events-none' />
							<Input
								type='text'
								placeholder='শহরের নাম লিখুন (যেমন: ঢাকা, বগুড়া)...'
								className='w-full pl-12 pr-32 h-[52px] md:h-[58px] border-none shadow-none focus-visible:ring-0 text-gray-900 text-base font-medium placeholder:text-gray-400 bg-transparent'
								value={location}
								onChange={handleSearchChange}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										handleSearch();
									}
								}}
							/>
							<button
								type='button'
								onClick={handleSearch}
								disabled={isSearching}
								className='absolute right-2 px-6 h-[44px] md:h-[50px] rounded-full bg-[#37462A] hover:bg-[#4A5E3A] text-white font-bold text-sm md:text-base flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-60 shrink-0'
							>
								{isSearching ? (
									<RefreshCw className='w-4 h-4 animate-spin text-[#FBBF24]' />
								) : (
									<Search className='w-4 h-4 text-[#FBBF24]' />
								)}
								<span>অনুসন্ধান</span>
							</button>
						</div>
					</motion.div>

					{/* Popular Location Chips */}
					<motion.div
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className='flex flex-wrap items-center justify-center gap-2 pt-2'
					>
						<span className='text-xs text-white/60 font-bold tracking-wide mr-1 uppercase'>
							জনপ্রিয় শহর:
						</span>
						{popularLocations.map((city) => (
							<button
								key={city}
								type='button'
								onClick={() => handlePopularClick(city)}
								className='px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] backdrop-blur-md text-white/90 text-xs sm:text-sm font-medium hover:bg-[#FBBF24] hover:text-[#1E2817] hover:border-[#FBBF24] hover:scale-105 transition-all duration-200 cursor-pointer shadow-xs'
							>
								{city}
							</button>
						))}
					</motion.div>
					</div>
				</div>
			</section>

			{/* ==================================================== */}
			{/* MAIN WEATHER DASHBOARD CONTAINER                      */}
			{/* ==================================================== */}
			<section className='w-full px-4 sm:px-6 lg:px-8 xl:px-20 2xl:px-12 relative z-20 -mt-10 md:-mt-14 space-y-8'>
				<div className='max-w-7xl mx-auto space-y-8'>
					{/* Display Error Message if any */}
					{error && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className='max-w-2xl mx-auto bg-red-50 text-red-700 p-4 rounded-2xl text-center border border-red-200 shadow-sm flex items-center justify-center gap-2 font-semibold text-sm'
						>
							<AlertCircle className='w-5 h-5 text-red-500' />
							<span>{error}</span>
						</motion.div>
					)}

					{/* Loading State */}
					{initialLoading && (
						<div className='bg-white rounded-[28px] p-12 text-center border border-gray-100 shadow-xl max-w-2xl mx-auto space-y-4'>
							<div className='w-12 h-12 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin mx-auto' />
							<p className='text-gray-600 font-bold text-base'>
								আবহাওয়ার তথ্য লোড করা হচ্ছে...
							</p>
						</div>
					)}

					{/* Weather Dashboard Workspace */}
					{weatherdata && !initialLoading && (
						<div className='space-y-8 min-w-0'>
							{/* Top Grid: Current Weather (2 cols) & Right Column (1 col) */}
							<div className='grid grid-cols-1 xl:grid-cols-3 gap-8 items-start min-w-0'>
								{/* Main Left Block */}
								<div className='xl:col-span-2 space-y-8 min-w-0'>
									<CurrentWeather data={weatherdata} />
									<WeatherOverview data={weatherdata} />
								</div>

								{/* Right Sidebar Block */}
								<div className='space-y-8 min-w-0'>
									<AirQualityCard data={weatherdata} />
									<WeatherForecast data={weatherdata} />
								</div>
							</div>

							{/* Bottom Dedicated Smart Farming Recommendations Section */}
							<SmartFarmingRecommendations data={weatherdata} />
						</div>
					)}
				</div>
			</section>

		</div>
	);
}

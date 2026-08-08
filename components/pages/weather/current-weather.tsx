'use client';

import React from 'react';
import {
	Sun,
	Cloud,
	CloudSnow,
	CloudRain,
	CloudDrizzle,
	Droplets,
	Wind,
	Eye,
	Compass,
	Thermometer,
	Sunrise,
	Sunset,
	CloudSun,
} from 'lucide-react';
import { motion } from 'framer-motion';

export function CurrentWeather({ data }: { data: any }) {
	const { name, state } = data.searchLocation || {};
	const hourlyForecast = data.list || [];
	const { sunrise, sunset } = data.city || {};

	const formatTemperature = (temp: number): string =>
		`${Math.round(temp - 273.15)}°C`;

	const formatTime12Hour = (dtTxt: string): string => {
		if (!dtTxt) return '--';
		const date = new Date(dtTxt);
		return date.toLocaleTimeString('bn-BD', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true,
		});
	};

	const formatUnixTime12Hour = (unixTime: number): string => {
		if (!unixTime) return '--';
		const date = new Date(unixTime * 1000);
		return date.toLocaleTimeString('bn-BD', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true,
		});
	};

	type PrecipitationDetails = {
		text: string;
		color: string;
		bgColor: string;
		icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
		intensity: string;
	};

	const getPrecipitationDetails = (pop: number): PrecipitationDetails => {
		if (pop === 0)
			return {
				text: 'বৃষ্টির সম্ভাবনা নেই',
				color: 'text-emerald-700',
				bgColor: 'bg-emerald-50/80 border-emerald-200/80',
				icon: CloudSun,
				intensity: 'পরিষ্কার আকাশ',
			};

		const percentage = Math.round(pop * 100);
		let details: PrecipitationDetails = {
			text: `${percentage}% বৃষ্টির সম্ভাবনা`,
			icon: Droplets,
			intensity: '',
			color: '',
			bgColor: '',
		};

		if (percentage < 30) {
			details = {
				...details,
				color: 'text-emerald-700',
				bgColor: 'bg-emerald-50/80 border-emerald-200',
				intensity: 'হালকা (Light)',
			};
		} else if (percentage < 70) {
			details = {
				...details,
				color: 'text-amber-800',
				bgColor: 'bg-amber-50/80 border-amber-200',
				intensity: 'মাঝারি (Moderate)',
				icon: CloudDrizzle,
			};
		} else {
			details = {
				...details,
				color: 'text-blue-800',
				bgColor: 'bg-blue-50/80 border-blue-200',
				intensity: 'ভারী (Heavy)',
				icon: CloudRain,
			};
		}

		return details;
	};

	const getWeatherIcon = (weatherCode: string) => {
		switch (weatherCode) {
			case '01d':
			case '01n':
				return <Sun className='h-10 w-10 text-[#FBBF24] animate-pulse' />;
			case '02d':
			case '02n':
				return <CloudSun className='h-10 w-10 text-[#4CAF50]' />;
			case '03d':
			case '03n':
			case '04d':
			case '04n':
				return <Cloud className='h-10 w-10 text-gray-500' />;
			case '09d':
			case '09n':
			case '10d':
			case '10n':
				return <CloudRain className='h-10 w-10 text-blue-500' />;
			case '13d':
			case '13n':
				return <CloudSnow className='h-10 w-10 text-sky-400' />;
			case '50d':
			case '50n':
				return <Wind className='h-10 w-10 text-teal-600' />;
			default:
				return <Cloud className='h-10 w-10 text-[#4CAF50]' />;
		}
	};

	const currentItem = hourlyForecast[0];
	const precipDetails = currentItem
		? getPrecipitationDetails(currentItem.pop)
		: null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 25 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='bg-white border border-gray-100 rounded-[28px] p-6 md:p-8 lg:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.15)] relative overflow-hidden'
		>
			{/* Header Section */}
			<div className='flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-gray-100 mb-8 gap-6'>
				<div>
					<div className='flex items-center gap-2 mb-1'>
						<span className='px-3 py-1 rounded-full bg-[#4CAF50]/10 text-[#2E7D32] text-xs font-bold border border-[#4CAF50]/20'>
							📍 বর্তমান অবস্থান
						</span>
					</div>
					<h2 className='text-3xl md:text-4xl font-extrabold text-[#2A351F] tracking-tight'>
						{name !== 'Unknown' ? name : data?.city?.name}
					</h2>
					<p className='text-sm text-gray-500 font-medium mt-1'>
						{state !== 'Unknown' ? state : data?.city?.country} • সর্বশেষ আপডেট
					</p>
				</div>

				{/* Large Temperature Display */}
				<div className='flex items-center gap-4 bg-[#F8F8F8] px-6 py-4 rounded-[22px] border border-gray-200/70 shadow-xs'>
					{currentItem && getWeatherIcon(currentItem.weather[0].icon)}
					<div>
						<span className='text-4xl md:text-5xl font-black text-[#2A351F] tracking-tight'>
							{currentItem ? formatTemperature(currentItem.main.temp) : '--'}
						</span>
						<p className='text-xs font-bold text-gray-500 uppercase tracking-wider mt-0.5'>
							{currentItem?.weather?.[0]?.description || 'আবহাওয়া'}
						</p>
					</div>
				</div>
			</div>

			{/* Precipitation Badge & Quick Stats Grid */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
				{/* Rain Details Card */}
				{precipDetails && (
					<div
						className={`rounded-[20px] p-5 border flex flex-col justify-between shadow-xs ${precipDetails.bgColor}`}
					>
						<div className='flex items-center gap-3 mb-3'>
							<div className='p-2.5 rounded-xl bg-white/80 shadow-xs'>
								{React.createElement(precipDetails.icon, {
									className: `h-6 w-6 ${precipDetails.color}`,
								})}
							</div>
							<div>
								<span className={`font-bold text-base md:text-lg block ${precipDetails.color}`}>
									{precipDetails.text}
								</span>
								<span className='text-xs text-gray-600 font-semibold'>
									বৃষ্টির তীব্রতা: {precipDetails.intensity}
								</span>
							</div>
						</div>
						<div className='text-xs font-medium text-gray-600 bg-white/70 p-2.5 rounded-xl border border-black/5'>
							💡 পরামর্শ: চাষাবাদের পরিকল্পনা করার আগে পূর্বাভাস দেখুন।
						</div>
					</div>
				)}

				{/* Weather Metrics Stats Grid */}
				<div className='lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3'>
					{/* Humidity */}
					<div className='bg-[#F8F8F8] p-4 rounded-[18px] border border-gray-100 flex flex-col justify-between hover:shadow-xs transition-shadow'>
						<div className='flex items-center gap-2 text-gray-500 mb-2'>
							<Droplets className='w-4 h-4 text-[#4CAF50]' />
							<span className='text-xs font-bold'>আর্দ্রতা</span>
						</div>
						<span className='text-xl md:text-2xl font-extrabold text-[#2A351F]'>
							{currentItem?.main?.humidity || '--'}%
						</span>
					</div>

					{/* Wind */}
					<div className='bg-[#F8F8F8] p-4 rounded-[18px] border border-gray-100 flex flex-col justify-between hover:shadow-xs transition-shadow'>
						<div className='flex items-center gap-2 text-gray-500 mb-2'>
							<Wind className='w-4 h-4 text-[#4CAF50]' />
							<span className='text-xs font-bold'>বাতাস</span>
						</div>
						<span className='text-xl md:text-2xl font-extrabold text-[#2A351F]'>
							{currentItem?.wind?.speed || '--'} <span className='text-xs font-semibold'>km/h</span>
						</span>
					</div>

					{/* Pressure */}
					<div className='bg-[#F8F8F8] p-4 rounded-[18px] border border-gray-100 flex flex-col justify-between hover:shadow-xs transition-shadow'>
						<div className='flex items-center gap-2 text-gray-500 mb-2'>
							<Compass className='w-4 h-4 text-[#4CAF50]' />
							<span className='text-xs font-bold'>চাপ</span>
						</div>
						<span className='text-xl md:text-2xl font-extrabold text-[#2A351F]'>
							{currentItem?.main?.pressure || '--'} <span className='text-xs font-semibold'>hPa</span>
						</span>
					</div>

					{/* Feels like */}
					<div className='bg-[#F8F8F8] p-4 rounded-[18px] border border-gray-100 flex flex-col justify-between hover:shadow-xs transition-shadow'>
						<div className='flex items-center gap-2 text-gray-500 mb-2'>
							<Thermometer className='w-4 h-4 text-[#4CAF50]' />
							<span className='text-xs font-bold'>অনুভূত</span>
						</div>
						<span className='text-xl md:text-2xl font-extrabold text-[#2A351F]'>
							{currentItem?.main?.feels_like ? formatTemperature(currentItem.main.feels_like) : '--'}
						</span>
					</div>

					{/* Visibility */}
					<div className='bg-[#F8F8F8] p-4 rounded-[18px] border border-gray-100 flex flex-col justify-between hover:shadow-xs transition-shadow'>
						<div className='flex items-center gap-2 text-gray-500 mb-2'>
							<Eye className='w-4 h-4 text-[#4CAF50]' />
							<span className='text-xs font-bold'>দৃশ্যমানতা</span>
						</div>
						<span className='text-xl md:text-2xl font-extrabold text-[#2A351F]'>
							{currentItem?.visibility ? (currentItem.visibility / 1000).toFixed(1) : '--'} <span className='text-xs font-semibold'>km</span>
						</span>
					</div>

					{/* Sunrise */}
					<div className='bg-[#F8F8F8] p-4 rounded-[18px] border border-gray-100 flex flex-col justify-between hover:shadow-xs transition-shadow'>
						<div className='flex items-center gap-2 text-gray-500 mb-2'>
							<Sunrise className='w-4 h-4 text-[#FBBF24]' />
							<span className='text-xs font-bold'>সূর্যোদয়</span>
						</div>
						<span className='text-base font-extrabold text-[#2A351F]'>
							{formatUnixTime12Hour(sunrise)}
						</span>
					</div>

					{/* Sunset */}
					<div className='bg-[#F8F8F8] p-4 rounded-[18px] border border-gray-100 flex flex-col justify-between hover:shadow-xs transition-shadow'>
						<div className='flex items-center gap-2 text-gray-500 mb-2'>
							<Sunset className='w-4 h-4 text-[#FF9800]' />
							<span className='text-xs font-bold'>সূর্যাস্ত</span>
						</div>
						<span className='text-base font-extrabold text-[#2A351F]'>
							{formatUnixTime12Hour(sunset)}
						</span>
					</div>

					{/* UV Index */}
					<div className='bg-[#F8F8F8] p-4 rounded-[18px] border border-gray-100 flex flex-col justify-between hover:shadow-xs transition-shadow'>
						<div className='flex items-center gap-2 text-gray-500 mb-2'>
							<Sun className='w-4 h-4 text-[#FBBF24]' />
							<span className='text-xs font-bold'>ইউভি ইনডেক্স</span>
						</div>
						<span className='text-xl md:text-2xl font-extrabold text-[#2A351F]'>
							৩ <span className='text-xs font-bold text-emerald-600'>(সহনীয়)</span>
						</span>
					</div>
				</div>
			</div>

			{/* Hourly Forecast Horizontal Scroll Section */}
			<div className='pt-6 border-t border-gray-100'>
				<div className='flex items-center justify-between mb-4'>
					<h3 className='text-lg font-bold text-[#2A351F] flex items-center gap-2'>
						<span>⏰ ঘণ্টাওয়ারী পূর্বাভাস</span>
					</h3>
					<span className='text-xs text-gray-500 font-semibold'>
						ডানে স্ক্রোল করুন →
					</span>
				</div>

				<div className='overflow-x-auto pb-4 pt-1 scrollbar-none'>
					<div className='flex gap-3 min-w-max'>
						{hourlyForecast.map((hour: any, index: number) => {
							const hourPrecip = getPrecipitationDetails(hour.pop);
							return (
								<motion.div
									key={index}
									whileHover={{ y: -4 }}
									className={`rounded-[18px] p-4 min-w-[120px] border transition-all duration-200 flex flex-col items-center justify-between text-center shadow-2xs hover:shadow-md ${hourPrecip.bgColor}`}
								>
									<span className='text-xs font-bold text-gray-600 mb-2 block'>
										{formatTime12Hour(hour.dt_txt)}
									</span>

									<div className='my-2'>
										{getWeatherIcon(hour.weather[0].icon)}
									</div>

									<span className='text-lg font-extrabold text-[#2A351F] my-1 block'>
										{formatTemperature(hour.main.temp)}
									</span>

									<div className='flex items-center gap-1 mt-1'>
										<Droplets className={`w-3.5 h-3.5 ${hourPrecip.color}`} />
										<span className={`text-xs font-extrabold ${hourPrecip.color}`}>
											{Math.round(hour.pop * 100)}%
										</span>
									</div>
								</motion.div>
							);
						})}
					</div>
				</div>
			</div>
		</motion.div>
	);
}

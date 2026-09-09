'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Droplets, Sun, Cloud, CloudRain } from 'lucide-react';

interface WeatherData {
	list: WeatherForecastItem[];
}

interface WeatherForecastItem {
	dt_txt: string;
	pop?: number;
	main: {
		temp: number;
		temp_min?: number;
		temp_max?: number;
	};
	weather: Array<{
		icon: string;
		description: string;
	}>;
}

interface DailyForecasts {
	[key: string]: WeatherForecastItem[];
}

interface DateInfo {
	day: number;
	date: string;
	fullDayName: string;
}

export function WeatherForecast({ data }: { data: WeatherData }) {
	if (!data?.list) return null;

	const dailyForecasts: DailyForecasts = data.list.reduce(
		(acc: DailyForecasts, curr) => {
			const date = new Date(curr.dt_txt).toDateString();
			if (!acc[date]) acc[date] = [];
			acc[date].push(curr);
			return acc;
		},
		{}
	);

	const forecastEntries = Object.entries(dailyForecasts);

	const formatTemperature = (temp: number): string =>
		`${Math.round(temp - 273.15)}°C`;

	const getAverageTemp = (forecasts: WeatherForecastItem[]): string =>
		formatTemperature(
			forecasts.reduce((sum, curr) => sum + curr.main.temp, 0) /
				forecasts.length
		);

	const getMaxPop = (forecasts: WeatherForecastItem[]): number => {
		return Math.max(...forecasts.map((f) => f.pop || 0));
	};

	const getDayAndDate = (dtTxt: string): DateInfo => {
		const date = new Date(dtTxt);
		return {
			day: date.getDate(),
			date: date.toLocaleDateString('bn-BD', {
				month: 'short',
			}),
			fullDayName: date.toLocaleDateString('bn-BD', {
				weekday: 'long',
			}),
		};
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
			className='bg-white border border-gray-100 rounded-[28px] p-4 sm:p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] w-full overflow-hidden'
		>
			{/* Section Header */}
			<div className='flex items-center justify-between mb-6 pb-4 border-b border-gray-100'>
				<div className='flex items-center gap-3'>
					<div className='w-10 h-10 rounded-xl bg-[#4CAF50]/15 text-[#2E7D32] flex items-center justify-center shrink-0'>
						<Calendar className='w-5 h-5' />
					</div>
					<div>
						<h3 className='text-lg sm:text-xl font-extrabold text-[#2A351F] tracking-tight'>
							৭ দিনের পূর্বাভাস
						</h3>
						<p className='text-xs text-gray-500 font-medium'>
							পরবর্তী দিনগুলোর আবহাওয়া অনুমান
						</p>
					</div>
				</div>
				<span className='px-3 py-1 rounded-full bg-[#2A351F]/10 text-[#2A351F] text-xs font-bold shrink-0'>
					{forecastEntries.length} দিন
				</span>
			</div>

			{/* Forecast Cards List */}
			<div className='space-y-3.5'>
				{forecastEntries.map(([, forecasts], index) => {
					const { day, date: monthName, fullDayName } = getDayAndDate(
						forecasts[0].dt_txt
					);
					const avgTemp = getAverageTemp(forecasts);
					const maxPop = Math.round(getMaxPop(forecasts) * 100);

					return (
						<motion.div
							key={index}
							whileHover={{ y: -2 }}
							className='flex items-center justify-between gap-2 sm:gap-3 bg-[#F8F8F8] hover:bg-emerald-50/40 border border-gray-200/60 hover:border-[#4CAF50]/40 rounded-[20px] p-3 sm:p-4 transition-all duration-200 shadow-2xs hover:shadow-md group min-w-0 overflow-hidden'
						>
							{/* Date & Day Badge */}
							<div className='flex items-center gap-2.5 sm:gap-3.5 min-w-0 shrink'>
								<div className='w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-gray-200/80 shadow-2xs flex flex-col items-center justify-center shrink-0 group-hover:border-[#4CAF50] transition-colors'>
									<span className='text-[10px] sm:text-xs font-bold text-gray-500 leading-none'>
										{monthName}
									</span>
									<span className='text-base sm:text-lg font-black text-[#2E7D32] leading-tight'>
										{day}
									</span>
								</div>

								<div className='min-w-0'>
									<h4 className='text-sm sm:text-base font-bold text-[#2A351F] capitalize truncate'>
										{fullDayName}
									</h4>
									<div className='flex items-center gap-1.5 sm:gap-2 mt-0.5'>
										<Droplets className='w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#4CAF50] shrink-0' />
										<span className='text-[11px] sm:text-xs font-semibold text-gray-600 truncate'>
											বৃষ্টি {maxPop}%
										</span>
									</div>
								</div>
							</div>

							{/* Temperature Progress Indicator & Value */}
							<div className='flex items-center gap-2 sm:gap-3 shrink-0 ml-auto'>
								<div className='hidden min-[500px]:block xl:hidden w-16 sm:w-20 md:w-24'>
									<div className='flex justify-between text-[10px] font-bold text-gray-400 mb-1'>
										<span>কম</span>
										<span>বেশি</span>
									</div>
									<div className='w-full bg-gray-200 h-1.5 sm:h-2 rounded-full overflow-hidden p-0.5'>
										<div
											className='h-full rounded-full bg-gradient-to-r from-[#4CAF50] to-[#FBBF24]'
											style={{
												width: `${Math.min(
													Math.max((parseInt(avgTemp) / 40) * 100, 20),
													100
												)}%`,
											}}
										/>
									</div>
								</div>

								<div className='bg-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-gray-200/80 shadow-2xs font-black text-[#2A351F] text-sm sm:text-base md:text-lg min-w-[58px] sm:min-w-[68px] text-center shrink-0'>
									{avgTemp}
								</div>
							</div>
						</motion.div>
					);
				})}
			</div>
		</motion.div>
	);
}

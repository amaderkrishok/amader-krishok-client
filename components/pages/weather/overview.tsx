'use client';

import * as React from 'react';
import {
	Area,
	AreaChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
} from 'recharts';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import { TrendingUp, Thermometer, Droplets, Wind } from 'lucide-react';

interface WeatherData {
	cod: string;
	message: number;
	cnt: number;
	list: Array<{
		dt: number;
		main: {
			temp: number;
			feels_like: number;
			humidity: number;
			pressure: number;
		};
		weather: Array<{
			description: string;
		}>;
		wind: {
			speed: number;
		};
		pop: number;
		dt_txt: string;
	}>;
	city: {
		name: string;
		country: string;
	};
}

interface WeatherOverviewProps {
	data: WeatherData;
}

const kelvinToCelsius = (kelvin: number) => kelvin - 273.15;

export function WeatherOverview({ data }: WeatherOverviewProps) {
	const [timeRange, setTimeRange] = React.useState('5d');
	const [activeMetric, setActiveMetric] = React.useState<'temp' | 'humidity' | 'windSpeed'>('temp');

	const chartData = React.useMemo(() => {
		if (!data?.list) return [];
		return data.list.map((item) => ({
			timestamp: parseISO(item.dt_txt),
			temp: kelvinToCelsius(item.main.temp),
			humidity: item.main.humidity,
			windSpeed: item.wind.speed,
			description: item.weather[0]?.description || '',
		}));
	}, [data]);

	const filteredData = React.useMemo(() => {
		if (!chartData.length) return [];
		const days = parseInt(timeRange.replace('d', ''));
		const endDate = new Date(chartData[0].timestamp);
		endDate.setDate(endDate.getDate() + days);
		return chartData.filter((item) => item.timestamp <= endDate);
	}, [chartData, timeRange]);

	const getMetricConfig = () => {
		switch (activeMetric) {
			case 'humidity':
				return {
					label: 'আর্দ্রতা (%)',
					color: '#3B82F6', // Blue
					unit: '%',
				};
			case 'windSpeed':
				return {
					label: 'বাতাসের গতি (m/s)',
					color: '#10B981', // Emerald
					unit: 'm/s',
				};
			case 'temp':
			default:
				return {
					label: 'তাপমাত্রা (°C)',
					color: '#F59E0B', // Amber / Orange
					unit: '°C',
				};
		}
	};

	const metricConfig = getMetricConfig();

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.1 }}
		>
			<Card className='w-full border border-gray-100 rounded-[28px] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] bg-white overflow-hidden'>
				<CardHeader className='flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-6 border-b border-gray-100 mb-6 p-0'>
					<div>
						<CardTitle className='text-xl md:text-2xl font-extrabold text-[#2A351F] flex items-center gap-3.5'>
							<div className='w-10 h-10 rounded-xl bg-[#4CAF50]/15 text-[#2E7D32] flex items-center justify-center shrink-0'>
								<TrendingUp className='w-5 h-5' />
							</div>
							<span>আবহাওয়া বিশ্লেষণের গ্রাফ</span>
						</CardTitle>
						<CardDescription className='text-xs sm:text-sm text-gray-500 font-medium mt-1'>
							আগামী {timeRange.replace('d', ' দিনের')} তাপমাত্রা, আর্দ্রতা এবং বাতাসের মাত্রার ধারাবাহিক পরিবর্তন
						</CardDescription>
					</div>

					<div className='flex items-center gap-3 w-full md:w-auto justify-between md:justify-end'>
						{/* Metric Filter Tabs */}
						<div className='bg-[#F8F8F8] p-1 rounded-2xl flex items-center gap-1 border border-gray-200/60'>
							<button
								type='button'
								onClick={() => setActiveMetric('temp')}
								className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
									activeMetric === 'temp'
										? 'bg-[#2A351F] text-white shadow-xs'
										: 'text-gray-600 hover:text-gray-900'
								}`}
							>
								<Thermometer className='w-3.5 h-3.5 text-[#FBBF24]' />
								<span>তাপমাত্রা</span>
							</button>

							<button
								type='button'
								onClick={() => setActiveMetric('humidity')}
								className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
									activeMetric === 'humidity'
										? 'bg-[#2A351F] text-white shadow-xs'
										: 'text-gray-600 hover:text-gray-900'
								}`}
							>
								<Droplets className='w-3.5 h-3.5 text-blue-400' />
								<span>আর্দ্রতা</span>
							</button>

							<button
								type='button'
								onClick={() => setActiveMetric('windSpeed')}
								className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
									activeMetric === 'windSpeed'
										? 'bg-[#2A351F] text-white shadow-xs'
										: 'text-gray-600 hover:text-gray-900'
								}`}
							>
								<Wind className='w-3.5 h-3.5 text-emerald-400' />
								<span>বাতাস</span>
							</button>
						</div>

						{/* Time Range Selector */}
						<Select value={timeRange} onValueChange={setTimeRange}>
							<SelectTrigger className='w-[130px] h-[38px] bg-[#F8F8F8] border-gray-200 rounded-xl text-xs font-bold text-[#2A351F] focus:ring-4 focus:ring-[#4CAF50]/15'>
								<SelectValue placeholder='সময় সীমা' />
							</SelectTrigger>
							<SelectContent className='rounded-xl border-gray-100 shadow-xl bg-white p-1'>
								<SelectItem value='1d' className='rounded-lg text-xs font-semibold py-2'>১ দিন</SelectItem>
								<SelectItem value='3d' className='rounded-lg text-xs font-semibold py-2'>৩ দিন</SelectItem>
								<SelectItem value='5d' className='rounded-lg text-xs font-semibold py-2'>৫ দিন</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardHeader>

				<CardContent className='p-0'>
					<div className='h-[280px] w-full pt-2'>
						<ResponsiveContainer width='100%' height='100%'>
							<AreaChart
								data={filteredData}
								margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
							>
								<defs>
									<linearGradient id='metricGradient' x1='0' y1='0' x2='0' y2='1'>
										<stop offset='5%' stopColor={metricConfig.color} stopOpacity={0.4} />
										<stop offset='95%' stopColor={metricConfig.color} stopOpacity={0.0} />
									</linearGradient>
								</defs>
								<XAxis
									dataKey='timestamp'
									tickFormatter={(value) => format(new Date(value), 'dd MMM h a')}
									tick={{ fontSize: 11, fill: '#6B7280' }}
									stroke='#E5E7EB'
								/>
								<YAxis
									tickFormatter={(value) => `${Math.round(value)}${metricConfig.unit}`}
									domain={['auto', 'auto']}
									tick={{ fontSize: 11, fill: '#6B7280' }}
									stroke='#E5E7EB'
								/>
								<Tooltip
									content={({ active, payload }) => {
										if (active && payload && payload.length) {
											const dataItem = payload[0].payload;
											return (
												<div className='rounded-2xl border border-gray-100 bg-white p-3.5 shadow-xl text-xs space-y-1.5 min-w-[180px]'>
													<p className='font-bold text-[#2A351F] border-b border-gray-100 pb-1'>
														{format(dataItem.timestamp, 'dd MMM yyyy, h:mm a')}
													</p>
													<div className='flex justify-between items-center text-gray-600'>
														<span>তাপমাত্রা:</span>
														<span className='font-bold text-amber-600'>{dataItem.temp.toFixed(1)}°C</span>
													</div>
													<div className='flex justify-between items-center text-gray-600'>
														<span>আর্দ্রতা:</span>
														<span className='font-bold text-blue-600'>{dataItem.humidity}%</span>
													</div>
													<div className='flex justify-between items-center text-gray-600'>
														<span>বাতাস:</span>
														<span className='font-bold text-emerald-600'>{dataItem.windSpeed.toFixed(1)} m/s</span>
													</div>
												</div>
											);
										}
										return null;
									}}
								/>
								<Area
									type='monotone'
									dataKey={activeMetric}
									stroke={metricConfig.color}
									strokeWidth={3}
									fillOpacity={1}
									fill='url(#metricGradient)'
								/>
							</AreaChart>
						</ResponsiveContainer>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}

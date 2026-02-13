'use client';

import * as React from 'react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { format, parseISO } from 'date-fns';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface WeatherData {
	cod: string;
	message: number;
	cnt: number;
	list: Array<{
		dt: number;
		main: {
			temp: number;
			feels_like: number;
			temp_min: number;
			temp_max: number;
			pressure: number;
			sea_level: number;
			grnd_level: number;
			humidity: number;
			temp_kf: number;
		};
		weather: Array<{
			id: number;
			main: string;
			description: string;
			icon: string;
		}>;
		clouds: {
			all: number;
		};
		wind: {
			speed: number;
			deg: number;
			gust: number;
		};
		visibility: number;
		pop: number;
		sys: {
			pod: string;
		};
		dt_txt: string;
	}>;
	city: {
		id: number;
		name: string;
		coord: {
			lat: number;
			lon: number;
		};
		country: string;
		population: number;
		timezone: number;
		sunrise: number;
		sunset: number;
	};
	searchLocation: {
		lat: number;
		lon: number;
		name: string;
		state: string;
	};
}

interface WeatherOverviewProps {
	data: WeatherData;
}

const kelvinToCelsius = (kelvin: number) => kelvin - 273.15;

export function WeatherOverview({ data }: WeatherOverviewProps) {
	const [timeRange, setTimeRange] = React.useState('5d');

	const chartData = React.useMemo(() => {
		return data.list.map((item) => ({
			timestamp: parseISO(item.dt_txt),
			temp: kelvinToCelsius(item.main.temp),
			humidity: item.main.humidity,
			windSpeed: item.wind.speed,
			description: item.weather[0].description,
		}));
	}, [data]);

	const filteredData = React.useMemo(() => {
		const days = parseInt(timeRange.replace('d', ''));
		const endDate = new Date(chartData[0].timestamp);
		endDate.setDate(endDate.getDate() + days);
		return chartData.filter((item) => item.timestamp < endDate);
	}, [chartData, timeRange]);

	return (
		<Card className='w-full max-w-4xl mx-auto p-2 sm:p-6 '>
			<CardHeader className='flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-2'>
				<div className='space-y-1 w-full sm:w-auto'>
					<CardTitle className='text-lg sm:text-xl break-words'>
						{data.city.name} এর আবহাওয়া পূর্বাভাস
					</CardTitle>
					<CardDescription className='text-sm'>
						Temperature forecast for the next {timeRange.replace('d', ' days')}
					</CardDescription>
				</div>
				<Select value={timeRange} onValueChange={setTimeRange}>
					<SelectTrigger className='w-full sm:w-[180px]'>
						<SelectValue placeholder='Select time range' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='1d'>1 Day</SelectItem>
						<SelectItem value='3d'>3 Days</SelectItem>
						<SelectItem value='5d'>5 Days</SelectItem>
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={{
						temp: {
							label: 'Temperature',
							color: 'var(--chart-1)',
						},
					}}
					className='aspect-[4/3] w-full'
				>
					<ResponsiveContainer width='100%' height='100%'>
						<LineChart
							width={730}
							height={250}
							data={filteredData}
							margin={{ right: 10, left: 10 }}
						>
							<XAxis
								dataKey='timestamp'
								tickFormatter={(value) =>
									format(new Date(value), 'MMM dd hh:mm a')
								}
								interval='preserveStartEnd'
								tick={{ fontSize: 8, textAnchor: 'end' }}
								height={60}
								angle={-45}
							/>
							<YAxis
								tickFormatter={(value) => `${value.toFixed(0)}°C`}
								domain={['auto', 'auto']}
								tick={{ fontSize: 10 }}
								width={40}
								label={{
									value: 'Temperature (°C)',
									angle: -90,
									position: 'insideLeft',
									fontSize: 10,
								}}
							/>
							<ChartTooltip
								content={({ active, payload }) => {
									if (active && payload && payload.length) {
										const data = payload[0].payload;
										return (
											<div className='rounded-lg border bg-background p-2 shadow-sm max-w-[250px] text-xs sm:text-sm'>
												<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
													<div className='flex flex-col'>
														<span className='text-[0.65rem] uppercase text-muted-foreground'>
															Date & Time
														</span>
														<span className='font-bold text-muted-foreground break-words'>
															{format(data.timestamp, 'MMM dd, yyyy hh:mm a')}
														</span>
													</div>
													<div className='flex flex-col'>
														<span className='text-[0.65rem] uppercase text-muted-foreground'>
															Temperature
														</span>
														<span className='font-bold'>
															{data.temp.toFixed(1)}°C
														</span>
													</div>
													<div className='hidden sm:flex flex-col'>
														<span className='text-[0.65rem] uppercase text-muted-foreground'>
															Humidity
														</span>
														<span className='font-bold'>{data.humidity}%</span>
													</div>
													<div className='hidden sm:flex flex-col'>
														<span className='text-[0.65rem] uppercase text-muted-foreground'>
															Wind Speed
														</span>
														<span className='font-bold'>
															{data.windSpeed.toFixed(1)} m/s
														</span>
													</div>
												</div>
												<div className='mt-2'>
													<span className='text-[0.65rem] uppercase text-muted-foreground'>
														Description
													</span>
													<span className='block font-bold break-words'>
														{data.description}
													</span>
												</div>
											</div>
										);
									}
									return null;
								}}
							/>
							<Line
								type='monotone'
								dataKey='temp'
								stroke='var(--color-temp)'
								strokeWidth={2}
							/>
						</LineChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

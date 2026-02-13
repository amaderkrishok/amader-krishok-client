import React from 'react';
import {
	Sun,
	Cloud,
	CloudSnow,
	CloudRain,
	CloudDrizzle,
	Droplets,
	Wind,
} from 'lucide-react';

export function CurrentWeather({ data }: { data: any }) {
	const { name, state } = data.searchLocation || {};
	const hourlyForecast = data.list || [];
	const { sunrise, sunset } = data.city || {};

	const formatTemperature = (temp: number): string =>
		`${Math.round(temp - 273.15)}°C`;

	const formatTime12Hour = (dtTxt: string): string => {
		const date = new Date(dtTxt);
		return date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true,
		});
	};

	// Enhanced precipitation formatting and styling
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
				text: 'বৃষ্টির আশা নেই',
				color: 'text-green-600',
				bgColor: 'bg-green-50',
				icon: Cloud,
				intensity: 'Clear',
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
				color: 'text-blue-400',
				bgColor: 'bg-blue-50',
				intensity: 'Light',
			};
		} else if (percentage < 70) {
			details = {
				...details,
				color: 'text-blue-600',
				bgColor: 'bg-blue-100',
				intensity: 'Moderate',
				icon: CloudDrizzle,
			};
		} else {
			details = {
				...details,
				color: 'text-blue-800',
				bgColor: 'bg-blue-200',
				intensity: 'Heavy',
				icon: CloudRain,
			};
		}

		return details;
	};

	//Get weather Icon
	const getWeatherIcon = (weatherCode: string) => {
		switch (weatherCode) {
			case '01d':
			case '01n':
				return <Sun className='h-6 w-6 md:h-8 md:w-8' />;
			case '02d':
			case '02n':
				return <Cloud className='h-6 w-6 md:h-8 md:w-8' />;
			case '03d':
			case '03n':
			case '04d':
			case '04n':
				return <Cloud className='h-6 w-6 md:h-8 md:w-8' />;
			case '09d':
			case '09n':
			case '10d':
			case '10n':
				return <CloudRain className='h-6 w-6 md:h-8 md:w-8' />;
			case '13d':
			case '13n':
				return <CloudSnow className='h-6 w-6 md:h-8 md:w-8' />;
			case '50d':
			case '50n':
				return <Wind className='h-6 w-6 md:h-8 md:w-8' />;
			default:
				return <Cloud className='h-6 w-6 md:h-8 md:w-8' />;
		}
	};

	return (
		<div className='bg-white border border-gray-200 rounded-xl p-6 max-w-4xl mx-auto'>
			{/* Header Section */}
			<div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4'>
				<div>
					<div className='flex flex-wrap items-center gap-2 mb-2'>
						<h2 className='text-xl md:text-2xl font-semibold'>
							{name !== 'Unknown' ? name : data.city.name}
						</h2>
						<span className='text-sm text-gray-500'>
							{state !== 'Unknown' ? state : data.city.country}
						</span>
					</div>
					<div className='flex flex-wrap items-center gap-8'>
						<div className='flex flex-col'>
							<div className='flex items-center gap-2'>
								{hourlyForecast[0] ? (
									getWeatherIcon(hourlyForecast[0].weather[0].icon)
								) : (
									<Cloud className='h-6 w-6 md:h-8 md:w-8' />
								)}
								<span className='text-3xl md:text-4xl font-bold'>
									{hourlyForecast[0]
										? formatTemperature(hourlyForecast[0].main.temp)
										: '--'}
								</span>
							</div>

							{/* Enhanced precipitation display for current weather */}
							{hourlyForecast[0] && (
								<div
									className={`rounded-lg p-3 mt-3 ${
										getPrecipitationDetails(hourlyForecast[0].pop).bgColor
									}`}
								>
									<div className='flex items-center gap-2'>
										{React.createElement(
											getPrecipitationDetails(hourlyForecast[0].pop).icon,
											{
												className: `h-5 w-5 ${
													getPrecipitationDetails(hourlyForecast[0].pop).color
												}`,
											}
										)}
										<div className='flex flex-col'>
											<span
												className={`font-medium ${
													getPrecipitationDetails(hourlyForecast[0].pop).color
												}`}
											>
												{getPrecipitationDetails(hourlyForecast[0].pop).text}
											</span>
											<span className='text-xs text-gray-600'>
												{
													getPrecipitationDetails(hourlyForecast[0].pop)
														.intensity
												}{' '}
												precipitation
											</span>
										</div>
									</div>
								</div>
							)}
						</div>

						<div className='grid grid-cols-2 gap-x-6 gap-y-1 text-sm'>
							<span className='text-gray-500'>আর্দ্রতা</span>
							<span>{hourlyForecast[0]?.main.humidity || '--'}%</span>
							<span className='text-gray-500'>বাতাসের গতি</span>
							<span>{hourlyForecast[0]?.wind.speed || '--'} km/h</span>
							<span className='text-gray-500'>বায়ুমণ্ডলীয় চাপ</span>
							<span>{hourlyForecast[0]?.main.pressure || '--'} hPa</span>
							<span className='text-gray-500'>সূর্যোদয়</span>
							<span>{formatTime12Hour(sunrise) || '--'}</span>
							<span className='text-gray-500'>সূর্যাস্ত</span>
							<span>{formatTime12Hour(sunset) || '--'}</span>
						</div>
					</div>
				</div>
			</div>

			{/* Enhanced Hourly Forecast Section */}
			<div className='overflow-x-auto '>
				<div className='inline-flex w-[270px] gap-2 pb-2'>
					{hourlyForecast.map((hour: any, index: number) => {
						const weather = hour.weather[0];
						const precipDetails = getPrecipitationDetails(hour.pop);
						return (
							<div
								key={index}
								className={`rounded-lg p-3 min-w-[100px] md:min-w-[120px] ${precipDetails.bgColor}`}
							>
								<span className='text-xs md:text-sm text-center  text-gray-500 mb-2 block'>
									{formatTime12Hour(hour.dt_txt)}
								</span>
								<div className='flex flex-col items-center gap-2'>
									<span className='text-sm md:text-base font-medium'>
										{formatTemperature(hour.main.temp)}
									</span>
									<div className='flex items-center gap-1'>
										{React.createElement(precipDetails.icon, {
											className: `h-4 w-4 ${precipDetails.color}`,
										})}
										<span className={`text-xs ${precipDetails.color}`}>
											Rain {Math.round(hour.pop * 100)}%
										</span>
									</div>
									{hour.pop > 0 && (
										<span className='text-xs text-gray-600'>
											{precipDetails.intensity}
										</span>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

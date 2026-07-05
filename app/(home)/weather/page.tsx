'use client';

import { useEffect, useState } from 'react';
import { CurrentWeather } from '@/components/pages/weather/current-weather';
import { WeatherForecast } from '@/components/pages/weather/forecast';
import { WeatherOverview } from '@/components/pages/weather/overview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function WeatherPage() {
	const [error, setError] = useState('');
	const [weatherdata, setWeatherdata] = useState(null);
	const [location, setLocation] = useState('');

	// Automatically fetch weather data based on user location
	useEffect(() => {
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
							setError(data.error || 'Failed to fetch weather data');
						}
					} catch {
						setError(
							'An error occurred while fetching location-based weather data'
						);
					}
				},
				(error) => {
					console.error('Error getting location:', error);
					setError('Unable to retrieve location. Please search manually.');
				}
			);
		} else {
			setError('Geolocation is not supported by your browser.');
		}
	}, []);

	// Handle search input change
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLocation(e.target.value);
	};

	// Fetch weather data based on user search
	const handleSearch = async () => {
		if (!location) {
			setError('Please enter a location');
			return;
		}
		try {
			const response = await fetch(
				`/api/weather?location=${encodeURIComponent(location)}`
			);
			const data = await response.json();
			if (response.ok) {
				setWeatherdata(data);
				setError('');
			} else {
				setError(data.error || 'Failed to fetch weather data');
			}
		} catch {
			setError('An error occurred while fetching the data');
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50 text-gray-900 p-4 md:p-6'>
			<div className='container mx-auto p-4 mb-8 mt-4'>
				<div className='flex flex-col items-center mb-8'>
					<div className='bg-green-100/60 p-3 rounded-full mb-3 shadow-sm'>
						<svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
						</svg>
					</div>
					<h1 className='text-4xl font-extrabold text-gray-900 text-center drop-shadow-sm'>
						আবহাওয়া অনুসন্ধান
					</h1>
				</div>
				<div className='flex flex-col sm:flex-row gap-3 w-full max-w-2xl mx-auto'>
					<div className='relative flex-grow group shadow-sm hover:shadow-md transition-shadow duration-300 rounded-full'>
						<Input
							type='text'
							placeholder='শহরের নাম লিখুন'
							className='w-full pl-6 pr-12 py-6 rounded-full border-gray-200 focus:ring-2 focus:ring-green-400/30 focus:border-green-400 bg-white/80 backdrop-blur-sm text-lg'
							value={location}
							onChange={handleSearchChange}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									handleSearch();
								}
							}}
						/>
					</div>
					<Button 
						className='w-full sm:w-auto px-8 py-6 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-bold text-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95 border-0' 
						onClick={handleSearch}
					>
						<Search className='mr-2 h-5 w-5' /> অনুসন্ধান
					</Button>
				</div>
			</div>

			{/* Display error or weather data */}
			{error && (
				<div className='max-w-2xl mx-auto mt-4 bg-red-50 text-red-600 p-4 rounded-2xl text-center border border-red-100 shadow-sm'>
					{error}
				</div>
			)}

			{weatherdata && (
				<div className='max-w-7xl mx-auto space-y-6'>
					<div className='grid lg:grid-cols-3 gap-6'>
						<div className='lg:col-span-2 space-y-6'>
							<CurrentWeather data={weatherdata} />
							<WeatherOverview data={weatherdata} />
						</div>
						<div className='space-y-6'>
							<WeatherForecast data={weatherdata} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

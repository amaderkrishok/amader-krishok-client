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
		<div className='min-h-screen bg-white text-gray-900 p-4 md:p-6'>
			<div className='container mx-auto p-4'>
				<h1 className='text-3xl font-bold mb-6 text-center'>
					আবহাওয়া অনুসন্ধান
				</h1>
				<div className='flex flex-col sm:flex-row gap-4 w-full max-w-3xl mx-auto'>
					<Input
						type='text'
						placeholder='শহরের নাম লিখুন'
						className='flex-grow'
						value={location}
						onChange={handleSearchChange}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								handleSearch();
							}
						}}
					/>
					<Button className='w-full sm:w-auto' onClick={handleSearch}>
						<Search className='mr-2 h-4 w-4' /> অনুসন্ধান করুন
					</Button>
				</div>
			</div>

			{/* Display error or weather data */}
			{error && <div className='text-red-500 text-center'>{error}</div>}

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

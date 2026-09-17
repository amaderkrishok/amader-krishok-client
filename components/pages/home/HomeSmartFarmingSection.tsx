'use client';

import { useEffect, useState } from 'react';
import { SmartFarmingRecommendations } from '@/components/pages/weather/smart-farming-recommendations';

export function HomeSmartFarmingSection() {
	const [weatherData, setWeatherData] = useState<any>(null);

	useEffect(() => {
		let isMounted = true;

		const fetchWeather = async () => {
			try {
				if ('geolocation' in navigator) {
					navigator.geolocation.getCurrentPosition(
						async (position) => {
							const { latitude, longitude } = position.coords;
							try {
								const res = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
								if (res.ok) {
									const data = await res.json();
									if (isMounted) setWeatherData(data);
									return;
								}
							} catch {}
							if (isMounted) fetchDefaultCityWeather();
						},
						() => {
							if (isMounted) fetchDefaultCityWeather();
						}
					);
				} else {
					if (isMounted) fetchDefaultCityWeather();
				}
			} catch {
				if (isMounted) fetchDefaultCityWeather();
			}
		};

		const fetchDefaultCityWeather = async () => {
			try {
				const res = await fetch('/api/weather?location=Dhaka');
				if (res.ok) {
					const data = await res.json();
					if (isMounted) setWeatherData(data);
				}
			} catch {}
		};

		fetchWeather();

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<section className='w-full px-4 sm:px-6 lg:px-8 xl:px-20 2xl:px-12 py-12 sm:py-16 bg-[#FAF9F3] border-b border-gray-200/60'>
			<div className='max-w-7xl mx-auto'>
				<SmartFarmingRecommendations data={weatherData} />
			</div>
		</section>
	);
}

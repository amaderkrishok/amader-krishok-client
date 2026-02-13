// File: /pages/api/weather.js

import { NextResponse } from 'next/server';

export async function GET(req: any) {
	const searchParams = req.nextUrl.searchParams;
	const location = searchParams.get('location');
	const lat = searchParams.get('lat');
	const lon = searchParams.get('lon');

	const apiKey = process.env.OPENWEATHERAPIKEY;

	try {
		let finalLat, finalLon, cityName, stateName;

		if (lat && lon) {
			// If latitude and longitude are provided, use them directly
			finalLat = lat;
			finalLon = lon;
		} else if (location) {
			// If a location name is provided, fetch its coordinates
			const geoResponse = await fetch(
				`http://api.openweathermap.org/geo/1.0/direct?q=${location}&country=BD&limit=1&appid=${apiKey}`
			);

			if (!geoResponse.ok) throw new Error('Failed to fetch geographic data');

			const geoData = await geoResponse.json();

			if (!geoData.length) {
				return NextResponse.json(
					{ error: 'Location not found' },
					{ status: 404 }
				);
			}

			({
				lat: finalLat,
				lon: finalLon,
				name: cityName,
				state: stateName,
			} = geoData[0]);
		} else {
			// No valid location or coordinates provided
			return NextResponse.json(
				{ error: 'Either location or latitude/longitude is required' },
				{ status: 400 }
			);
		}

		// Fetch weather data using the final lat & lon
		const weatherResponse = await fetch(
			`http://api.openweathermap.org/data/2.5/forecast?lat=${finalLat}&lon=${finalLon}&appid=${apiKey}`
		);

		if (!weatherResponse.ok) throw new Error('Failed to fetch weather data');

		const weatherData = await weatherResponse.json();

		// Return the weather data with search location details
		return NextResponse.json(
			{
				...weatherData,
				searchLocation: {
					lat: finalLat,
					lon: finalLon,
					name: cityName || 'Unknown',
					state: stateName || 'Unknown',
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		);
	}
}

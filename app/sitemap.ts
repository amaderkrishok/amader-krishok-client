import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amaderkrishok.com';
	const currentDate = new Date();

	return [
		{
			url: baseUrl,
			lastModified: currentDate,
			changeFrequency: 'daily',
			priority: 1.0,
		},
		{
			url: `${baseUrl}/marketplace`,
			lastModified: currentDate,
			changeFrequency: 'daily',
			priority: 0.9,
		},
		{
			url: `${baseUrl}/crop-cultivation`,
			lastModified: currentDate,
			changeFrequency: 'daily',
			priority: 0.9,
		},
		{
			url: `${baseUrl}/crop-calculator`,
			lastModified: currentDate,
			changeFrequency: 'weekly',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/weather`,
			lastModified: currentDate,
			changeFrequency: 'daily',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/post`,
			lastModified: currentDate,
			changeFrequency: 'daily',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/about`,
			lastModified: currentDate,
			changeFrequency: 'monthly',
			priority: 0.6,
		},
		{
			url: `${baseUrl}/register`,
			lastModified: currentDate,
			changeFrequency: 'monthly',
			priority: 0.5,
		},
		{
			url: `${baseUrl}/privacy-policy`,
			lastModified: currentDate,
			changeFrequency: 'monthly',
			priority: 0.3,
		},
		{
			url: `${baseUrl}/terms-and-conditions`,
			lastModified: currentDate,
			changeFrequency: 'monthly',
			priority: 0.3,
		},
	];
}


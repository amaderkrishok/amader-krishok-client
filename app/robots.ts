import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amaderkrishok.com';

	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/admin/', '/api/', '/user/', '/vendor/', '/session/'],
		},
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}


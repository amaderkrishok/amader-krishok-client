import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/admin/', '/api/','/user/', '/vendor/', '/session/'],
		},
		sitemap: 'https://www.amaderkrishok.com/sitemap.xml',
	};
}



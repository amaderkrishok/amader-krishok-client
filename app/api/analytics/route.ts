import { NextRequest, NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { getSession } from '@/lib/utils/session';
import { UserRole } from '@/routes';

const GA4_PROPERTY_ID = '498007086';

function getDateRange(range: string | null | undefined) {
	switch (range) {
		case '7d':
			return { startDate: '7daysAgo', endDate: 'today' };
		case '30d':
			return { startDate: '30daysAgo', endDate: 'today' };
		case '90d':
			return { startDate: '90daysAgo', endDate: 'today' };
		default:
			return { startDate: '7daysAgo', endDate: 'today' };
	}
}

export async function GET(req: NextRequest) {
	// Restrict to admin users only
	const session = await getSession();
	if (!session || !session.user || session.user.role !== UserRole.ADMIN) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}

	const { searchParams } = new URL(req.url);
	const report = searchParams.get('report') || 'summary';
	const range = searchParams.get('range') || '7d';
	const dateRange = getDateRange(range);

	const analyticsDataClient = new BetaAnalyticsDataClient();

	try {
		let response;
		switch (report) {
			case 'summary': {
				// Main summary metrics
				[response] = await analyticsDataClient.runReport({
					property: `properties/${GA4_PROPERTY_ID}`,
					dateRanges: [dateRange],
					metrics: [
						{ name: 'activeUsers' },
						{ name: 'sessions' },
						{ name: 'screenPageViews' },
						{ name: 'bounceRate' },
						{ name: 'averageSessionDuration' },
					],
				});
				break;
			}
			case 'devices': {
				// Device breakdown by date
				[response] = await analyticsDataClient.runReport({
					property: `properties/${GA4_PROPERTY_ID}`,
					dateRanges: [dateRange],
					dimensions: [
						{ name: 'date' },
						{ name: 'deviceCategory' },
					],
					metrics: [
						{ name: 'activeUsers' },
						{ name: 'sessions' },
						{ name: 'screenPageViews' },
					],
					orderBys: [
						{ dimension: { dimensionName: 'date' }, desc: false },
					],
				});
				break;
			}
			case 'top-pages': {
				// Top pages
				[response] = await analyticsDataClient.runReport({
					property: `properties/${GA4_PROPERTY_ID}`,
					dateRanges: [dateRange],
					dimensions: [{ name: 'pagePath' }],
					metrics: [
						{ name: 'screenPageViews' },
						{ name: 'activeUsers' },
						{ name: 'averageSessionDuration' },
					],
					orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
					limit: 10,
				});
				break;
			}
			case 'geo': {
				// Geo breakdown
				[response] = await analyticsDataClient.runReport({
					property: `properties/${GA4_PROPERTY_ID}`,
					dateRanges: [dateRange],
					dimensions: [{ name: 'country' }],
					metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
					orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
					limit: 10,
				});
				break;
			}
			case 'sources': {
				// Traffic sources
				[response] = await analyticsDataClient.runReport({
					property: `properties/${GA4_PROPERTY_ID}`,
					dateRanges: [dateRange],
					dimensions: [{ name: 'sessionSourceMedium' }],
					metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
					orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
					limit: 10,
				});
				break;
			}
			case 'demographics': {
				// Demographics (age, gender)
				[response] = await analyticsDataClient.runReport({
					property: `properties/${GA4_PROPERTY_ID}`,
					dateRanges: [dateRange],
					dimensions: [{ name: 'userAgeBracket' }, { name: 'userGender' }],
					metrics: [{ name: 'activeUsers' }],
				});
				break;
			}
			default: {
				return NextResponse.json(
					{ error: 'Unknown report type' },
					{ status: 400 }
				);
			}
		}
		return NextResponse.json({
			rows: response.rows || [],
			totals: response.totals || [],
			dimensionHeaders: response.dimensionHeaders || [],
			metricHeaders: response.metricHeaders || [],
		});
	} catch (error) {
		console.error('Analytics API error:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch analytics data.' },
			{ status: 500 }
		);
	}
}

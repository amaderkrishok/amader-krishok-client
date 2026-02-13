import { NextRequest, NextResponse } from 'next/server';

/**
 * 🏥 Frontend Health Check API Route
 *
 * This endpoint is used by Docker health checks to verify that the Next.js
 * frontend application is running and responsive.
 *
 * Docker health check command: curl -f http://localhost:3000/api/health
 */

export async function GET(request: NextRequest) {
	try {
		// Basic health check information
		const healthData = {
			status: 'ok',
			timestamp: new Date().toISOString(),
			service: 'amader-krishok-frontend',
			version: process.env.npm_package_version || '1.0.0',
			environment: process.env.NODE_ENV || 'development',
			uptime: process.uptime(),
			memory: {
				used:
					Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) /
					100,
				total:
					Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) /
					100,
				limit:
					Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
			},
			backend: {
				url: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
				configured: !!process.env.NEXT_PUBLIC_BACKEND_URL,
			},
		};

		// Optional: Check backend connectivity (non-blocking)
		let backendStatus = 'unknown';
		try {
			const backendUrl =
				process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
			if (backendUrl) {
				// Quick backend health check with timeout
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

				const backendResponse = await fetch(`${backendUrl}/health`, {
					method: 'GET',
					signal: controller.signal,
					headers: {
						'User-Agent': 'frontend-health-check',
					},
				});

				clearTimeout(timeoutId);
				backendStatus = backendResponse.ok ? 'healthy' : 'unhealthy';
			}
		} catch (error) {
			// Don't fail the frontend health check if backend is down
			backendStatus = 'unreachable';
		}

		const response = {
			statusCode: 200,
			message: 'Frontend is healthy',
			data: {
				...healthData,
				backend: {
					...healthData.backend,
					status: backendStatus,
				},
			},
		};

		return NextResponse.json(response, {
			status: 200,
			headers: {
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				Pragma: 'no-cache',
				Expires: '0',
			},
		});
	} catch (error) {
		// If something goes wrong, still return a response but with error status
		const errorResponse = {
			statusCode: 500,
			message: 'Frontend health check failed',
			data: {
				status: 'error',
				timestamp: new Date().toISOString(),
				service: 'amader-krishok-frontend',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
		};

		return NextResponse.json(errorResponse, {
			status: 500,
			headers: {
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				Pragma: 'no-cache',
				Expires: '0',
			},
		});
	}
}

/**
 * Handle HEAD requests for simple health checks
 * Some health checkers prefer HEAD requests for minimal overhead
 */
export async function HEAD() {
	return new NextResponse(null, {
		status: 200,
		headers: {
			'Cache-Control': 'no-cache, no-store, must-revalidate',
			Pragma: 'no-cache',
			Expires: '0',
		},
	});
}

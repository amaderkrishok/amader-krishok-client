'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/components/providers/session-provider';

type Role = 'admin' | 'user' | 'moderator' | 'vendor';

interface WithRoleAccessProps {
	allowedRoles: Role[];
	redirectTo?: string;
	children: React.ReactNode;
}

export function WithRoleAccess({
	allowedRoles,
	redirectTo = '/unauthorized',
	children,
}: WithRoleAccessProps) {
	const { data: session, status } = useSession();
	const router = useRouter();
	const userRole = session?.user?.role as Role | undefined;

	useEffect(() => {
		// Only check roles after authentication status is determined
		if (status === 'unauthenticated') {
			router.push('/auth/login');
			return;
		}

		if (status === 'authenticated' && userRole) {
			const hasAccess = allowedRoles.includes(userRole);
			if (!hasAccess) {
				console.log(
					`Access denied: User role '${userRole}' not in allowed roles: [${allowedRoles.join(
						', '
					)}]`
				);
				router.push(redirectTo);
			}
		}
	}, [status, userRole, allowedRoles, router, redirectTo]);

	// Show loading while checking authentication
	if (status === 'loading') {
		return (
			<div className='flex h-screen items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto'></div>
					<p className='mt-2'>Loading...</p>
				</div>
			</div>
		);
	}

	// Show nothing while redirecting for unauthorized users
	if (
		status === 'authenticated' &&
		userRole &&
		!allowedRoles.includes(userRole)
	) {
		return null;
	}

	// Show content for authorized users
	return <>{children}</>;
}

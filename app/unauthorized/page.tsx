'use client';

import Link from 'next/link';
import { useSession } from '@/components/providers/session-provider';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ShieldXIcon } from 'lucide-react';

export default function UnauthorizedPage() {
	const { data: session } = useSession();

	// Determine redirect based on role
	// Determine redirect based on role
	let redirectTargetRole = '/'; // default redirect to homepage

	if (session?.user?.role) {
		// Role-based redirects
		switch (session.user.role) {
			case 'admin':
				redirectTargetRole = '/admin/dashboard';
				break;
			case 'vendor':
				redirectTargetRole = '/vendor/dashboard';
				break;
			case 'mod':
				redirectTargetRole = '/moderator/dashboard';
				break;
			case 'user':
				redirectTargetRole = '/user';
				break;
			// Add other roles as needed
		}
	}


	return (
		<div className='flex h-screen flex-col items-center justify-center p-4 text-center'>
			<div className='max-w-md space-y-6'>
				<ShieldXIcon className='mx-auto h-20 w-20 text-red-500' />
				<h1 className='text-3xl font-bold'>Access Denied</h1>

				<div className='text-muted-foreground'>
					<p className='mb-2'>
						You don&apos;t have permission to access this page.
					</p>
					{session?.user?.role && (
						<p className='font-medium'>
							Your current role:{' '}
							<span className='font-bold'>{session.user.role}</span>
						</p>
					)}
				</div>

				<div className='flex flex-col gap-2 pt-4 sm:flex-row sm:justify-center'>
					<Button asChild variant='default'>
						<Link href={redirectTargetRole}>
							<ArrowLeftIcon className='mr-2 h-4 w-4' />
							Back to Dashboard
						</Link>
					</Button>

					<Button asChild variant='outline'>
						<Link href='/'>Go to Home</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}

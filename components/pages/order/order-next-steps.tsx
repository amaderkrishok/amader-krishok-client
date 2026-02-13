import { useSession } from '@/components/providers/session-provider';
import { getStaticDashboardPrefixByRole } from '@/config/dashboard-navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

interface OrderNextStepsProps {
	orderId: string;
}

export function OrderNextSteps({ orderId }: OrderNextStepsProps) {
	const { isAuthenticated, user } = useSession();

	return (
		<div className='bg-gray-50 p-6 border-t'>
			<h3 className='font-medium text-gray-800 mb-2'>
				আপনার অর্ডার কীভাবে কাজ করে:
			</h3>
			<ol className='list-decimal pl-5 text-sm text-gray-600 mb-6 space-y-1'>
				<li>দোকানকে অর্ডারটি নিশ্চিত করতে হবে</li>
				<li>নিশ্চিত হওয়ার পরে পণ্য প্যাকেজিং করা হবে</li>
				<li>আপনার প্রদত্ত ঠিকানায় ডেলিভারি করা হবে</li>
				<li>আপনি আপনার পণ্য পেয়ে গেলে অর্ডার সম্পূর্ণ হবে</li>
			</ol>

			<div className='flex flex-wrap gap-4'>
				<Button asChild>
					<Link href='/marketplace'>অন্য পণ্য কিনুন</Link>
				</Button>
				{isAuthenticated && (
					<Button variant='outline' asChild>
						<Link
							href={`${getStaticDashboardPrefixByRole(
								user?.role
							)}/account/orders/${orderId}`}
						>
							আপনার অর্ডার ট্র্যাক করুন
						</Link>
					</Button>
				)}
			</div>
		</div>
	);
}

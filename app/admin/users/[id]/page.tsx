import { UserProfile } from '@/components/dashbaord/users/user-profile';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'User Profile',
	description: 'View and manage user profile',
};

export default function UserProfilePage({
	params,
}: {
	params: { id: string };
}) {
	return (
		<div className='p-6 space-y-6 w-full mx-auto'>
			<UserProfile userId={params.id} />
		</div>
	);
}

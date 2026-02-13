import { UserDashboard } from '@/components/dashbaord/users/user-dashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'User Management',
	description: 'Manage your users and their permissions',
};

export default function UsersPage() {
	return (
		<div className='p-6 space-y-6 w-full mx-auto'>
			<UserDashboard />
		</div>
	);
}

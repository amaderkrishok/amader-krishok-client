import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { DashboardHeader } from '@/components/user-dashboard/dashboard-header';
import { UserProfileForm } from '@/components/ui/user/user-profile-form';
import { PasswordForm } from '@/components/ui/user/user-password-chnage-form';

export default function ProfilePage() {
	return (
		<>
			<DashboardHeader
				heading='Profile Settings'
				text='Manage your account settings and change your password'
			/>

			<div className='mt-6'>
				<Tabs defaultValue='profile' className='w-full'>
					<TabsList className='grid w-full grid-cols-2 mb-6'>
						<TabsTrigger value='profile'>Profile Information</TabsTrigger>
						<TabsTrigger value='password'>Password</TabsTrigger>
					</TabsList>

					<TabsContent value='profile'>
						<Card className='p-6'>
							<UserProfileForm />
						</Card>
					</TabsContent>

					<TabsContent value='password'>
						<Card className='p-6'>
							<PasswordForm />
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</>
	);
}

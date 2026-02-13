import { UserOnly } from '@/components/auth/protected/protected-page';
import { DashboardShell } from '@/components/user-dashboard/dashboard-shell';

export default function DashboardPage({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='h-screen overflow-hidden'>
			<UserOnly>
				<DashboardShell>{children}</DashboardShell>
			</UserOnly>
		</div>
	);
}

import { UserOnly } from '@/components/auth/protected/protected-page';
import { DashboardShell } from '@/components/user-dashboard/dashboard-shell';

export default function DashboardPage({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='min-h-screen bg-[#F7F6F0]'>
			<UserOnly>
				<DashboardShell>{children}</DashboardShell>
			</UserOnly>
		</div>
	);
}

import { CreateTicketButton } from '@/components/user-dashboard/create-ticket-button';
import { DashboardHeader } from '@/components/user-dashboard/dashboard-header';
import { SupportTickets } from '@/components/user-dashboard/support-tickets';

export default function SupportPage() {
	return (
		<>
			<DashboardHeader
				heading='Support Tickets'
				text='Create and manage your support requests'
			>
				<CreateTicketButton />
			</DashboardHeader>
			<div className='mt-6'>
				<SupportTickets />
			</div>
		</>
	);
}

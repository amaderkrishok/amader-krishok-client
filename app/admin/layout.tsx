import React from 'react';
import { Separator } from '@/components/ui/separator';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { DashboardThemeProvider } from '@/components/dashbaord/wrappers/dashboard-theme-provider';
import { AppSidebar } from '@/components/dashbaord/sidebar-componenets/app-sidebar';
import SiteBreadcrumb from '@/components/dashbaord/sidebar-componenets/site-breadcrumb';
import { ModeToggle } from '@/components/dashbaord/sidebar-componenets/theme-toggle';
import { AdminOnly } from '@/components/auth/protected/protected-page';

type Props = {
	children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
	return (
		<AdminOnly>
			<DashboardThemeProvider
				attribute='class'
				defaultTheme='system'
				enableSystem
				disableTransitionOnChange
			>
				<SidebarProvider>
					<AppSidebar />
					<SidebarInset className='bg-[#F7F6F0] min-h-screen w-full flex-1 border-0'>
						<header className='flex h-16 shrink-0 items-center justify-between px-6 gap-2 bg-white border-b border-[#E5E7EB] sticky top-0 z-30 shadow-xs'>
							<div className='flex items-center gap-3'>
								<SidebarTrigger className='-ml-1 text-[#172033] hover:bg-[#F7F6F0]' />
								<Separator orientation='vertical' className='mr-2 h-4 bg-[#E5E7EB]' />
								<SiteBreadcrumb />
							</div>
							<div className='flex items-center gap-3'>
								<ModeToggle />
							</div>
						</header>
						<div className='w-full min-h-[calc(100vh-64px)] bg-[#F7F6F0] p-6'>
							{children}
						</div>
					</SidebarInset>
				</SidebarProvider>
			</DashboardThemeProvider>
		</AdminOnly>
	);
};

export default Layout;

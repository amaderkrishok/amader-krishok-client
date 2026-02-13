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
	children: React.ReactNode; // Corrected prop name
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
					<SidebarInset>
						<header className='flex h-16 shrink-0 items-center justify-between px-4 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
							<div className='flex items-center gap-2 px-4'>
								<SidebarTrigger className='-ml-1' />
								<Separator orientation='vertical' className='mr-2 h-4' />
								<SiteBreadcrumb />
							</div>
							<ModeToggle />
						</header>
						{children}
					</SidebarInset>
				</SidebarProvider>
			</DashboardThemeProvider>
		</AdminOnly>
	);
};

export default Layout;

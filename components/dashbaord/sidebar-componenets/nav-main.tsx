'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}) {
	const pathname = usePathname();

	return (
		<SidebarGroup className='py-2 px-0'>
			<SidebarMenu className='space-y-1.5'>
				{items.map((item) => {
					const isActive =
						pathname === item.url ||
						(item.url !== '/vendor/dashboard' &&
							item.url !== '#' &&
							pathname.startsWith(item.url));

					return (
						<Collapsible
							key={item.title}
							asChild
							defaultOpen={isActive || item.isActive}
							className='group/collapsible'
						>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton
										tooltip={item.title}
										className={`w-full px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
											isActive
												? 'bg-white text-[#172033] font-extrabold shadow-xs'
												: 'text-white/85 hover:text-white hover:bg-white/10 font-bold'
										}`}
									>
										{item.icon && (
											<item.icon
												className={`h-4.5 w-4.5 transition-colors ${
													isActive ? 'text-[#F5B800]' : 'text-white/80 group-hover:text-[#F5B800]'
												}`}
											/>
										)}
										<Link href={item.url} className='flex-1 truncate'>
											<span className='text-xs sm:text-sm'>{item.title}</span>
										</Link>
										{isActive && (
											<span className='w-2 h-2 rounded-full bg-[#F5B800] shadow-xs flex-shrink-0' />
										)}
										{(item.items?.length ?? 0) > 0 && (
											<ChevronRight className='ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-white/70' />
										)}
									</SidebarMenuButton>
								</CollapsibleTrigger>

								{/* HIGH CONTRAST SUB-MENU DROPDOWN */}
								{item.items && item.items.length > 0 && (
									<CollapsibleContent>
										<SidebarMenuSub className='space-y-1 pt-1.5 pb-1 border-l border-white/20 ml-4 pl-3'>
											{item.items.map((subItem) => {
												const isSubActive = pathname === subItem.url;
												return (
													<SidebarMenuSubItem key={subItem.title}>
														<Link
															href={subItem.url}
															className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200 ${
																isSubActive
																	? 'text-[#F5B800] bg-white/15 border-l-2 border-[#F5B800] shadow-xs'
																	: 'text-white/90 hover:text-[#F5B800] hover:bg-white/10'
															}`}
														>
															<span className='w-1.5 h-1.5 rounded-full bg-current opacity-70' />
															<span>{subItem.title}</span>
														</Link>
													</SidebarMenuSubItem>
												);
											})}
										</SidebarMenuSub>
									</CollapsibleContent>
								)}
							</SidebarMenuItem>
						</Collapsible>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}

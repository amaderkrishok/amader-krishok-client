import {
	Bot,
	CalculatorIcon,
	ChartNoAxesCombined,
	Settings2,
	WheatIcon,
	Users,
	Store,
	ShoppingBag,
	LayoutDashboard,
	LucideIcon,
	BadgeDollarSign,
	ShoppingBasketIcon,
	FileCheck,
	MessageSquare,
	MessageCircleMoreIcon,
} from 'lucide-react';

// Shared types
export type NavItem = {
	title: string;
	url: string;
	icon: LucideIcon; // LucideIcon type
	isActive?: boolean;
	items?: {
		title: string;
		url: string;
	}[];
};

// Admin has full access to everything
export const adminNavigation: NavItem[] = [
	{
		title: 'Dashboard',
		url: '/admin/dashboard',
		icon: LayoutDashboard,
		isActive: true,
	},
	{
		title: 'Posts Management',
		url: '/admin/posts',
		icon: FileCheck,
		items: [
			{
				title: 'All Posts',
				url: '/admin/posts',
			},
			{
				title: 'All Post Category',
				url: '/admin/posts/posts-category',
			},
		],
	},
	{
		title: 'Subscription Management',
		url: '/admin/subscription-plans',
		icon: BadgeDollarSign,
	},
	{
		title: 'Product Category',
		url: '/admin/product-category',
		icon: ShoppingBasketIcon,
		items: [
			{
				title: 'Add Product Category',
				url: '/admin/product-category',
			},
			{
				title: 'Modify Product Category',
				url: '/admin/product-category',
			},
		],
	},
	{
		title: 'Shops Management',
		url: '/admin/shops',
		icon: ShoppingBasketIcon,
		items: [
			{
				title: 'Modify Shops',
				url: '/admin/shops',
			},
			{
				title: 'Shop Categories',
				url: '/admin/store-categories',
			},
			{
				title: 'Modify Shop Products',
				url: '/admin/shops/products',
			},
		],
	},
	{
		title: 'Crop Listing',
		url: '#',
		icon: WheatIcon,
		items: [
			{
				title: 'Add Crop item',
				url: '/admin/crop/add-crop',
			},
			{
				title: 'Manage Crop item',
				url: '/admin/crop',
			},
		],
	},
	{
		title: 'Fertilizer Calculator',
		url: '/admin/fertilizer',
		icon: CalculatorIcon,
		items: [
			{
				title: 'All Crop Calculation',
				url: '/admin/fertilizer',
			},
			{
				title: 'Add Crop Calculation',
				url: '/admin/fertilizer',
			},
		],
	},
	{
		title: 'Manage Users',
		url: '/admin/users',
		icon: Users,
		items: [
			{
				title: 'All Users',
				url: '/admin/users',
			},
		],
	},
	{
		title: 'Settings',
		url: '/admin/account',
		icon: Settings2,
	},
	{
		title: 'Site Analysis',
		url: '/dashboard/site-analysis',
		icon: ChartNoAxesCombined,
	},
	{
		title: 'Chat System Analysis',
		url: '/admin/chat-service',
		icon: MessageCircleMoreIcon,
	},
];

// Moderator navigation (exclude some admin-only features)
export const moderatorNavigation: NavItem[] = [
	{
		title: 'Dashboard',
		url: '/dashboard',
		icon: LayoutDashboard,
		isActive: true,
	},
	{
		title: 'Crop Listing',
		url: '#',
		icon: WheatIcon,
		items: [
			{
				title: 'Add Crop item',
				url: '/dashboard/crop/add-crop',
			},
			{
				title: 'Manage Crop item',
				url: '/dashboard/crop',
			},
		],
	},
	{
		title: 'Fertilizer Calculator',
		url: '#',
		icon: CalculatorIcon,
		items: [
			{
				title: 'All Crop Calculation',
				url: '/dashboard/fertilizer-calculator',
			},
			{
				title: 'Add Crop Calculation',
				url: '/dashboard/fertilizer-calculator/add',
			},
		],
	},
	{
		title: 'Weather Forecast App',
		url: '#',
		icon: Bot,
		items: [
			{
				title: 'View Analytics',
				url: '/dashboard/weather-app-analytics',
			},
		],
	},
	{
		title: 'Settings',
		url: '#',
		icon: Settings2,
		items: [
			{
				title: 'Account',
				url: '/dashboard/account',
			},
		],
	},
];

// Vendor navigation (vendor-specific features)
export const vendorNavigation: NavItem[] = [
	{
		title: 'Dashboard',
		url: '/vendor/dashboard',
		icon: LayoutDashboard,
		isActive: true,
	},
	{
		title: 'My Store',
		url: '/vendor/store',
		icon: Store,
	},
	{
		title: 'Products',
		url: '/vendor/products',
		icon: ShoppingBag,
		items: [
			{
				title: 'Add Product',
				url: '/vendor/products/create',
			},
			{
				title: 'My Products',
				url: '/vendor/products',
			},
		],
	},
	{
		title: 'Customer Messages',
		url: '/vendor/chat',
		icon: MessageSquare,
		// Add a notification badge if there are unread messages
		// badge: unreadMessageCount > 0 ? unreadMessageCount : undefined,
	},
	{
		title: 'Orders',
		url: '/vendor/orders',
		icon: ShoppingBag,
	},
	{
		title: 'Settings',
		url: '/vendor/account',
		icon: Settings2,
	},
];

// User navigation (very different from admin/moderator/vendor)
export const userNavigation: NavItem[] = [
	{
		title: 'My Dashboard',
		url: '/user/dashboard',
		icon: LayoutDashboard,
		isActive: true,
	},
	{
		title: 'Crop Guide',
		url: '/user/crops',
		icon: WheatIcon,
	},
	{
		title: 'Fertilizer Calculator',
		url: '/user/calculator',
		icon: CalculatorIcon,
	},
	{
		title: 'Weather',
		url: '/user/weather',
		icon: Bot,
	},
	{
		title: 'My Orders',
		url: '/user/orders',
		icon: ShoppingBag,
	},
	{
		title: 'Settings',
		url: '/user/settings',
		icon: Settings2,
	},
];

// Helper function to get navigation based on role
export function getNavigationByRole(role: string): NavItem[] {
	switch (role?.toLowerCase()) {
		case 'admin':
			return adminNavigation;
		case 'moderator':
			return moderatorNavigation;
		case 'vendor':
			return vendorNavigation;
		case 'user':
			return userNavigation;
		default:
			return userNavigation; // Default to user navigation
	}
}

/**
 * Returns the appropriate dashboard prefix route based on a provided role
 * Can be used in server components where useSession is not available
 *
 * @param {string | undefined} role - The user role
 * @returns {string} Dashboard prefix route (/admin, /moderator, /vendor, or / for users)
 */
export function getStaticDashboardPrefixByRole(role?: string): string {
	if (!role) return '/';

	switch (role.toLowerCase()) {
		case 'admin':
			return '/admin';
		case 'moderator':
			return '/moderator';
		case 'vendor':
			return '/vendor';
		case 'user':
		default:
			return '/';
	}
}

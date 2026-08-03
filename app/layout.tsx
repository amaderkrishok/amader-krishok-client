import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { SessionProvider } from '@/components/providers/session-provider';
import { SavedProductsProvider } from '@/context/saved-products-context';
import { CartProvider } from '@/context/cart-context';
import { CartDrawer } from '@/components/pages/marketplace/cart/cart-drawer';
import { FloatingCartButton } from '@/components/pages/marketplace/cart/floating-cart-button';
import { Toaster } from 'sonner';
import TopLoadingBar from '@/components/global/top-loading-bar';
import { Suspense } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});

export const metadata: Metadata = {
	metadataBase: new URL('https://www.amaderkrishok.com'),
	title: {
		default: 'Amader Krishok - আমাদের কৃষক | বাংলাদেশের অনলাইন কৃষি বাজার',
		template: '%s | Amader Krishok',
	},
	description: 'কোনো মধ্যস্বত্বভোগী নেই। বাংলাদেশের ৪২টি জেলার যাচাইকৃত কৃষকদের সরাসরি প্রোফাইল ঘুরে দেখুন, কথা বলুন এবং খাঁটি কৃষিপণ্য কিনুন।',
	keywords: [
		'Amader Krishok',
		'আমাদের কৃষক',
		'কৃষক',
		'কৃষি বাজার',
		'অর্গানিক সবজি',
		'Bangladesh Farmers',
		'Fresh Vegetables Bangladesh',
		'Direct Farmers Marketplace',
	],
	authors: [{ name: 'Amader Krishok' }],
	creator: 'Amader Krishok',
	publisher: 'Amader Krishok',
	icons: {
		icon: '/static/favicon.ico',
		shortcut: '/static/favicon.ico',
		apple: '/static/favicon.ico',
	},
	openGraph: {
		title: 'Amader Krishok - আমাদের কৃষক',
		description: 'কোনো মধ্যস্বত্বভোগী নেই। সরাসরি যাচাইকৃত কৃষকদের কাছ থেকে তাজা ও অর্গানিক কৃষিপণ্য কিনুন।',
		url: 'https://www.amaderkrishok.com',
		siteName: 'Amader Krishok',
		locale: 'bn_BD',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Amader Krishok - আমাদের কৃষক',
		description: 'কোনো মধ্যস্বত্বভোগী নেই। সরাসরি যাচাইকৃত কৃষকদের কাছ থেকে তাজা ও অর্গানিক কৃষিপণ্য কিনুন।',
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<TopLoadingBar />
				<SessionProvider>
					<CartProvider>
						<SavedProductsProvider>
							<Suspense>{children}</Suspense>
							<FloatingCartButton />
							<CartDrawer />
						</SavedProductsProvider>
					</CartProvider>
				</SessionProvider>
				<Toaster
					richColors
					closeButton
					visibleToasts={3}
					toastOptions={{
						duration: 3000,
					}}
				/>
				<GoogleAnalytics gaId='G-Q6DFRBRWX3' />
			</body>
		</html>
	);
}

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { SessionProvider } from '@/components/providers/session-provider'; // Import the provider
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
	title: 'আমাদের কৃষক',
	icons: {
		icon: '/static/favicon.ico', // /public path
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
					<Suspense>{children}</Suspense>
				</SessionProvider>
				<Toaster
					richColors
					closeButton
					visibleToasts={3}
					toastOptions={{
						duration: 3000,
					}}
				/>
			</body>
			<GoogleAnalytics gaId='G-Q6DFRBRWX3' />
		</html>
	);
}

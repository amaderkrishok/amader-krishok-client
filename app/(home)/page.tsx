import FeaturesSection from '@/components/pages/home/FeaturesSection';
import Goal from '@/components/pages/home/goal';
import { Hero } from '@/components/pages/home/hero';
import Mission from '@/components/pages/home/mission';
import Product from '@/components/pages/home/product';
import { CategorySection } from '@/components/pages/home/CategorySection';
import { OffersSection } from '@/components/pages/home/OffersSection';
import { VendorsSection } from '@/components/pages/home/VendorsSection';

export const dynamic = 'force-static';
export const revalidate = 3600; // Cache for 1 hour

export default function Home() {
	return (
		<div>
			{/* Premium Hero Banner */}
			<Hero />

			{/* Category Showcase Section */}
			<CategorySection />

			{/* Today's Krishok er Bazar Showcase Section */}
			<OffersSection />

			{/* Top Verified Vendors & Farms Section */}
			<VendorsSection />

			{/* Platform Core Features & Tools */}
			{/* <Mission /> */}
			<FeaturesSection />
			{/* <Goal />
			<Product /> */}
		</div>
	);
}

import BackgroundVideo from '@/components/pages/home/background-video';
import FeaturesSection from '@/components/pages/home/FeaturesSection';
import Goal from '@/components/pages/home/goal';
import { Hero } from '@/components/pages/home/hero';
import Mission from '@/components/pages/home/mission';
import Product from '@/components/pages/home/product';
import { CategorySection } from '@/components/pages/home/CategorySection';
import { OffersSection } from '@/components/pages/home/OffersSection';
import { FeaturedProductsSection } from '@/components/pages/home/FeaturedProductsSection';

export const dynamic = 'force-static';
export const revalidate = 3600; // Cache for 1 hour

export default function Home() {
	return (
		<div>
			<section className='min-h-screen relative'>
				<BackgroundVideo />
				<div className='absolute inset-0 bg-black/10 z-10'></div>
				<div className='relative z-20'>
					<Hero />
				</div>
			</section>

			{/* Category Showcase Section */}
			<CategorySection />

			{/* Today's Special Offers Section */}
			<OffersSection />

			{/* Attractive Featured Products Showcase Section */}
			<FeaturedProductsSection />

			{/* Platform Core Features & Tools */}
			<Mission />
			<FeaturesSection />
			<Goal />
			<Product />
		</div>
	);
}


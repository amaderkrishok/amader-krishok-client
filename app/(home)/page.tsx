import BackgroundVideo from '@/components/pages/home/background-video';
import FeaturesSection from '@/components/pages/home/FeaturesSection';
import Goal from '@/components/pages/home/goal';
import { Hero } from '@/components/pages/home/hero';

import Mission from '@/components/pages/home/mission';
import Product from '@/components/pages/home/product';
import { Stats } from '@/components/pages/home/stats';

export default function Home() {
	return (
		<div>
			<section className='min-h-screen relative'>
				<BackgroundVideo />
				<div className='absolute inset-0 bg-black/10 z-10'></div>
				<div className='relative z-20'>
					<Hero />
					{/* <Stats /> */}
				</div>
			</section>

			{/* Other Sections */}
			<Mission />
			<FeaturesSection />
			<Goal />
			<Product />
		</div>
	);
}

import FeaturesSection from '@/components/pages/home/FeaturesSection';
import { Hero } from '@/components/pages/home/hero';
import { CategorySection } from '@/components/pages/home/CategorySection';
import { OffersSection } from '@/components/pages/home/OffersSection';
import { CropCultivationSection } from '@/components/pages/home/CropCultivationSection';
import { HomeSmartFarmingSection } from '@/components/pages/home/HomeSmartFarmingSection';
import { VendorsSection } from '@/components/pages/home/VendorsSection';
import { TrustSection } from '@/components/pages/home/TrustSection';
import { TextRotatorSection } from '@/components/pages/home/TextRotatorSection';
import { VendorBanner } from '@/components/pages/home/vendor-banner';

export const dynamic = 'force-dynamic';

export default function Home() {
	return (
		<div className='bg-[#FAF9F3] text-[#172033]'>
			{/* 1. Agriculture Video Hero Section with Prominent Search Bar */}
			<Hero />

			{/* 2. Quick Category Section ("কী খুঁজছেন আজ?") */}
			{/* <CategorySection /> */}

			{/* 3. Featured Direct Produce Section */}
			<OffersSection />

			{/* 4. Crop Cultivation & Disease Prevention Section ("ফসল চাষ প্রক্রিয়া ও রোগবালাই") */}
			<CropCultivationSection />

			{/* 5. Smart Farming Advisory Section ("স্মার্ট কৃষি পরামর্শ") */}
			<HomeSmartFarmingSection />

			{/* 4. Trust Section ("কেন আমাদের কৃষকের বাজার?") */}
			{/* <TrustSection /> */}

			{/* 5. Verified Farmers Section ("আমাদের কৃষক") */}
			<VendorsSection />

			{/* 6. Vertical Text Rotator Banner */}
			{/* <TextRotatorSection /> */}

			{/* 7. Platform Core Features & Tools */}
			<FeaturesSection />

			{/* 8. Seller/Vendor Call-to-Action Banner */}
			<div className='w-full px-4 sm:px-6 lg:px-[10%] xl:px-[18.5%] 2xl:px-12'>
				<div className='max-w-7xl mx-auto'>
					<VendorBanner />
				</div>
			</div>
		</div>
	);
}

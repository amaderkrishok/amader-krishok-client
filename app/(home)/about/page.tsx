import React from 'react';
import type { Metadata } from 'next';
import { AboutHero } from '@/components/pages/about/about-hero';
import { AboutStats } from '@/components/pages/about/about-stats';
import { AboutMission } from '@/components/pages/about/about-mission';
import { AboutHowItWorks } from '@/components/pages/about/about-how-it-works';
import { AboutFarmers } from '@/components/pages/about/about-farmers';
import { AboutWhyUs } from '@/components/pages/about/about-why-us';
import { AboutTestimonials } from '@/components/pages/about/about-testimonials';
import { AboutCta } from '@/components/pages/about/about-cta';
import { AboutOvijogForm } from '@/components/pages/about/about-ovijog-form';

export const metadata: Metadata = {
	title: 'আমাদের সম্পর্কে | আমাদের কৃষক - কৃষকের সাথে, কৃষির পাশে',
	description: 'প্রযুক্তির মাধ্যমে কৃষক ও ক্রেতার মধ্যে তৈরি করি সহজ, স্বচ্ছ ও নির্ভরযোগ্য সংযোগ। আমাদের কৃষকের সম্পর্কে বিস্তারিত জানুন।',
};

export default function AboutPage() {
	return (
		<div className='min-h-screen bg-[#F7F9F4] text-[#1C2415] selection:bg-[#EAB308] selection:text-[#2D331F]'>
			{/* 1. HERO SECTION */}
			<AboutHero />

			{/* 2. STATS SECTION */}
			<AboutStats />

			{/* 3. OUR MISSION / VISION */}
			<AboutMission />

			{/* 4. HOW WE WORK */}
			<AboutHowItWorks />

			{/* 5. OUR FARMERS SECTION */}
			<AboutFarmers />

			{/* 6. WHY CHOOSE AMADER KRISHOK */}
			<AboutWhyUs />

			{/* 7. OVIJOG & SUPPORT FORM SECTION */}
			<AboutOvijogForm />

			{/* 8. FINAL CTA */}
			<AboutCta />

			{/* 9. TRUST / TESTIMONIAL SECTION */}
			<AboutTestimonials />
		</div>
	);
}

import Slider from '@/components/pages/about/about-slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const slides = [
	{
		id: 1,
		image:
			'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2532&auto=format&fit=crop',
		text: 'Innovating for a sustainable and productive agricultural future.',
	},
	{
		id: 2,
		image:
			'https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?q=80&w=1887&auto=format&fit=crop',
		text: 'Empowering farmers with cutting-edge technology.',
	},
	{
		id: 3,
		image:
			'https://images.unsplash.com/photo-1719846923269-6fdf75444cb8?q=80&w=1887&auto=format&fit=crop',
		text: 'Cultivating innovation for the next generation of agriculture.',
	},
];

export default function AboutPage() {
	return (
		<div className='min-h-screen bg-white'>
			<div className='flex flex-col lg:flex-row min-h-screen'>
				{/* Left Section */}
				<div className='w-full lg:w-1/2 p-6 md:p-12 flex flex-col'>
					<div className='flex-1 flex flex-col justify-center max-w-xl mx-auto'>
						<h1 className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6'>
							আমাদের কৃষক
						</h1>
						<p className='text-gray-600 text-base md:text-lg mb-6 md:mb-8'>
							কৃষিতে আধুনিক প্রযুক্তি এবং টেকসই প্রক্রিয়া মাধ্যমে কৃষির
							বৈপ্লবিক পরিবর্তন।
						</p>
						<div className='space-y-4 md:space-y-6'>
							<div>
								<h2 className='text-xl md:text-2xl font-semibold mb-2'>
									আমাদের মিশন
								</h2>
								<p className='text-gray-600 text-sm md:text-base'>
									আমরা কৃষি খাতকে রূপান্তরিত করতে প্রতিশ্রুতিবদ্ধ, উদ্ভাবনী
									প্রযুক্তির মাধ্যমে ফসলের ফলন বৃদ্ধি, পরিবেশগত প্রভাব কমানো এবং
									বিশ্বব্যাপী কৃষকদের ক্ষমতায়ন নিশ্চিত করতে।
								</p>
							</div>
							<div>
								<h2 className='text-xl md:text-2xl font-semibold mb-2'>
									আমাদের দৃষ্টিভঙ্গি
								</h2>
								<p className='text-gray-600 text-sm md:text-base'>
									আমরা কৃত্রিম বুদ্ধিমত্তা-চালিত বিশ্লেষণ, আইওটি সেন্সর এবং সঠিক
									কৃষি প্রযুক্তির সংমিশ্রণ করে সমস্ত আকারের খামারের জন্য উপযুক্ত
									সমাধান প্রদান করি। আমাদের সমন্বিত দৃষ্টিভঙ্গি টেকসই উন্নয়ন এবং
									সর্বোত্তম সম্পদ ব্যবহার নিশ্চিত করে।
								</p>
							</div>
							<div>
								<h2 className='text-xl md:text-2xl font-semibold mb-2'>
									আমাদের প্রভাব
								</h2>
								<p className='text-gray-600 text-sm md:text-base'>
									আমাদের প্রতিষ্ঠার পর থেকে, আমরা ১০,০০০-এরও বেশি কৃষককে তাদের
									ফলন ৩০% পর্যন্ত বৃদ্ধি করতে সাহায্য করেছি, একই সাথে পানি
									ব্যবহারে ২৫% এবং রাসায়নিক উপাদানের ব্যবহার ২০% কমিয়েছি।
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Right Section */}
				<div className='w-full lg:w-1/2'>
					<Slider slides={slides} />
				</div>
			</div>

			{/* Bridge Section */}
			<div className='py-12 md:py-24 px-6 md:px-12 bg-white'>
				<div className='max-w-7xl mx-auto'>
					<h2 className='text-3xl md:text-4xl lg:text-6xl font-bold mb-6 md:mb-12'>
						আমরা সেতু তৈরি করি{' '}
						<span className='text-gray-400'>কোম্পানি এবং গ্রাহকদের মধ্যে </span>
					</h2>
					<p className='text-lg md:text-xl text-gray-600 max-w-2xl'>
						ছোট এবং মাঝারি আকারের ব্যবসার গ্রাহক সেবা দলের জন্য এমন সফটওয়্যার
						তৈরি করতে যা তাদের গ্রাহকদের সাথে ফলপ্রসূ এবং স্থায়ী সম্পর্ক তৈরি
						করার ক্ষমতা প্রদান করে।
					</p>
				</div>
			</div>

			{/* Together Section */}
			<div className='py-12 md:py-24 px-6 md:px-12 bg-gray-50'>
				<div className='max-w-7xl mx-auto'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24'>
						<div>
							<h2 className='text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8'>
								আমরা একসাথে শক্তিশালী
							</h2>
							<p className='text-lg md:text-xl text-gray-600 mb-4 md:mb-6'>
								আমাদের দলটি ক্রমাগত বৃদ্ধি পাচ্ছে, কিন্তু আমরা সবাই একটি
								লক্ষ্যেই কাজ করি: সেলস সাফল্যকে শুধুমাত্র সম্ভব নয়, বরং
								পৃথিবীজুড়ে দলের জন্য অবধারিত করে তোলা।
							</p>
							<p className='text-gray-600 text-sm md:text-base'>
								২০২৪ সালে, সঠিক অভিযোগ এবং ন্যায়সঙ্গত ঘৃণা সহ আমরা তাদের
								মুখোমুখি হতে পারি যারা সঠিকভাবে বিভ্রান্তি ও আনন্দের মধ্যে
								ভুগছে, এবং যাদের ক্ষতিসাধন এবং অস্বস্তি সত্ত্বেও তারা
								সৃষ্টিকর্তার উদ্দেশ্যে কিছুই প্রদান করে না, তাদের মধ্যে কিছু
								অযাচিত আচরণের দায়িত্ব রয়েছে।
							</p>
						</div>
						<div className='space-y-8 md:space-y-12'>
							<div className='flex items-start space-x-4'>
								<Avatar className='w-12 h-12'>
									<AvatarImage src='/placeholder.svg' />
									<AvatarFallback>CA</AvatarFallback>
								</Avatar>
								<div>
									<h3 className='font-semibold'>Consortium Analytics</h3>
									{/* <p className='text-sm text-gray-500'>Founder & CEO</p> */}
								</div>
							</div>
							<blockquote className='text-xl md:text-2xl font-medium'>
								&quot;আমাদের লক্ষ্য হল এমন সফটওয়্যার তৈরি করা যা ছোট এবং মাঝারি
								আকারের ব্যবসার গ্রাহক সেবা দলের জন্য গ্রাহকদের সাথে ফলপ্রসূ এবং
								স্থায়ী সম্পর্ক তৈরি করার ক্ষমতা প্রদান করবে।&quot;
							</blockquote>
						</div>
					</div>
				</div>
			</div>

			{/* Stats Section */}
			<div className='py-12 md:py-24 px-6 md:px-12 bg-white'>
				<div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12'>
					<div>
						<p className='text-sm text-gray-600 mb-2'>
							Team member vero eos et accusamus et iusto odio dignissimos
							ducimus qui blanditiis.
						</p>
						<h3 className='text-4xl md:text-5xl lg:text-6xl font-bold'>290+</h3>
					</div>
					<div>
						<p className='text-sm text-gray-600 mb-2'>
							Year experience vero eos et accusamus et iusto odio qui blanditiis
							praesentium.
						</p>
						<h3 className='text-4xl md:text-5xl lg:text-6xl font-bold'>12+</h3>
					</div>
					<div>
						<p className='text-sm text-gray-600 mb-2'>
							Lovely customers vero eos et accusamus et iusto odio qui
							blanditiis praesentium.
						</p>
						<h3 className='text-4xl md:text-5xl lg:text-6xl font-bold'>20K+</h3>
					</div>
				</div>
			</div>
		</div>
	);
}

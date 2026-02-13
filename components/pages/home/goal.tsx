'use client';

import { motion } from 'framer-motion';

const values = [
	{
		title: 'টেকসইতা',
		description:
			'আমরা বিশ্বাস করি এমন কৃষি সমাধান তৈরি করতে যা আমাদের গ্রহের সম্পদকে ভবিষ্যৎ প্রজন্মের জন্য সম্মান এবং সংরক্ষণ করবে।',
		pattern: 'radial-gradient(circle at 10% 90%, #4ade80 0%, transparent 50%)',
	},
	{
		title: 'উদ্ভাবন',
		description:
			'আমরা ধারাবাহিকভাবে নতুন প্রযুক্তি এবং পদ্ধতি অনুসন্ধান করি যাতে প্রথাগত কৃষি অনুশীলনকে বিপ্লবিত করা যায়।',
		pattern: 'radial-gradient(circle at 90% 10%, #4ade80 0%, transparent 50%)',
	},
	{
		title: 'কমিউনিটি',
		description:
			'আমরা একটি সহযোগিতামূলক ইকোসিস্টেম তৈরি করি যেখানে কৃষক, বিশেষজ্ঞ এবং প্রযুক্তি একসাথে সুসমঞ্জসে কাজ করে।',
		pattern: 'radial-gradient(circle at 50% 50%, #4ade80 0%, transparent 50%)',
	},
	{
		title: 'বিশেষত্ব',
		description:
			'আমরা আমাদের সমাধান এবং সেবায় সর্বোচ্চ মান বজায় রাখি যাতে আমাদের কৃষকদের জন্য সর্বোত্তম ফলাফল নিশ্চিত করা যায়।',
		pattern: 'radial-gradient(circle at 30% 70%, #4ade80 0%, transparent 50%)',
	},
];

export default function Goal() {
	return (
		<section className='py-32 relative overflow-hidden bg-white'>
			<div className='max-w-6xl mx-auto px-4'>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className='text-center mb-20'
				>
					<span className='text-sm  mb-2 block'>আমরা কী নিয়ে কাজ করছি</span>
					<h2 className='text-4xl md:text-5xl font-light text-gray-900 mb-4'>
						আমাদের লক্ষ্য
					</h2>
					<p className='text-gray-600 max-w-2xl mx-auto'>
						আমরা বিশ্বাস করি যে একটি ছোট, তবে অত্যন্ত উৎসাহী এবং লক্ষ্যভ্রষ্ট দল
						টেকসই কৃষিতে দীর্ঘস্থায়ী প্রভাব সৃষ্টিতে সক্ষম।
					</p>
				</motion.div>

				{/* Values Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative'>
					{values.map((value, index) => (
						<motion.div
							key={value.title}
							initial={{ opacity: 0, y: 20, x: index % 2 === 0 ? -20 : 20 }}
							whileInView={{ opacity: 1, y: 0, x: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}
							className='group relative'
						>
							<div className='absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-100 to-white opacity-60' />
							<div
								className='absolute inset-0 rounded-3xl opacity-10 transition-opacity duration-500 group-hover:opacity-20'
								style={{ background: value.pattern }}
							/>
							<div className='relative backdrop-blur-sm bg-white/30 p-8 rounded-3xl border border-gray-200 h-full'>
								<h3 className='text-xl text-gray-900 mb-4 font-medium'>
									{value.title}
								</h3>
								<p className='text-gray-600 text-sm leading-relaxed'>
									{value.description}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

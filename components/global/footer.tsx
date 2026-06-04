import { Facebook, Linkedin, Mail, Phone, Youtube } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
	return (
		<footer className='w-full bg-emerald-900 text-emerald-100 py-4 px-4 md:px-6 lg:px-8 text-sm relative z-30'>
			<div className='max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 items-start justify-around gap-6 lg:gap-20'>
				<div>
					<h3 className='text-xl font-bold mb-2'>আমাদের কৃষক</h3>
					<p className='mb-3'>
						কৃষকদের প্রযুক্তি এবং টেকসই চর্চার মাধ্যমে ক্ষমতায়ন করা।
					</p>
					<div className='flex space-x-3'>
						<Link
							href='https://www.facebook.com/amaderkrishok'
							className='hover:text-white'
						>
							<Facebook size={20} />
						</Link>
						<Link
							href='https://www.youtube.com/@ConsortiumAnalytics'
							className='hover:text-white'
						>
							<Youtube size={20} />
						</Link>
						<Linkedin size={20} />
					</div>
				</div>
				<div className='lg:ml-auto'>
					<h4 className='text-lg font-semibold mb-2'>যোগাযোগ করুন</h4>
					<div className='space-y-1'>
						<p className='flex items-center'>
							<Mail className='mr-2' size={16} /> post.consortium@gmail.com
						</p>
						<p className='flex items-center'>
							<Phone className='mr-2' size={16} /> +880 1311-848915
						</p>
					</div>
				</div>
			</div>

			<div className='mt-4 pt-3 border-t border-emerald-800 relative'>
				{/* Legal Links - Right Side on desktop, below copyright on mobile */}
				<div className='md:absolute md:right-0 md:bottom-1 flex flex-row md:space-x-4 items-center justify-center md:justify-end w-full md:w-auto space-x-3'>
					<Link
						href='/terms-and-conditions'
						className='hover:text-white hover:underline text-xs md:text-sm'
					>
						ব্যবহারের শর্তাবলী
					</Link>
					<Link
						href='/privacy-policy'
						className='hover:text-white hover:underline text-xs md:text-sm'
					>
						গোপনীয়তা নীতি
					</Link>
				</div>

				{/* Copyright and Credits - Center */}
				<div className='text-center text-sm mb-4 md:mb-0'>
					<p>&copy; 2026 আমাদের কৃষক. All rights reserved.</p>
					<p className='font-bold'>
						Made by{' '}
						<Link
							href='https://www.consortiumanalytics.eu/'
							className='hover:underline'
						>
							Consortium Analytics
						</Link>
					</p>
				</div>
			</div>
		</footer>
	);
}

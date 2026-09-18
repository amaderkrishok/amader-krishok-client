'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
	MessageSquarePlus,
	Send,
	ShieldCheck,
	CheckCircle2,
	MessageCircle,
	PhoneCall,
	Mail,
	HelpCircle,
	AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useSession } from '@/components/providers/session-provider';
import { OvijogService } from '@/services/ovijog-service';

export function AboutOvijogForm() {
	const { user } = useSession();
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [subject, setSubject] = useState('পণ্য সংক্রান্ত (Product Related)');
	const [message, setMessage] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [submittedSuccess, setSubmittedSuccess] = useState(false);

	useEffect(() => {
		if (user) {
			if (user.name) setName(user.name);
			if (user.phoneNumber) setPhone(user.phoneNumber);
		}
	}, [user]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || !phone.trim() || !message.trim()) {
			toast.warning('সবগুলো তথ্য পূরণ করুন', {
				description: 'নাম, মোবাইল নম্বর এবং অভিযোগের বিবরণ দেয়া বাধ্যতামূলক।',
			});
			return;
		}

		try {
			setSubmitting(true);
			await OvijogService.submitOvijog({
				name,
				phone,
				subject,
				message,
			});

			setSubmittedSuccess(true);
			toast.success('অভিযোগ সফলভাবে জমা হয়েছে!', {
				description: 'আপনার অভিযোগটি সরাসরি এডমিন প্যানেলে প্রেরণ করা হয়েছে।',
			});

			setTimeout(() => {
				setMessage('');
				setSubmittedSuccess(false);
			}, 4000);
		} catch (error: any) {
			toast.error('জমা দিতে ব্যর্থ হয়েছে', {
				description: error?.response?.data?.message || 'পরে আবার চেষ্টা করুন।',
			});
		} finally {
			setSubmitting(false);
		}
	};

	const handleOpenWhatsApp = () => {
		const whatsappUrl = `https://wa.me/8801311848915?text=${encodeURIComponent(
			'আসসালামু আলাইকুম, আমি আমাদের কৃষক ওয়েবসাইট থেকে সহায়তার জন্য যোগাযোগ করছি।'
		)}`;
		window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
	};

	return (
		<section className='w-full px-4 sm:px-6 lg:px-8 xl:px-20 2xl:px-12 py-16' id='ovijog-section'>
			<div className='max-w-7xl mx-auto'>
				{/* Section Header */}
			<div className='text-center max-w-2xl mx-auto mb-12 space-y-3'>
				<div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAB308]/15 border border-[#EAB308]/30 text-[#855D00] text-xs font-bold'>
					<MessageSquarePlus className='w-4 h-4 text-[#EAB308]' />
					<span>সহায়তা ও মত প্রকাশ</span>
				</div>
				<h2 className='text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1C2415] tracking-tight'>
					অভিযোগ ও পরামর্শ <span className='text-[#2E7D32]'>ফরম</span>
				</h2>
				<p className='text-gray-600 text-sm sm:text-base leading-relaxed font-medium'>
					আমাদের সেবা, পণ্য বা ডেলিভারি সংক্রান্ত কোনো অভিযোগ বা পরামর্শ থাকলে নিচে লিখে পাঠান। আমাদের টিম সর্বোচ্চ গুরুত্ব দিয়ে বিষয়টি খতিয়ে দেখবে।
				</p>
			</div>

			{/* Main Grid: Left Side Contact & Live Chat + Right Side Form */}
			<div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
				{/* Left Side: Live Support & Direct Contact Cards (5 cols) */}
				<div className='lg:col-span-5 space-y-6'>
					{/* Live Chat WhatsApp Banner */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className='bg-gradient-to-br from-[#1E392A] to-[#2D4F3A] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-white/10 relative overflow-hidden space-y-5'
					>
						<div className='w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30'>
							<MessageCircle className='w-6 h-6' />
						</div>

						<div className='space-y-2'>
							<h3 className='text-xl font-bold text-white'>
								জরুরি চ্যাট সহায়তা
							</h3>
							<p className='text-xs sm:text-sm text-gray-300 leading-relaxed font-medium'>
								তাৎক্ষণিক কোনো প্রশ্ন থাকলে সরাসরি হোয়াটসঅ্যাপে আমাদের গ্রাহক সেবা টিমের সাথে কথা বলুন।
							</p>
						</div>

						<Button
							type='button'
							onClick={handleOpenWhatsApp}
							className='w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-3.5 h-auto rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border-none'
						>
							<MessageCircle className='w-5 h-5 fill-white' />
							<span>হোয়াটসঅ্যাপে লাইভ চ্যাট করুন</span>
						</Button>
					</motion.div>

					{/* Contact Details Card */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className='bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-md space-y-5'
					>
						<h4 className='text-base font-bold text-[#1C2415] flex items-center gap-2 border-b border-gray-100 pb-3'>
							<HelpCircle className='w-5 h-5 text-[#2E7D32]' />
							<span>সরাসরি যোগাযোগ মাধ্যম</span>
						</h4>

						<div className='space-y-4 text-xs sm:text-sm text-gray-700 font-medium'>
							<div className='flex items-center gap-3.5'>
								<div className='w-10 h-10 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center shrink-0'>
									<PhoneCall className='w-4 h-4' />
								</div>
								<div>
									<span className='block text-gray-400 text-[11px] font-bold uppercase'>ফোন সাপোর্ট</span>
									<a href='tel:+8801311848915' className='font-bold text-[#1C2415] hover:text-[#2E7D32] transition-colors'>
										+880 1311-848915
									</a>
								</div>
							</div>

							<div className='flex items-center gap-3.5'>
								<div className='w-10 h-10 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center shrink-0'>
									<Mail className='w-4 h-4' />
								</div>
								<div>
									<span className='block text-gray-400 text-[11px] font-bold uppercase'>ইমেইল যোগাযোগ</span>
									<a href='mailto:post.consortium@gmail.com' className='font-bold text-[#1C2415] hover:text-[#2E7D32] transition-colors'>
										post.consortium@gmail.com
									</a>
								</div>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Right Side: Complaint Form Card (7 cols) */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className='lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xl relative'
				>
					<div className='flex items-center gap-3 mb-6 pb-4 border-b border-gray-100'>
						<div className='w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100'>
							<AlertCircle className='w-5 h-5' />
						</div>
						<div>
							<h3 className='text-lg sm:text-xl font-extrabold text-[#1C2415]'>
								অভিযোগ বাক্স (Ovijog Form)
							</h3>
							<p className='text-xs text-gray-500 font-medium'>
								আপনার অভিযোগটি সরাসরি এডমিন টিমের নিকট জমা হবে
							</p>
						</div>
					</div>

					{submittedSuccess ? (
						<div className='py-12 text-center space-y-4'>
							<div className='w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md animate-bounce'>
								<CheckCircle2 className='w-8 h-8' />
							</div>
							<h3 className='text-xl font-bold text-[#1C2415]'>ধন্যবাদ! আপনার অভিযোগ জমা হয়েছে।</h3>
							<p className='text-sm text-gray-600 max-w-md mx-auto'>
								আমরা গুরুত্বের সাথে আপনার বিবরণটি পর্যালোচনা করে যত দ্রুত সম্ভব ব্যবস্থা গ্রহণ করবো।
							</p>
						</div>
					) : (
						<form onSubmit={handleSubmit} className='space-y-5'>
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								<div>
									<label className='block text-xs font-bold text-gray-700 mb-1.5'>
										আপনার নাম <span className='text-red-500'>*</span>
									</label>
									<Input
										type='text'
										value={name}
										onChange={(e) => setName(e.target.value)}
										placeholder='যেমন: আব্দুর রহমান'
										className='rounded-xl border-gray-300 focus:border-[#2E7D32] focus:ring-[#2E7D32] text-sm h-11'
										required
									/>
								</div>

								<div>
									<label className='block text-xs font-bold text-gray-700 mb-1.5'>
										মোবাইল নম্বর <span className='text-red-500'>*</span>
									</label>
									<Input
										type='tel'
										value={phone}
										onChange={(e) => setPhone(e.target.value)}
										placeholder='017xxxxxxxx'
										className='rounded-xl border-gray-300 focus:border-[#2E7D32] focus:ring-[#2E7D32] text-sm h-11'
										required
									/>
								</div>
							</div>

							<div>
								<label className='block text-xs font-bold text-gray-700 mb-1.5'>
									অভিযোগের বিষয়
								</label>
								<Select value={subject} onValueChange={setSubject}>
									<SelectTrigger className='rounded-xl border-gray-300 focus:border-[#2E7D32] focus:ring-[#2E7D32] text-sm h-11'>
										<SelectValue placeholder='বিষয় নির্বাচন করুন' />
									</SelectTrigger>
									<SelectContent className='rounded-xl'>
										<SelectItem value='পণ্য সংক্রান্ত (Product Related)'>
											পণ্য সংক্রান্ত সমস্যা (Product Issue)
										</SelectItem>
										<SelectItem value='ডেলিভারি সংক্রান্ত (Delivery Related)'>
											ডেলিভারি বিলম্ব/সমস্যা (Delivery Issue)
										</SelectItem>
										<SelectItem value='বিক্রেতা সংক্রান্ত (Vendor Related)'>
											দোকান বা বিক্রেতার আচরণ (Vendor Issue)
										</SelectItem>
										<SelectItem value='অর্থপ্রদান সংক্রান্ত (Payment Related)'>
											পেমেন্ট বা টাকা সংক্রান্ত (Payment Issue)
										</SelectItem>
										<SelectItem value='অন্যান্য (Others)'>অন্যান্য (Others)</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div>
								<label className='block text-xs font-bold text-gray-700 mb-1.5'>
									অভিযোগের বিস্তারিত বিবরণ <span className='text-red-500'>*</span>
								</label>
								<Textarea
									rows={4}
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									placeholder='আপনার অভিযোগ বা সমস্যাটি বিস্তারিত লিখুন...'
									className='rounded-xl border-gray-300 focus:border-[#2E7D32] focus:ring-[#2E7D32] text-sm resize-none'
									required
								/>
							</div>

							<div className='flex items-center gap-2 p-3 bg-[#2E7D32]/10 rounded-xl text-[#2E7D32] text-xs font-medium border border-[#2E7D32]/20'>
								<ShieldCheck className='w-4 h-4 shrink-0 text-[#2E7D32]' />
								<span>
									আপনার প্রদানকৃত সকল তথ্য গোপন রাখা হবে এবং কেবল আমাদের সিস্টেম এডমিন দেখতে পাবেন।
								</span>
							</div>

							<Button
								type='submit'
								disabled={submitting}
								className='w-full bg-[#2E7D32] hover:bg-[#236327] text-white font-extrabold py-3.5 h-auto rounded-xl shadow-md hover:shadow-lg transition-all text-sm cursor-pointer border-none'
							>
								<Send className='w-4 h-4 mr-2' />
								{submitting ? 'জমা হচ্ছে...' : 'অভিযোগ জমা দিন'}
							</Button>
						</form>
					)}
				</motion.div>
			</div>
		</div>
	</section>
	);
}

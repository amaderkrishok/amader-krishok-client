import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Shield } from 'lucide-react';

export function PrivacyContent() {
	return (
		<div className='space-y-8 text-gray-700'>
			<section>
				<p className='mb-4'>
					আমাদের কৃষক প্লাটফর্মে আপনাকে স্বাগতম। আমরা আপনার গোপনীয়তা রক্ষা করতে
					প্রতিশ্রুতিবদ্ধ। এই গোপনীয়তা নীতি ব্যাখ্যা করে কিভাবে আমরা আপনার
					ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং প্রকাশ করি।
				</p>
				<Alert className='bg-green-50 border-green-200 my-4'>
					<Shield className='h-4 w-4 text-green-600' />
					<AlertTitle className='text-green-800'>
						আপনার গোপনীয়তা আমাদের অগ্রাধিকার
					</AlertTitle>
					<AlertDescription className='text-green-700'>
						আমাদের প্লাটফর্ম ব্যবহার করে, আপনি এই গোপনীয়তা নীতিতে বর্ণিত
						প্রক্রিয়াগুলি মেনে নিচ্ছেন। ভালোভাবে পড়ে নিন।
					</AlertDescription>
				</Alert>
			</section>

			<Separator />

			<section>
				<h2 className='text-xl font-semibold mb-3 text-gray-900'>
					১. আমরা যে তথ্য সংগ্রহ করি
				</h2>

				<h3 className='font-medium text-gray-800 my-2'>
					১.১ আপনি প্রদান করা তথ্য
				</h3>
				<p className='mb-3'>
					আমরা নিম্নলিখিত তথ্য সংগ্রহ করি যা আপনি আমাদের সরাসরি প্রদান করেন:
				</p>
				<ul className='list-disc pl-6 space-y-2 mb-4'>
					<li>অ্যাকাউন্ট তথ্য (নাম, ইমেল ঠিকানা, ফোন নম্বর, পাসওয়ার্ড)</li>
					<li>প্রোফাইল তথ্য (যেমন প্রোফাইল ছবি, জন্ম তারিখ)</li>
					<li>যোগাযোগের ঠিকানা এবং বিলিং তথ্য</li>
					<li>অর্ডার এবং লেনদেন সম্পর্কিত তথ্য</li>
					<li>
						কৃষি সম্পর্কিত প্রশ্ন বা উদ্বেগ যা আপনি আমাদের সাথে শেয়ার করেন
					</li>
				</ul>

				<h3 className='font-medium text-gray-800 my-2'>
					১.২ স্বয়ংক্রিয়ভাবে সংগৃহীত তথ্য
				</h3>
				<p className='mb-3'>
					আমরা স্বয়ংক্রিয়ভাবে নিম্নলিখিত তথ্য সংগ্রহ করি:
				</p>
				<ul className='list-disc pl-6 space-y-2'>
					<li>ডিভাইস তথ্য (আইপি ঠিকানা, ব্রাউজার ধরন, ডিভাইসের ধরন)</li>
					<li>ব্যবহারের তথ্য (আপনি যে পৃষ্ঠাগুলি দেখেন, ক্লিক করেন, খোঁজেন)</li>
					<li>অবস্থান তথ্য (আপনার অনুমতি সাপেক্ষে)</li>
					<li>কুকিজ এবং অনুরূপ ট্র্যাকিং প্রযুক্তি থেকে তথ্য</li>
				</ul>
			</section>

			<Separator />

			<section>
				<h2 className='text-xl font-semibold mb-3 text-gray-900'>
					২. কিভাবে আমরা আপনার তথ্য ব্যবহার করি
				</h2>
				<p className='mb-3'>
					আমরা আপনার ব্যক্তিগত তথ্য নিম্নলিখিত উদ্দেশ্যে ব্যবহার করি:
				</p>
				<ul className='list-disc pl-6 space-y-2'>
					<li>আমাদের পরিষেবা প্রদান এবং পরিচালনা করতে</li>
					<li>আপনার অ্যাকাউন্ট তৈরি এবং পরিচালনা করতে</li>
					<li>আপনার অর্ডার প্রক্রিয়া করতে এবং পেমেন্ট পরিচালনা করতে</li>
					<li>আমাদের পরিষেবা সম্পর্কে আপনার সাথে যোগাযোগ করতে</li>
					<li>গ্রাহক সহায়তা প্রদান করতে</li>
					<li>আমাদের পরিষেবা উন্নত করতে এবং নতুন বৈশিষ্ট্য বিকাশ করতে</li>
					<li>আপনার সম্মতি সাপেক্ষে, আপনাকে মার্কেটিং তথ্য পাঠাতে</li>
					<li>প্রতারণা এবং অবৈধ কার্যকলাপ প্রতিরোধ করতে</li>
				</ul>
			</section>

			<Separator />

			<section>
				<h2 className='text-xl font-semibold mb-3 text-gray-900'>
					৩. আপনার তথ্য শেয়ারিং
				</h2>
				<p className='mb-3'>
					আমরা আপনার ব্যক্তিগত তথ্য নিম্নলিখিত পক্ষগুলির সাথে শেয়ার করতে পারি:
				</p>
				<ul className='list-disc pl-6 space-y-2 mb-4'>
					<li>
						<strong>সেবা প্রদানকারী:</strong> আমাদের পক্ষে পরিষেবা প্রদানকারী
						তৃতীয় পক্ষের সাথে (যেমন পেমেন্ট প্রসেসর, ডেলিভারি পার্টনার)
					</li>
					<li>
						<strong>কৃষক এবং বিক্রেতা:</strong> যখন আপনি তাদের পণ্য ক্রয় করেন
						বা তাদের সাথে যোগাযোগ করেন
					</li>
					<li>
						<strong>আইনি প্রয়োজনে:</strong> আইন প্রয়োগকারী সংস্থা বা আদালতের
						আদেশে
					</li>
					<li>
						<strong>ব্যবসায়িক হস্তান্তরের ক্ষেত্রে:</strong> যদি আমাদের ব্যবসা
						বিক্রি বা একীভূত হয়
					</li>
				</ul>

				<Card className='my-4 bg-gray-50 border-gray-200'>
					<CardContent className='p-4'>
						<h3 className='text-md font-medium mb-2 text-gray-800'>
							অন্যের সাথে তথ্য শেয়ার করার সময় আমরা সতর্কতা অবলম্বন করি
						</h3>
						<p className='text-gray-700 text-sm'>
							আমরা তৃতীয় পক্ষের সাথে আপনার তথ্য শেয়ার করার সময় আপনার
							গোপনীয়তা রক্ষা করার জন্য সতর্কতা অবলম্বন করি। তৃতীয় পক্ষের
							গোপনীয়তা নীতি আমাদের নিয়ন্ত্রণের বাইরে, তাই তাদের ওয়েবসাইট বা
							পরিষেবা ব্যবহার করার আগে তাদের গোপনীয়তা নীতি পর্যালোচনা করার
							পরামর্শ দেওয়া হয়।
						</p>
					</CardContent>
				</Card>
			</section>

			<Separator />

			<section>
				<h2 className='text-xl font-semibold mb-3 text-gray-900'>
					৪. আপনার তথ্যের নিরাপত্তা
				</h2>
				<p className='mb-3'>
					আমরা আপনার ব্যক্তিগত তথ্য রক্ষা করতে যুক্তিসঙ্গত প্রশাসনিক,
					প্রযুক্তিগত ও ভৌত নিরাপত্তা ব্যবস্থা বাস্তবায়ন করি। এসব ব্যবস্থার
					মধ্যে রয়েছে:
				</p>
				<ul className='list-disc pl-6 space-y-2'>
					<li>এনক্রিপশন ব্যবহার করে সংবেদনশীল তথ্য সুরক্ষিত করা</li>
					<li>সুরক্ষিত সার্ভার এবং ডাটা সেন্টারে তথ্য সংরক্ষণ করা</li>
					<li>কর্মীদের প্রশিক্ষণ এবং ডেটা অ্যাক্সেস সীমিতকরণ</li>
					<li>নিয়মিত সিকিউরিটি অডিট এবং আপডেট পরিচালনা করা</li>
				</ul>
				<Alert className='bg-amber-50 border-amber-100 my-4'>
					<AlertCircle className='h-4 w-4 text-amber-700' />
					<AlertTitle className='text-amber-800'>সতর্কতা</AlertTitle>
					<AlertDescription className='text-amber-700'>
						যদিও আমরা আপনার তথ্য সুরক্ষিত রাখতে সর্বোত্তম প্রচেষ্টা করি, কোনো
						অনলাইন ট্রান্সমিশন বা ইলেকট্রনিক স্টোরেজ পদ্ধতি 100% নিরাপদ নয়।
						আমরা পূর্ণ নিরাপত্তা নিশ্চিত করতে পারি না।
					</AlertDescription>
				</Alert>
			</section>

			<Separator />

			<section>
				<h2 className='text-xl font-semibold mb-3 text-gray-900'>
					৫. কুকিজ এবং ট্র্যাকিং টেকনোলজি
				</h2>
				<p className='mb-3'>
					আমরা কুকিজ, ওয়েব বিকন এবং অনুরূপ প্রযুক্তি ব্যবহার করি যা আমাদের
					ওয়েবসাইট এবং পরিষেবাগুলি কীভাবে ব্যবহার করা হয় সে সম্পর্কে তথ্য
					সংগ্রহ করতে সাহায্য করে।
				</p>
				<p className='mb-3'>আমরা কুকিজ ব্যবহার করি:</p>
				<ul className='list-disc pl-6 space-y-2'>
					<li>আপনার সেশন সুরক্ষিত এবং কার্যকরী রাখতে</li>
					<li>আপনার পছন্দ মনে রাখতে</li>
					<li>আমাদের ওয়েবসাইট কীভাবে ব্যবহার করা হয় তা বুঝতে</li>
					<li>আমাদের পরিষেবা উন্নত করতে</li>
				</ul>
				<p>
					আপনি আপনার ব্রাউজার সেটিংস পরিবর্তন করে কুকিজ প্রত্যাখ্যান করতে পারেন,
					তবে এটি আমাদের কিছু পরিষেবার কার্যকারিতা সীমিত করতে পারে।
				</p>
			</section>

			<Separator />

			<section>
				<h2 className='text-xl font-semibold mb-3 text-gray-900'>
					৬. আপনার অধিকার ও পছন্দসমূহ
				</h2>
				<p className='mb-3'>
					আপনি আপনার ব্যক্তিগত তথ্য সম্পর্কে নিম্নলিখিত অধিকার রাখেন:
				</p>
				<ul className='list-disc pl-6 space-y-2'>
					<li>
						<strong>অ্যাকসেস:</strong> আপনার সম্পর্কে আমরা যে তথ্য ধারণ করি তা
						অ্যাকসেস করার অধিকার
					</li>
					<li>
						<strong>সংশোধন:</strong> ভুল বা অসম্পূর্ণ তথ্য সংশোধন করার অধিকার
					</li>
					<li>
						<strong>মুছে ফেলা:</strong> কিছু পরিস্থিতিতে আপনার ব্যক্তিগত তথ্য
						মুছে ফেলার অনুরোধ করার অধিকার
					</li>
					<li>
						<strong>প্রতিবন্ধকতা:</strong> কিছু ক্ষেত্রে আপনার তথ্য
						প্রক্রিয়াকরণ সীমিত করার অধিকার
					</li>
					<li>
						<strong>আপত্তি:</strong> আপনার তথ্য প্রক্রিয়াকরণে আপত্তি জানানোর
						অধিকার
					</li>
					<li>
						<strong>ডেটা পোর্টেবিলিটি:</strong> আমরা সংগ্রহ করা তথ্য
						ব্যবহারযোগ্য ফরম্যাটে পাওয়ার অধিকার
					</li>
				</ul>
				<p className='mt-3'>
					এই অধিকারগুলি ব্যবহার করতে, আপনি আপনার অ্যাকাউন্টে লগইন করে বা{' '}
					<a
						href='mailto:privacy@amaderkrishok.com'
						className='text-green-600 hover:underline'
					>
						privacy@amaderkrishok.com
					</a>{' '}
					এ যোগাযোগ করতে পারেন।
				</p>
			</section>

			<Separator />

			<section>
				<h2 className='text-xl font-semibold mb-3 text-gray-900'>
					৭. শিশুদের গোপনীয়তা
				</h2>
				<p>
					আমাদের পরিষেবাগুলি ১৮ বছরের কম বয়সী শিশুদের উদ্দেশ্যে নয়। আমরা
					জেনেশুনে ১৮ বছরের কম বয়সী কারো কাছ থেকে ব্যক্তিগত তথ্য সংগ্রহ করি না।
					যদি আপনি জানেন যে কোন শিশু আমাদের কাছে ব্যক্তিগত তথ্য প্রদান করেছে,
					অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন এবং আমরা সেই তথ্য আমাদের রেকর্ড
					থেকে মুছে ফেলার ব্যবস্থা করব।
				</p>
			</section>

			<Separator />

			<section>
				<h2 className='text-xl font-semibold mb-3 text-gray-900'>
					৮. এই নীতিতে পরিবর্তন
				</h2>
				<p className='mb-3'>
					আমরা এই গোপনীয়তা নীতিতে সময়ে সময়ে আপডেট করতে পারি। আমরা যেকোনো
					গুরুত্বপূর্ণ পরিবর্তন সম্পর্কে আপনাকে অবহিত করব:
				</p>
				<ul className='list-disc pl-6 space-y-2'>
					<li>আমাদের ওয়েবসাইটে একটি নোটিশ পোস্ট করে</li>
					<li>আপনার প্রদত্ত ইমেল ঠিকানায় ইমেল পাঠিয়ে</li>
					<li>আপনার অ্যাকাউন্টে একটি বিজ্ঞপ্তি পাঠিয়ে</li>
				</ul>
				<p>
					পরিবর্তনের পর আমাদের পরিষেবা ব্যবহার চালিয়ে গেলে আপনি সংশোধিত
					গোপনীয়তা নীতি মেনে নিচ্ছেন বলে ধরে নেওয়া হবে।
				</p>
			</section>

			<Separator />

			<section>
				<h2 className='text-xl font-semibold mb-3 text-gray-900'>
					৯. যোগাযোগ করুন
				</h2>
				<p>
					যদি আপনার এই গোপনীয়তা নীতি সম্পর্কে কোনো প্রশ্ন বা উদ্বেগ থাকে,
					অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন:
				</p>
				<ul className='list-none space-y-2 mt-3'>
					<li>
						<strong>ইমেইল:</strong>{' '}
						<a
							href='mailto:privacy@amaderkrishok.com'
							className='text-green-600 hover:underline'
						>
							privacy@amaderkrishok.com
						</a>
					</li>
					<li>
						<strong>ফোন:</strong> +৮৮০ ১৭০০ ০০০০০০
					</li>
					<li>
						<strong>ঠিকানা:</strong> আমাদের কৃষক, ৩৪/এ, গুলশান এভিনিউ,
						ঢাকা-১২১২, বাংলাদেশ
					</li>
					<li>
						আমাদের{' '}
						<a href='/contact' className='text-green-600 hover:underline'>
							যোগাযোগ পৃষ্ঠা
						</a>{' '}
						ব্যবহার করে
					</li>
				</ul>
			</section>
		</div>
	);
}

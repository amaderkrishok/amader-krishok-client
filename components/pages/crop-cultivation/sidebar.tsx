'use client';

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Menu, X, Sprout, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Crop {
	id: string;
	name: string;
}

interface SidebarProps {
	onSelectCrop: (cropId: string) => void;
	crops: Crop[];
	selectedCropId?: string | null;
}

export function Sidebar({ onSelectCrop, crops = [], selectedCropId: propSelectedId }: SidebarProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	const selectedId = propSelectedId !== undefined ? propSelectedId : internalSelectedId;
	const cropArray = Array.isArray(crops) ? crops : [];

	const filteredCrops = cropArray.filter((crop) =>
		crop.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleCropSelect = (cropId: string) => {
		setInternalSelectedId(cropId);
		onSelectCrop(cropId);
		setIsOpen(false);
	};

	const getCropEmoji = (name: string) => {
		if (name.includes('ধান') || name.includes('চাল') || name.includes('গম')) return '🌾';
		if (name.includes('টমেটো') || name.includes('বেগুন') || name.includes('শাক')) return '🍅';
		if (name.includes('আলু')) return '🥔';
		if (name.includes('ভুট্টা')) return '🌽';
		if (name.includes('আম') || name.includes('লিচু') || name.includes('কলা')) return '🥭';
		if (name.includes('সরিষা') || name.includes('তেল')) return '🌻';
		return '🌱';
	};

	return (
		<div className='relative'>
			{/* Mobile Trigger Button */}
			<button
				className='fixed bottom-6 left-6 z-40 p-3.5 bg-[#2D331F] text-[#EAB308] rounded-full shadow-2xl border border-white/20 hover:scale-105 transition-all lg:hidden flex items-center gap-2 font-semibold text-sm'
				onClick={() => setIsOpen(!isOpen)}
				aria-label='Toggle crop menu'
			>
				{isOpen ? <X size={20} /> : <Menu size={20} />}
				<span className='pr-1'>ফসল তালিকা ({cropArray.length})</span>
			</button>

			{/* Sidebar Container */}
			<aside
				className={`fixed lg:sticky top-[88px] left-0 z-30 w-72 sm:w-80 h-[calc(100vh-104px)] bg-[#FDFBF7]/95 backdrop-blur-md rounded-3xl border border-gray-200/80 shadow-[0_15px_35px_rgba(0,0,0,0.06)] transition-all duration-300 ease-in-out flex flex-col overflow-hidden ${
					isOpen ? 'translate-x-0 inset-y-0 left-4 top-24 bottom-6' : '-translate-x-full lg:translate-x-0'
				}`}
			>
				{/* Sidebar Header */}
				<div className='p-5 pb-3 border-b border-gray-200/80 bg-gradient-to-r from-emerald-50/60 via-white to-amber-50/40'>
					<div className='flex items-center justify-between mb-3'>
						<div className='flex items-center gap-2'>
							<div className='p-1.5 rounded-xl bg-[#2D331F] text-[#EAB308]'>
								<Sprout className='w-4 h-4' />
							</div>
							<h3 className='font-extrabold text-gray-900 text-lg tracking-tight'>ফসল ক্যাটালগ</h3>
						</div>
						<span className='px-2.5 py-1 rounded-full bg-[#2D331F]/10 text-[#2D331F] text-xs font-bold'>
							{filteredCrops.length}টি ফসল
						</span>
					</div>

					{/* Search Input */}
					<div className='relative group'>
						<Search
							className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2D331F] transition-colors'
							size={16}
						/>
						<input
							type='text'
							placeholder='ফসল খুঁজুন (যেমন: ধান, টমেটো)...'
							className='w-full pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EAB308]/60 focus:border-[#EAB308] text-sm text-gray-800 placeholder-gray-400 font-medium transition-all shadow-inner'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						{searchTerm && (
							<button
								onClick={() => setSearchTerm('')}
								className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs'
							>
								✕
							</button>
						)}
					</div>
				</div>

				{/* Crops List */}
				<ScrollArea className='flex-1 p-3'>
					<div className='space-y-2 pr-2'>
						{filteredCrops.length === 0 ? (
							<div className='p-8 text-center text-gray-500'>
								<p className='text-sm font-medium'>কোনো ফসল পাওয়া যায়নি</p>
							</div>
						) : (
							filteredCrops.map((crop) => {
								const isSelected = selectedId === crop.id;
								return (
									<motion.button
										key={crop.id}
										whileHover={{ x: 3, scale: 1.01 }}
										whileTap={{ scale: 0.98 }}
										onClick={() => handleCropSelect(crop.id)}
										className={`w-full text-left p-3 rounded-2xl transition-all duration-200 flex items-center justify-between group ${
											isSelected
												? 'bg-gradient-to-r from-[#2D331F] to-[#3f472f] text-white shadow-md shadow-[#2D331F]/20 ring-1 ring-white/10'
												: 'bg-white hover:bg-emerald-50/60 border border-gray-100 text-gray-700 hover:text-[#2D331F] shadow-sm'
										}`}
									>
										<div className='flex items-center gap-3 min-w-0'>
											<div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
												isSelected ? 'bg-[#EAB308]/20 border border-[#EAB308]/30' : 'bg-gray-100 group-hover:bg-emerald-100/50'
											}`}>
												{getCropEmoji(crop.name)}
											</div>
											<div className='truncate'>
												<p className={`font-bold text-sm truncate ${isSelected ? 'text-white' : 'text-gray-800'}`}>
													{crop.name}
												</p>
												<p className={`text-[11px] truncate ${isSelected ? 'text-emerald-200/80' : 'text-gray-400'}`}>
													চাষাবাদ নির্দেশিকা
												</p>
											</div>
										</div>

										<div className='flex items-center gap-1'>
											{isSelected && (
												<span className='px-2 py-0.5 rounded-full bg-[#EAB308] text-[#2D331F] text-[10px] font-extrabold'>
													নির্বাচিত
												</span>
											)}
											<ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
												isSelected ? 'text-[#EAB308]' : 'text-gray-300'
											}`} />
										</div>
									</motion.button>
								);
							})
						)}
					</div>
				</ScrollArea>
			</aside>

			{/* Mobile Backdrop */}
			{isOpen && (
				<div
					className='fixed inset-0 bg-black/40 backdrop-blur-xs z-20 lg:hidden'
					onClick={() => setIsOpen(false)}
					aria-hidden='true'
				/>
			)}
		</div>
	);
}

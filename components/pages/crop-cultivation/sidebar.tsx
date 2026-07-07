'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Menu, X } from 'lucide-react';

interface Crop {
	id: string;
	name: string;
}

interface SidebarProps {
	onSelectCrop: (cropId: string) => void;
	crops: Crop[];
}

export function Sidebar({ onSelectCrop, crops = [] }: SidebarProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	// Ensure crops is always an array before filtering
	const cropArray = Array.isArray(crops) ? crops : [];

	const filteredCrops = cropArray.filter((crop) =>
		crop.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleCropSelect = (cropId: string) => {
		setSelectedCropId(cropId);
		onSelectCrop(cropId);
		setIsOpen(false);
	};

	return (
		<div className='relative'>
			{/* Hamburger button */}
			{isOpen ? (
				<button
					className='fixed top-[100px] left-4 z-30 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 lg:hidden'
					onClick={() => setIsOpen(false)}
					aria-label='Close sidebar'
				>
					<X size={24} />
				</button>
			) : (
				<button
					className='fixed top-[100px] left-4 z-30 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 lg:hidden'
					onClick={() => setIsOpen(true)}
					aria-label='Open sidebar'
				>
					<Menu size={24} />
				</button>
			)}

			{/* Sidebar */}
			<aside
				className={`fixed top-[88px] left-0 z-20 w-64 h-[calc(100vh-88px)] bg-white/70 backdrop-blur-md border-r border-white/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] lg:shadow-none transition-transform duration-300 ease-in-out overflow-y-auto ${
					isOpen ? 'translate-x-0' : '-translate-x-full'
				} lg:translate-x-0 lg:fixed lg:h-[calc(100vh-88px)]`}
			>
				<div className='flex flex-col h-full p-4 pt-12 lg:pt-4'>
					{/* Search bar */}
					<div className='relative mb-4 mt-5 lg:mt-0'>
						<Search
							className='absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500/70'
							size={18}
						/>
						<Input
							type='search'
							placeholder='ফসল খুঁজুন...'
							className='pl-10 py-5 bg-white border-gray-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all rounded-xl shadow-inner text-base'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>

					{/* Crop list */}
					<ScrollArea className='flex-1 pr-4'>
						<div className='space-y-2 mb-5 px-1'>
							{filteredCrops.map((crop) => (
								<div key={crop.id}>
									<Button
										variant={selectedCropId === crop.id ? 'default' : 'ghost'}
										className={`w-full justify-start rounded-xl px-4 py-3 text-base font-medium transition-all duration-300 ${
											selectedCropId === crop.id
												? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md hover:shadow-lg hover:from-green-400 hover:to-emerald-400'
												: 'text-gray-600 hover:bg-green-50 hover:text-green-700'
										}`}
										onClick={() => handleCropSelect(crop.id)}
									>
										{selectedCropId === crop.id && <span className='mr-2'>🌿</span>}
										{crop.name}
									</Button>
								</div>
							))}
						</div>
					</ScrollArea>
				</div>
			</aside>

			{/* Overlay for mobile */}
			{isOpen && (
				<div
					className='fixed inset-0 bg-black/20 z-10 lg:hidden'
					onClick={() => setIsOpen(false)}
					aria-hidden='true'
				/>
			)}
		</div>
	);
}

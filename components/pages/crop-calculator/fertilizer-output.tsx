import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FertilizerOutputProps {
	results: Record<string, string>; // Dynamically handle any fertilizer type
	language: 'en' | 'bn';
}

export function FertilizerOutput({ results, language }: FertilizerOutputProps) {
	return (
		<Card className='mt-6'>
			<CardHeader>
				<CardTitle>
					{language === 'bn' ? 'সারের পরিমাণ' : 'Fertilizer Requirements'}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ul className='space-y-2'>
					{Object.entries(results).map(([fertilizer, amount]) => (
						<li key={fertilizer}>
							{language === 'bn'
								? `${translateFertilizer(fertilizer, language)}: ${formatAmount(
										amount
								  )}`
								: `${fertilizer}: ${formatAmount(amount)}`}
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}

// Helper function to format amounts
function formatAmount(amount: string): string {
	const match = amount.match(/^([\d.]+)\s*(g|kg)$/i);
	if (!match) return amount; // Return as is if the format is unrecognized

	const value = Number.parseFloat(match[1]);
	const unit = match[2].toLowerCase();

	if (unit === 'kg') {
		return `${value.toFixed(1)} kg`; // Keep kg as is
	}

	if (unit === 'g' && value >= 1000) {
		return `${(value / 1000).toFixed(1)} kg`; // Convert g to kg if >= 1000g
	}

	return `${value.toFixed(1)} gm`; // Keep g if < 1000g
}

// Helper function to translate fertilizer names to Bengali
function translateFertilizer(fertilizer: string, language: 'en' | 'bn') {
	const translations: Record<string, string> = {
		Urea: 'ইউরিয়া',
		TSP: 'টিএসপি',
		DAP: 'ডিএপি',
		MOP: 'এমওপি',
		Potas: 'পটাশ',
		Cow_dang: 'গোবর',
		Boron: 'বোরন',
		Borex: 'বোর্ক্স',
		Zipsam: 'জিপসম',
		Zinc: 'জিঙ্ক',
		Ass: 'অ্যাস',
	};

	return language === 'bn'
		? translations[fertilizer] || fertilizer
		: fertilizer;
}

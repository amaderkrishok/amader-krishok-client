import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
	language: 'en' | 'bn';
	setLanguage: (lang: 'en' | 'bn') => void;
}

export function LanguageSwitcher({ language, setLanguage }: LanguageToggleProps) {
	return (
		<Button
			variant='outline'
			size='sm'
			onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
		>
			<Globe className='w-4 h-4 mr-2' />
			{language === 'en' ? 'বাংলা' : 'English'}
		</Button>
	);
}

'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ModeToggle() {
	const { theme, setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	const isDark = resolvedTheme === 'dark' || theme === 'dark';

	const toggleTheme = () => {
		setTheme(isDark ? 'light' : 'dark');
	};

	if (!mounted) {
		return (
			<Button
				variant='outline'
				size='icon'
				className='h-9 w-9 rounded-xl border-[#E5E7EB]'
				aria-label='Toggle theme'
			>
				<Sun className='h-4 w-4 text-[#172033]' />
			</Button>
		);
	}

	return (
		<Button
			variant='outline'
			size='icon'
			onClick={toggleTheme}
			className='h-9 w-9 rounded-xl border-[#E5E7EB] hover:bg-[#F7F6F0] transition-colors cursor-pointer'
			aria-label='Toggle theme'
		>
			{isDark ? (
				<Sun className='h-4 w-4 text-[#F5B800] transition-all' />
			) : (
				<Moon className='h-4 w-4 text-[#172033] transition-all' />
			)}
			<span className='sr-only'>
				{isDark ? 'Switch to light mode' : 'Switch to dark mode'}
			</span>
		</Button>
	);
}

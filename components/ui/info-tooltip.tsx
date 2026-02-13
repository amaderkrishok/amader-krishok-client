import { HelpCircle } from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

interface InfoTooltipProps {
	content: React.ReactNode;
	side?: 'top' | 'right' | 'bottom' | 'left';
}

export function InfoTooltip({ content, side = 'top' }: InfoTooltipProps) {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={300}>
				<TooltipTrigger type='button'>
					<HelpCircle className='h-3.5 w-3.5 text-gray-400 hover:text-gray-500' />
				</TooltipTrigger>
				<TooltipContent side={side} className='max-w-xs'>
					<p className='text-xs'>{content}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

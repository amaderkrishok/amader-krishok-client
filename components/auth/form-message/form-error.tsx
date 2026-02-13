import Link from 'next/link';
import { BsExclamationTriangle } from 'react-icons/bs';

interface FormErrorProps {
	message?: string;
	link?: string;
	linkMessage?: string;
}

export const FormError = ({ message, link, linkMessage }: FormErrorProps) => {
	if (!message) return null;

	return (
		<div className='bg-destructive/15 p-3 rounded-md flex flex-col gap-y-2 text-sm text-destructive items-center'>
			<div className='flex items-center gap-x-2'>
				<BsExclamationTriangle className='h-4 w-4' />
				<p>{message}</p>
			</div>
			{link && (
				<Link href={link} className='underline'>
					{linkMessage}
				</Link>
			)}
		</div>
	);
};

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NotFoundMessageProps {
  title: string;
  message: string;
  buttonText: string;
  buttonHref: string;
}

export function NotFoundMessage({ 
  title, 
  message, 
  buttonText, 
  buttonHref 
}: NotFoundMessageProps) {
  const router = useRouter();
  
  return (
    <div className='container mx-auto py-20 px-4 text-center'>
      <h1 className='text-3xl font-bold mb-6'>{title}</h1>
      <p className='text-gray-600 mb-8'>{message}</p>
      <Button onClick={() => router.push(buttonHref)}>
        <ArrowLeft className='w-4 h-4 mr-2' />
        {buttonText}
      </Button>
    </div>
  );
}
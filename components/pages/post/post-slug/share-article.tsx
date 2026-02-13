'use client';

import { useState } from 'react';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Copy,
  Check,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ShareArticleProps {
  url: string;
  title: string;
  summary?: string;
  className?: string;
  showLabel?: boolean;
  showCopy?: boolean;
  showWhatsapp?: boolean;
}

export function ShareArticle({
  url,
  title,
  summary = '',
  className,
  showLabel = false,
  showCopy = true,
  showWhatsapp = true
}: ShareArticleProps) {
  const [copied, setCopied] = useState(false);
  
  // Ensure we have the full URL (will work in both client and SSR contexts)
  const fullUrl = url.startsWith('http') 
    ? url 
    : `${process.env.NEXT_PUBLIC_APP_URL || 'https://amaderkrishok.com'}${url}`;

  // Share handlers
  const handleFacebookShare = () => {
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
    window.open(fbShareUrl, 'facebook-share', 'width=580,height=520');
  };

  const handleTwitterShare = () => {
    const tweetText = encodeURIComponent(`${title}\n${fullUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, 'twitter-share', 'width=550,height=420');
  };

  const handleLinkedInShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary || title)}`;
    window.open(linkedinUrl, 'linkedin-share', 'width=550,height=420');
  };

  const handleWhatsAppShare = () => {
    const whatsappText = encodeURIComponent(`${title}\n${fullUrl}`);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappText}`;
    
    // On mobile, open in the WhatsApp app; on desktop, open in a new tab
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.location.href = whatsappUrl;
    } else {
      window.open(whatsappUrl, 'whatsapp-share', 'width=550,height=420');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {showLabel && (
        <h4 className='font-bold text-xl mb-4'>
          Share this article
        </h4>
      )}
      <div className='flex flex-wrap gap-3'>
        <Button
          size='icon'
          variant='outline'
          className='rounded-full hover:bg-blue-50 hover:border-blue-200'
          onClick={handleFacebookShare}
          aria-label="Share on Facebook"
        >
          <Facebook className='w-5 h-5 text-blue-600' />
        </Button>
        
        <Button
          size='icon'
          variant='outline'
          className='rounded-full hover:bg-sky-50 hover:border-sky-200'
          onClick={handleTwitterShare}
          aria-label="Share on Twitter/X"
        >
          <Twitter className='w-5 h-5 text-sky-500' />
        </Button>
        
        <Button
          size='icon'
          variant='outline'
          className='rounded-full hover:bg-blue-50 hover:border-blue-200'
          onClick={handleLinkedInShare}
          aria-label="Share on LinkedIn"
        >
          <Linkedin className='w-5 h-5 text-blue-700' />
        </Button>
        
        {showWhatsapp && (
          <Button
            size='icon'
            variant='outline'
            className='rounded-full hover:bg-green-50 hover:border-green-200'
            onClick={handleWhatsAppShare}
            aria-label="Share on WhatsApp"
          >
            <MessageCircle className='w-5 h-5 text-green-600' />
          </Button>
        )}
        
        {showCopy && (
          <Button
            size='icon'
            variant='outline'
            className='rounded-full hover:bg-gray-100'
            onClick={handleCopyLink}
            aria-label={copied ? "Link copied" : "Copy link"}
          >
            {copied ? (
              <Check className='w-5 h-5 text-green-600' />
            ) : (
              <Copy className='w-5 h-5' />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
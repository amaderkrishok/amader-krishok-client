'use client';

import { useState } from 'react';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Copy,
  Check,
  MessageCircle,
  Share2
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
  showLabel = true,
  showCopy = true,
  showWhatsapp = true
}: ShareArticleProps) {
  const [copied, setCopied] = useState(false);
  
  const fullUrl = url.startsWith('http') 
    ? url 
    : `${process.env.NEXT_PUBLIC_APP_URL || 'https://amaderkrishok.com'}${url}`;

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
    <div className={cn('bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4', className)}>
      {showLabel && (
        <div className='space-y-1 border-b border-gray-100 pb-4'>
          <h4 className='font-extrabold text-xl text-[#172018] flex items-center gap-2'>
            <Share2 className='w-5 h-5 text-[#2E7D32]' />
            <span>📤 পোস্টটি শেয়ার করুন</span>
          </h4>
          <p className='text-sm text-[#667085] font-normal'>
            এই তথ্যটি অন্য কৃষক বা কৃষিপ্রেমীদের সাথে শেয়ার করুন।
          </p>
        </div>
      )}
      <div className='flex flex-wrap gap-3 pt-1'>
        <Button
          variant='outline'
          className='rounded-2xl border-[#E5E7EB] bg-[#F8FAF7] hover:bg-[#1E2817] hover:text-white text-[#172018] font-semibold gap-2 transition-all shadow-sm'
          onClick={handleFacebookShare}
        >
          <Facebook className='w-4 h-4 text-blue-600' />
          <span>Facebook</span>
        </Button>
        
        {showWhatsapp && (
          <Button
            variant='outline'
            className='rounded-2xl border-[#E5E7EB] bg-[#F8FAF7] hover:bg-[#1E2817] hover:text-white text-[#172018] font-semibold gap-2 transition-all shadow-sm'
            onClick={handleWhatsAppShare}
          >
            <MessageCircle className='w-4 h-4 text-green-600' />
            <span>WhatsApp</span>
          </Button>
        )}

        <Button
          variant='outline'
          className='rounded-2xl border-[#E5E7EB] bg-[#F8FAF7] hover:bg-[#1E2817] hover:text-white text-[#172018] font-semibold gap-2 transition-all shadow-sm'
          onClick={handleTwitterShare}
        >
          <Twitter className='w-4 h-4 text-sky-500' />
          <span>Twitter / X</span>
        </Button>
        
        {showCopy && (
          <Button
            variant='outline'
            className='rounded-2xl border-[#E5E7EB] bg-[#F8FAF7] hover:bg-[#1E2817] hover:text-white text-[#172018] font-semibold gap-2 transition-all shadow-sm'
            onClick={handleCopyLink}
          >
            {copied ? (
              <>
                <Check className='w-4 h-4 text-green-600' />
                <span className='text-green-700 font-bold'>কপি করা হয়েছে</span>
              </>
            ) : (
              <>
                <Copy className='w-4 h-4 text-gray-500' />
                <span>লিঙ্ক কপি করুন</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
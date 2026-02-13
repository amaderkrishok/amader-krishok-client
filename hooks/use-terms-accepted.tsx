import { useState, useEffect, useCallback } from 'react';
import { TermsModal } from '@/components/pages/terms-and-conditions/terms-modal';

interface UseTermsAcceptedOptions {
  // Storage key for remembering acceptance (optional)
  storageKey?: string;
  // If true, will ask for acceptance even if previously accepted
  forceShow?: boolean;
}

export function useTermsAccepted(options?: UseTermsAcceptedOptions) {
  const {
    storageKey = 'terms-accepted',
    forceShow = false
  } = options || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check localStorage on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAcceptance = localStorage.getItem(storageKey);
      if (savedAcceptance === 'true' && !forceShow) {
        setIsAccepted(true);
      }
      setIsLoading(false);
    }
  }, [storageKey, forceShow]);

  // Handle acceptance
  const handleAccept = useCallback(() => {
    localStorage.setItem(storageKey, 'true');
    setIsAccepted(true);
    setIsModalOpen(false);
  }, [storageKey]);

  // Handle decline
  const handleDecline = useCallback(() => {
    localStorage.removeItem(storageKey);
    setIsAccepted(false);
    setIsModalOpen(false);
  }, [storageKey]);

  // Show terms modal
  const showTermsModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Reset terms acceptance
  const resetTermsAcceptance = useCallback(() => {
    localStorage.removeItem(storageKey);
    setIsAccepted(false);
  }, [storageKey]);

  // Modal component
  const TermsModalComponent = (
    <TermsModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onAccept={handleAccept}
      onDecline={handleDecline}
    />
  );

  return {
    isAccepted,
    isLoading,
    showTermsModal,
    resetTermsAcceptance,
    TermsModalComponent,
  };
}


// example usage

// 'use client';

// import { useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { useTermsAccepted } from '@/hooks/use-terms-accepted';
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// export default function ExamplePage() {
//   const {
//     isAccepted,
//     isLoading,
//     showTermsModal,
//     resetTermsAcceptance,
//     TermsModalComponent,
//   } = useTermsAccepted();

//   // Show terms modal automatically when component mounts if not accepted
//   useEffect(() => {
//     if (!isLoading && !isAccepted) {
//       showTermsModal();
//     }
//   }, [isLoading, isAccepted, showTermsModal]);

//   return (
//     <div className="container mx-auto px-4 py-12 max-w-4xl">
//       <Card className="shadow-md">
//         <CardHeader>
//           <CardTitle className="text-2xl">শর্তাবলী পরীক্ষা</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <p>
//             এই পৃষ্ঠাটি আমাদের ব্যবহারের শর্তাবলী হুক ব্যবহারের একটি উদাহরণ দেখায়।
//           </p>

//           <div className="bg-gray-100 p-4 rounded-lg">
//             <p className="font-medium">বর্তমান স্ট্যাটাস:</p>
//             {isLoading ? (
//               <p>লোড হচ্ছে...</p>
//             ) : (
//               <p className={isAccepted ? 'text-green-600' : 'text-amber-600'}>
//                 {isAccepted 
//                   ? '✅ আপনি শর্তাবলী মেনে নিয়েছেন' 
//                   : '⚠️ আপনি এখনো শর্তাবলী মেনে নেননি'}
//               </p>
//             )}
//           </div>
//         </CardContent>
//         <CardFooter className="flex gap-4">
//           <Button onClick={showTermsModal}>
//             শর্তাবলী দেখুন
//           </Button>
          
//           {isAccepted && (
//             <Button variant="outline" onClick={resetTermsAcceptance}>
//               শর্তাবলী রিসেট করুন
//             </Button>
//           )}
//         </CardFooter>
//       </Card>
      
//       {TermsModalComponent}
//     </div>
//   );
// }
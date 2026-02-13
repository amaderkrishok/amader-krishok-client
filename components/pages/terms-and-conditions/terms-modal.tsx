import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TermsContent } from './terms-content';


interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
}

export function TermsModal({ isOpen, onClose, onAccept, onDecline }: TermsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">ব্যবহারের শর্তাবলী</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-grow pr-4 my-6 max-h-[60vh]">
          <TermsContent />
        </ScrollArea>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between pt-4 border-t">
          <div className="text-sm text-gray-500 mb-4 sm:mb-0">
            &quot;সম্মত আছি&quot; বাটনে ক্লিক করে আপনি উপরোক্ত সকল শর্তাবলী মেনে নিচ্ছেন
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onDecline}>
              সম্মত নই
            </Button>
            <Button onClick={onAccept} className="bg-green-600 hover:bg-green-700">
              সম্মত আছি
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
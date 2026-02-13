import { Card } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export function ChatEmptyState() {
  return (
    <Card className='flex flex-col h-full items-center justify-center p-8 text-center'>
      <div className='flex flex-col items-center max-w-sm'>
        <div className='bg-primary/10 p-3 rounded-full mb-4'>
          <MessageSquare className='h-8 w-8 text-primary' />
        </div>
        <h3 className='text-lg font-medium mb-2'>No Conversation Selected</h3>
        <p className='text-muted-foreground mb-6'>
          Select a conversation from the list to start chatting or create a new conversation.
        </p>
      </div>
    </Card>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { MessageSquarePlus, Send, X, AlertTriangle, ShieldCheck, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useSession } from '@/components/providers/session-provider';
import { OvijogService } from '@/services/ovijog-service';

export function OvijogModal() {
  const { user } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('পণ্য সংক্রান্ত (Product Related)');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.phoneNumber) setPhone(user.phoneNumber);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      toast.warning('সবগুলো তথ্য পূরণ করুন', {
        description: 'নাম, মোবাইল নম্বর এবং অভিযোগের বিবরণ দেয়া বাধ্যতামূলক।',
      });
      return;
    }

    try {
      setSubmitting(true);
      await OvijogService.submitOvijog({
        name,
        phone,
        subject,
        message,
      });

      setSubmittedSuccess(true);
      toast.success('অভিযোগ সফলভাবে জমা হয়েছে!', {
        description: 'আপনার অভিযোগটি সরাসরি এডমিন প্যানেলে প্রেরণ করা হয়েছে।',
      });

      setTimeout(() => {
        setMessage('');
        setSubmittedSuccess(false);
        setIsOpen(false);
      }, 2000);
    } catch (error: any) {
      toast.error('জমা দিতে ব্যর্থ হয়েছে', {
        description: error?.response?.data?.message || 'পরে আবার চেষ্টা করুন।',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Ovijog Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-3 px-4 rounded-full shadow-[0_8px_25px_rgba(225,29,72,0.4)] hover:shadow-2xl transition-all duration-300 flex items-center gap-2.5 hover:scale-105 border border-red-400/30"
              aria-label="Ovijog Box"
            >
              <div className="relative">
                <AlertTriangle className="w-5 h-5 animate-pulse text-amber-300" />
              </div>
              <span className="text-sm font-medium tracking-wide">অভিযোগ বাক্স</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg rounded-3xl p-6 sm:p-8 bg-white border border-gray-100 shadow-2xl">
            <DialogHeader className="border-b border-gray-100 pb-4">
              <DialogTitle className="flex items-center gap-3 text-xl font-extrabold text-gray-900">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shadow-inner">
                  <MessageSquarePlus className="w-5 h-5" />
                </div>
                <div>
                  <span>অভিযোগ বাক্স (Ovijog Box)</span>
                  <p className="text-xs font-normal text-gray-500 mt-0.5">
                    আপনার যেকোনো সমস্যা বা অভিযোগ সরাসরি এডমিনের নিকট জানান
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>

            {submittedSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">ধন্যবাদ!</h3>
                <p className="text-sm text-gray-600">
                  আপনার অভিযোগটি এডমিন প্যানেলে পাঠানো হয়েছে। দ্রুত পদক্ষেপ নেওয়া হবে।
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      আপনার নাম <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="যেমন: আব্দুর রহমান"
                      className="rounded-xl border-gray-300 focus:border-red-500 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      মোবাইল নম্বর <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017xxxxxxxx"
                      className="rounded-xl border-gray-300 focus:border-red-500 text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    অভিযোগের বিষয়
                  </label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="rounded-xl border-gray-300 focus:border-red-500 text-sm">
                      <SelectValue placeholder="বিষয় নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="পণ্য সংক্রান্ত (Product Related)">
                        পণ্য সংক্রান্ত (Product Issue)
                      </SelectItem>
                      <SelectItem value="ডেলিভারি সংক্রান্ত (Delivery Related)">
                        ডেলিভারি বিলম্ব/সমস্যা (Delivery Issue)
                      </SelectItem>
                      <SelectItem value="বিক্রেতা সংক্রান্ত (Vendor Related)">
                        দোকান বা বিক্রেতার আচরণ (Vendor Issue)
                      </SelectItem>
                      <SelectItem value="অর্থপ্রদান সংক্রান্ত (Payment Related)">
                        টাকা কাটা বা পেমেন্ট সমস্যা (Payment Issue)
                      </SelectItem>
                      <SelectItem value="অন্যান্য (Others)">অন্যান্য (Others)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    অভিযোগের বিস্তারিত ವಿವರণ <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="আপনার সমস্যাটি বিস্তারিতভাবে লিখুন..."
                    className="rounded-xl border-gray-300 focus:border-red-500 text-sm"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-red-700 text-xs border border-red-100">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span>
                    এই অভিযোগটি সম্পূর্ণ গোপন থাকবে এবং কেবল আমাদের সিস্টেম এডমিন দেখতে পাবেন।
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {submitting ? 'জমা হচ্ছে...' : 'অভিযোগ জমা দিন'}
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquareWarning,
  Trash2,
  Search,
  CheckCircle,
  Clock,
  RefreshCw,
  Phone,
  User as UserIcon,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { OvijogService } from '@/services/ovijog-service';
import { Ovijog, OvijogStatus } from '@/types/ovijog';

export default function AdminOvijogsPage() {
  const [ovijogs, setOvijogs] = useState<Ovijog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Selected Ovijog for Detail Modal
  const [activeOvijog, setActiveOvijog] = useState<Ovijog | null>(null);

  const fetchOvijogs = async () => {
    try {
      setLoading(true);
      const data = await OvijogService.getAllForAdmin();
      setOvijogs(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('অভিযোগসমূহ লোড করতে সমস্যা হয়েছে');
      setOvijogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOvijogs();
  }, []);

  const handleStatusChange = async (id: number, currentStatus: OvijogStatus) => {
    const newStatus =
      currentStatus === OvijogStatus.RESOLVED
        ? OvijogStatus.PENDING
        : OvijogStatus.RESOLVED;

    try {
      await OvijogService.updateStatus(id, newStatus);
      toast.success(
        newStatus === OvijogStatus.RESOLVED
          ? 'অভিযোগ সমাধান হিসেবে চিহ্নিত করা হয়েছে'
          : 'অভিযোগ পেন্ডিং এ স্থানান্তর করা হয়েছে'
      );
      setOvijogs((prev) =>
        Array.isArray(prev) ? prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)) : []
      );
      if (activeOvijog?.id === id) {
        setActiveOvijog({ ...activeOvijog, status: newStatus });
      }
    } catch (error) {
      toast.error('স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই অভিযোগটি মুছে ফেলতে চান?')) return;
    try {
      await OvijogService.deleteOvijog(id);
      toast.success('অভিযোগটি সফলভাবে মুছে ফেলা হয়েছে');
      setOvijogs((prev) => (Array.isArray(prev) ? prev.filter((o) => o.id !== id) : []));
      if (activeOvijog?.id === id) {
        setActiveOvijog(null);
      }
    } catch (error) {
      toast.error('ডিলিট করতে সমস্যা হয়েছে');
    }
  };

  const safeOvijogs = Array.isArray(ovijogs) ? ovijogs : [];
  const filteredOvijogs = safeOvijogs.filter((o) => {
    const matchesSearch =
      o.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone?.includes(searchTerm) ||
      o.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.message?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'ALL' || o.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 w-full mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquareWarning className="w-6 h-6 text-red-600" />
            অভিযোগ বাক্স (Ovijog Box Management - Admin Only)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            গ্রাহকদের প্রেরিত অভিযোগ ও ফিডব্যাকগুলো পর্যবেক্ষণ, স্ট্যাটাস পরিবর্তন এবং নিষ্পত্তি করুন।
          </p>
        </div>

        <Button onClick={fetchOvijogs} variant="outline" size="sm" className="rounded-xl">
          <RefreshCw className="w-4 h-4 mr-2" />
          রিফ্রেশ
        </Button>
      </div>

      {/* Filter Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setSelectedStatus('ALL')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            selectedStatus === 'ALL'
              ? 'bg-emerald-50 border-emerald-500 shadow-sm'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-xs text-gray-500 font-medium">মোট অভিযোগ</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{safeOvijogs.length} টি</h3>
        </div>

        <div
          onClick={() => setSelectedStatus(OvijogStatus.PENDING)}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            selectedStatus === OvijogStatus.PENDING
              ? 'bg-amber-50 border-amber-500 shadow-sm'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-xs text-amber-700 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> পেন্ডিং অভিযোগ
          </p>
          <h3 className="text-2xl font-bold text-amber-800 mt-1">
            {safeOvijogs.filter((o) => o.status === OvijogStatus.PENDING).length} টি
          </h3>
        </div>

        <div
          onClick={() => setSelectedStatus(OvijogStatus.RESOLVED)}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            selectedStatus === OvijogStatus.RESOLVED
              ? 'bg-blue-50 border-blue-500 shadow-sm'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-xs text-blue-700 font-medium flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> সমাধানকৃত (Resolved)
          </p>
          <h3 className="text-2xl font-bold text-blue-800 mt-1">
            {safeOvijogs.filter((o) => o.status === OvijogStatus.RESOLVED).length} টি
          </h3>
        </div>
      </div>

      <Card className="border-gray-200 shadow-sm rounded-2xl">
        <CardHeader className="pb-3 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base font-bold text-gray-800">
              অভিযোগ তালিকা ({filteredOvijogs.length})
            </CardTitle>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="নাম, ফোন নম্বর বা বিষয় খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 rounded-xl border-gray-300 text-sm"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-gray-500">লোডিং হচ্ছে...</div>
          ) : filteredOvijogs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">কোনো অভিযোগ পাওয়া যায়নি।</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold">
                  <tr>
                    <th className="p-4">আইডি</th>
                    <th className="p-4">অভিযোগকারী</th>
                    <th className="p-4">ফোন নম্বর</th>
                    <th className="p-4">বিষয়</th>
                    <th className="p-4">স্ট্যাটাস</th>
                    <th className="p-4">তারিখ</th>
                    <th className="p-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOvijogs.map((ov) => (
                    <tr key={ov.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-4 font-mono text-xs text-gray-400">#{ov.id}</td>
                      <td className="p-4 font-semibold text-gray-900 flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        {ov.name}
                      </td>
                      <td className="p-4 font-mono text-gray-700">
                        <a
                          href={`tel:${ov.phone}`}
                          className="hover:text-emerald-600 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {ov.phone}
                        </a>
                      </td>
                      <td className="p-4 max-w-xs font-medium text-gray-800 truncate">
                        {ov.subject}
                      </td>
                      <td className="p-4">
                        {ov.status === OvijogStatus.RESOLVED ? (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            <CheckCircle className="w-3 h-3 mr-1 text-blue-600" />
                            সমাধানকৃত
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                            <Clock className="w-3 h-3 mr-1 text-amber-600" />
                            পেন্ডিং
                          </Badge>
                        )}
                      </td>
                      <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(ov.createdAt).toLocaleDateString('bn-BD', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveOvijog(ov)}
                          className="text-gray-600 hover:bg-gray-100 rounded-lg"
                          title="বিস্তারিত দেখুন"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(ov.id, ov.status)}
                          className={
                            ov.status === OvijogStatus.RESOLVED
                              ? 'text-amber-600 hover:bg-amber-50 rounded-lg'
                              : 'text-blue-600 hover:bg-blue-50 rounded-lg'
                          }
                          title="স্ট্যাটাস পরিবর্তন করুন"
                        >
                          {ov.status === OvijogStatus.RESOLVED ? 'পেন্ডিং করুন' : 'সমাধান সমাধান করুন'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(ov.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ovijog Detail Modal */}
      <Dialog open={!!activeOvijog} onOpenChange={() => setActiveOvijog(null)}>
        <DialogContent className="max-w-lg rounded-2xl p-6">
          {activeOvijog && (
            <div>
              <DialogHeader className="border-b border-gray-100 pb-3 mb-4">
                <DialogTitle className="flex items-center justify-between text-lg font-bold text-gray-900">
                  <span>অভিযোগ বিবরণী (Ovijog Details)</span>
                  {activeOvijog.status === OvijogStatus.RESOLVED ? (
                    <Badge className="bg-blue-100 text-blue-800">সমাধানকৃত</Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-800">পেন্ডিং</Badge>
                  )}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <div>
                    <span className="text-xs text-gray-400 font-medium">অভিযোগকারী:</span>
                    <p className="font-semibold text-gray-900">{activeOvijog.name}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-medium">মোবাইল নম্বর:</span>
                    <p className="font-mono font-semibold text-emerald-700">{activeOvijog.phone}</p>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-gray-400 font-medium">অভিযোগের বিষয়:</span>
                  <p className="font-bold text-gray-900 mt-0.5">{activeOvijog.subject}</p>
                </div>

                <div>
                  <span className="text-xs text-gray-400 font-medium">অভিযোগের বিবরণ:</span>
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 mt-1 text-gray-800 leading-relaxed whitespace-pre-line">
                    {activeOvijog.message}
                  </div>
                </div>

                <div className="text-xs text-gray-400 pt-2 border-t border-gray-100 flex justify-between">
                  <span>জমা দেওয়ার তারিখ: {new Date(activeOvijog.createdAt).toLocaleString('bn-BD')}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleStatusChange(activeOvijog.id, activeOvijog.status)}
                    className={
                      activeOvijog.status === OvijogStatus.RESOLVED
                        ? 'flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl'
                        : 'flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl'
                    }
                  >
                    {activeOvijog.status === OvijogStatus.RESOLVED
                      ? 'পেন্ডিং এ মার্ক করুন'
                      : 'সমাধানকৃত হিসেবে মার্ক করুন'}
                  </Button>

                  <Button
                    onClick={() => handleDelete(activeOvijog.id)}
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl"
                  >
                    ডিলিট
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

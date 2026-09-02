'use client';

import { useState } from 'react';
import type { Order } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { OrderService } from '@/services/order-service';
import { toast } from 'sonner';

interface OrderInvoiceProps {
	order: Order;
}

export function OrderInvoice({ order }: OrderInvoiceProps) {
	const [isGenerating, setIsGenerating] = useState(false);

	const handleDownload = async () => {
		if (isGenerating) return;
		setIsGenerating(true);

		try {
			// Dynamically import @react-pdf/renderer on demand (only when user clicks download)
			const { pdf, Document, Page, Text, View, Image, StyleSheet, Font } =
				await import('@react-pdf/renderer');

			// Register Bengali CDN Fonts dynamically
			try {
				const notoCdnBase =
					'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSansBengali';
				Font.register({
					family: 'NotoSansBengali',
					fonts: [{ src: `${notoCdnBase}/NotoSansBengali-Regular.ttf` }],
				});
				Font.register({
					family: 'NotoSansBengaliBold',
					fonts: [{ src: `${notoCdnBase}/NotoSansBengali-Bold.ttf` }],
				});
			} catch (e) {
				console.warn('Font registration notice:', e);
			}

			const styles = StyleSheet.create({
				page: {
					padding: 28,
					fontFamily: 'NotoSansBengali',
					fontSize: 10,
					color: '#111827',
				},
				header: {
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 16,
				},
				logo: { width: 96, height: 32, objectFit: 'contain' },
				titleWrap: { textAlign: 'right' },
				title: { fontSize: 18, fontFamily: 'NotoSansBengaliBold' },
				sub: { fontSize: 10, color: '#6B7280', marginTop: 2 },
				section: { marginTop: 12 },
				sectionTitle: { fontSize: 12, fontWeight: 700, marginBottom: 6 },
				grid: { flexDirection: 'row', gap: 12 },
				col: { flex: 1 },
				line: { borderBottom: '1px solid #E5E7EB', marginVertical: 8 },
				label: { color: '#6B7280' },
				value: { marginTop: 2 },
				table: { width: '100%', marginTop: 8 },
				thead: {
					flexDirection: 'row',
					backgroundColor: '#F3F4F6',
					padding: 8,
					borderTopLeftRadius: 4,
					borderTopRightRadius: 4,
				},
				tbodyRow: {
					flexDirection: 'row',
					padding: 8,
					borderBottom: '1px solid #E5E7EB',
				},
				thThumb: { width: 40 },
				th: { flex: 1, fontFamily: 'NotoSansBengaliBold' },
				td: { flex: 1 },
				tdThumb: { width: 40 },
				thumb: { width: 32, height: 32, objectFit: 'cover', borderRadius: 4 },
				tdRight: { textAlign: 'right' },
				totals: { marginTop: 10, alignItems: 'flex-end' },
				totalRow: { flexDirection: 'row', gap: 24, marginBottom: 3 },
				totalLabel: { color: '#374151' },
				totalValue: { fontFamily: 'NotoSansBengaliBold' },
				footer: {
					marginTop: 24,
					color: '#6B7280',
					fontSize: 9,
					textAlign: 'center',
				},
			});

			const formatDate = (dateString?: string) => {
				if (!dateString) return '';
				const d = new Date(dateString);
				return new Intl.DateTimeFormat('bn-BD', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
				}).format(d);
			};

			const currency = (n: number | string | undefined) => {
				if (n == null) return '৳0.00';
				const num = typeof n === 'string' ? Number(n) : n;
				try {
					return new Intl.NumberFormat('bn-BD', {
						style: 'currency',
						currency: 'BDT',
						minimumFractionDigits: 2,
					}).format(num);
				} catch {
					return `৳${num.toFixed(2)}`;
				}
			};

			// Calculations
			const deliveryCharge = OrderService.getOrderDeliveryCharge(order);
			const grandTotal = OrderService.getOrderGrandTotal(order);
			const itemsTotal = (order.orderItems || []).reduce(
				(sum, item) =>
					sum +
					(Number(item.total) || Number(item.price) * Number(item.quantity)),
				0
			);

			const logoUrl =
				(typeof window !== 'undefined' ? `${window.location.origin}` : '') +
				'/images/logo.png';
			const placeholderUrl =
				(typeof window !== 'undefined' ? `${window.location.origin}` : '') +
				'/images/product-placeholder.png';

			const doc = (
				<Document>
					<Page size='A4' style={styles.page}>
						{/* Header */}
						<View style={styles.header}>
							<Image style={styles.logo} src={logoUrl} />
							<View style={styles.titleWrap}>
								<Text style={styles.title}>INVOICE</Text>
								<Text style={styles.sub}>
									অর্ডার #{order.id?.slice(0, 8) || 'N/A'}
								</Text>
								<Text style={styles.sub}>তারিখ: {formatDate(order.orderDate)}</Text>
							</View>
						</View>

						<View style={styles.line} />

						{/* Customer & Store Info */}
						<View style={[styles.section, styles.grid]}>
							<View style={styles.col}>
								<Text style={styles.sectionTitle}>Bill To</Text>
								<Text style={styles.label}>নাম</Text>
								<Text style={styles.value}>{order.name}</Text>
								<Text style={styles.label}>মোবাইল</Text>
								<Text style={styles.value}>{order.phoneNumber}</Text>
								<Text style={styles.label}>ঠিকানা</Text>
								<Text style={styles.value}>{order.address}</Text>
							</View>
							<View style={styles.col}>
								<Text style={styles.label}>স্টোর সংখ্যা</Text>
								<Text style={styles.value}>{order.storeCount}</Text>
								<Text style={styles.label}>স্ট্যাটাস</Text>
								<Text style={styles.value}>{order.orderStatus}</Text>
								<Text style={styles.label}>আপডেট</Text>
								<Text style={styles.value}>{formatDate(order.updatedAt)}</Text>
							</View>
						</View>

						{/* Items Table */}
						<View style={[styles.section, styles.table]}>
							<View style={styles.thead}>
								<Text style={styles.thThumb}></Text>
								<Text style={[styles.th, { flex: 3 }]}>পণ্য</Text>
								<Text style={[styles.th, styles.tdRight]}>দাম</Text>
								<Text style={[styles.th, styles.tdRight]}>পরিমাণ</Text>
								<Text style={[styles.th, styles.tdRight]}>মোট</Text>
							</View>

							{(order.orderItems || []).map((item) => (
								<View key={item.id} style={styles.tbodyRow}>
									<View style={styles.tdThumb}>
										<Image
											style={styles.thumb}
											src={((): string => {
												const raw = OrderService.getProductImageUrl(
													item.productImage
												);
												if (!raw) return placeholderUrl;
												return raw.startsWith('http')
													? raw
													: (typeof window !== 'undefined'
															? `${window.location.origin}`
															: '') + raw;
											})()}
										/>
									</View>
									<Text style={{ flex: 3 }}>
										{item.productName}
										{item.variantName ? ` (${item.variantName})` : ''}
									</Text>
									<Text style={[styles.td, styles.tdRight]}>
										{currency(item.price)}
									</Text>
									<Text style={[styles.td, styles.tdRight]}>{item.quantity}</Text>
									<Text style={[styles.td, styles.tdRight]}>
										{currency(item.total)}
									</Text>
								</View>
							))}
						</View>

						{/* Totals */}
						<View style={[styles.section, styles.totals]}>
							<View style={styles.totalRow}>
								<Text style={styles.totalLabel}>সাবটোটাল:</Text>
								<Text style={styles.totalValue}>{currency(itemsTotal)}</Text>
							</View>

							<View style={styles.totalRow}>
								<Text style={styles.totalLabel}>ডেলিভারি চার্জ:</Text>
								<Text style={styles.totalValue}>
									{deliveryCharge > 0 ? currency(deliveryCharge) : '৳0.00 (ফ্রি)'}
								</Text>
							</View>

							<View style={[styles.totalRow, { marginTop: 4 }]}>
								<Text
									style={[styles.totalLabel, { fontFamily: 'NotoSansBengaliBold' }]}
								>
									গ্র্যান্ড টোটাল:
								</Text>
								<Text style={[styles.totalValue, { fontSize: 12 }]}>
									{currency(grandTotal)}
								</Text>
							</View>
						</View>

						<Text style={styles.footer}>
							এই ইনভয়েসটি আমাদের সিস্টেম থেকে স্বয়ংক্রিয়ভাবে তৈরি হয়েছে।
						</Text>
					</Page>
				</Document>
			);

			// Generate Blob and trigger browser download
			const blob = await pdf(doc).toBlob();
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `invoice-${order.id?.slice(0, 8) || 'order'}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);

			toast.success('সফল', {
				description: 'ইনভয়েস সফলভাবে ডাউনলোড করা হয়েছে।',
			});
		} catch (error) {
			console.error('Invoice generation error:', error);
			toast.error('ত্রুটি', {
				description: 'ইনভয়েস ডাউনলোড করতে সমস্যা হয়েছে।',
			});
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<Button
			variant='outline'
			size='sm'
			onClick={handleDownload}
			disabled={isGenerating}
			className='h-9 rounded-xl border-[#E5E7EB] text-xs font-bold hover:bg-[#FAFAF6] transition-colors cursor-pointer'
		>
			{isGenerating ? (
				<>
					<Loader2 className='h-3.5 w-3.5 mr-1.5 text-[#26351B] animate-spin' />
					প্রস্তুত হচ্ছে...
				</>
			) : (
				<>
					<Download className='h-3.5 w-3.5 mr-1.5 text-[#26351B]' />
					ইনভয়েস
				</>
			)}
		</Button>
	);
}

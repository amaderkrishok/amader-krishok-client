'use client';

import { useMemo } from 'react';
import {
	PDFDownloadLink,
	Document,
	Page,
	Text,
	View,
	Image,
	StyleSheet,
	Font,
} from '@react-pdf/renderer';
import type { Order } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { OrderService } from '@/services/order-service';

// Register Bengali-capable fonts from CDN (no local files required)
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
} catch {}

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
	totalRow: { flexDirection: 'row', gap: 24 },
	totalLabel: { color: '#374151' },
	totalValue: { fontFamily: 'NotoSansBengaliBold' },
	footer: { marginTop: 24, color: '#6B7280', fontSize: 9, textAlign: 'center' },
});

function formatDate(dateString?: string) {
	if (!dateString) return '';
	const d = new Date(dateString);
	return new Intl.DateTimeFormat('bn-BD', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(d);
}

function currency(n: number | string | undefined) {
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
}

function InvoiceDocument({ order }: { order: Order }) {
	const totals = useMemo(() => {
		const itemsTotal = (order.orderItems || []).reduce(
			(sum, item) =>
				sum +
				(Number(item.total) || Number(item.price) * Number(item.quantity)),
			0
		);
		const grandTotal = Number(order.totalAmount ?? itemsTotal);
		return { itemsTotal, grandTotal };
	}, [order]);

	return (
		<Document>
			<Page size='A4' style={styles.page}>
				{/* Header */}
				<View style={styles.header}>
					<Image
						style={styles.logo}
						src={
							(typeof window !== 'undefined'
								? `${window.location.origin}`
								: '') + '/images/logo.png'
						}
					/>
					<View style={styles.titleWrap}>
						<Text style={styles.title}>INVOICE</Text>
						<Text style={styles.sub}>
							অর্ডার #{order.id?.slice(0, 8) || 'N/A'}
						</Text>
						<Text style={styles.sub}>তারিখ: {formatDate(order.orderDate)}</Text>
					</View>
				</View>

				<View style={styles.line} />

				{/* Parties */}
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

				{/* Items table */}
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
							{/* Product image */}
							<View style={styles.tdThumb}>
								<Image
									style={styles.thumb}
									src={((): string => {
										const raw = OrderService.getProductImageUrl(
											item.productImage
										);
										if (!raw)
											return (
												(typeof window !== 'undefined'
													? `${window.location.origin}`
													: '') + '/images/product-placeholder.png'
											);
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
						<Text style={styles.totalValue}>{currency(totals.itemsTotal)}</Text>
					</View>
					<View style={styles.totalRow}>
						<Text style={styles.totalLabel}>গ্র্যান্ড টোটাল:</Text>
						<Text style={styles.totalValue}>{currency(totals.grandTotal)}</Text>
					</View>
				</View>

				<Text style={styles.footer}>
					এই ডকুমেন্টটি আমাদের সিস্টেম থেকে স্বয়ংক্রিয়ভাবে তৈরি হয়েছে।
				</Text>
			</Page>
		</Document>
	);
}

export function OrderInvoice({ order }: { order: Order }) {
	const fileName = `invoice-${order.id?.slice(0, 8) || 'order'}.pdf`;

	return (
		<div className='flex gap-2'>
			<PDFDownloadLink
				document={<InvoiceDocument order={order} />}
				fileName={fileName}
			>
				{({ loading }: { loading: boolean }) => (
					<Button variant='outline' size='sm'>
						<Download className='h-4 w-4 mr-1' />{' '}
						{loading ? 'প্রস্তুত হচ্ছে...' : 'ইনভয়েস'}
					</Button>
				)}
			</PDFDownloadLink>

			{/* Optional inline viewer for print */}
			{/* You can also render a hidden viewer and call window.print on it if desired */}
			{/* <PDFViewer style={{ width: 0, height: 0, display: 'none' }}>
        <InvoiceDocument order={order} />
      </PDFViewer> */}
		</div>
	);
}

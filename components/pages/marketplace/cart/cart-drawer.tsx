"use client"

import { useEffect } from "react"
import { X, ShoppingCart, Trash2, Plus, Minus, Truck, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useRouter } from "next/navigation"

export function formatPrice(price: number): string {
  // Format price in Bengali with Taka symbol
  return new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
    currencyDisplay: "symbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(price)
    .replace("৳", "৳ ")
}

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    itemCount,
    subtotal,
    deliveryCharge,
    total,
  } = useCart()

  const router = useRouter();

  // Close cart when pressing escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      // Prevent scrolling when cart is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, closeCart])

  if (!isOpen) return null

  return (
		<div
			className='fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300'
			onClick={closeCart}
		>
			<div
				className='fixed right-0 top-0 h-full w-full sm:max-w-[460px] bg-white shadow-2xl overflow-hidden flex flex-col z-50'
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className='h-[72px] px-6 border-b border-[#E2E8F0] sticky top-0 bg-white/95 backdrop-blur-md z-20 flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<div className='w-9 h-9 rounded-full bg-[#2D331F]/10 flex items-center justify-center text-[#2D331F] border border-[#2D331F]/20'>
							<ShoppingCart className='h-5 w-5' />
						</div>
						<div>
							<h2 className='text-lg font-bold text-[#172033] flex items-center gap-2 leading-tight'>
								আপনার কার্ট
								{itemCount > 0 && (
									<span className='text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#2D331F]/10 text-[#2D331F] border border-[#2D331F]/20'>
										{itemCount} টি পণ্য
									</span>
								)}
							</h2>
						</div>
					</div>
					<button
						onClick={closeCart}
						className='w-9 h-9 rounded-full flex items-center justify-center text-[#64748B] hover:text-[#172033] hover:bg-gray-100 transition-colors'
						aria-label='কার্ট বন্ধ করুন'
					>
						<X className='h-5 w-5' />
					</button>
				</div>

				{/* Cart Content */}
				<div className='flex-grow overflow-y-auto p-4 sm:p-5 space-y-3'>
					{items.length === 0 ? (
						<div className='flex flex-col items-center justify-center h-full py-16 px-6 text-center space-y-4'>
							<div className='w-20 h-20 bg-[#2D331F]/10 rounded-full flex items-center justify-center text-[#2D331F] border border-[#2D331F]/20 shadow-xs mb-2'>
								<ShoppingCart className='h-10 w-10' />
							</div>
							<h3 className='text-xl font-bold text-[#172033]'>
								আপনার কার্ট এখনো খালি
							</h3>
							<p className='text-sm text-[#64748B] max-w-xs leading-relaxed'>
								কৃষকের বাজার থেকে আপনার পছন্দের তাজা ও পুষ্টিকর পণ্য যোগ করুন।
							</p>
							<Button
								onClick={() => {
									closeCart();
									router.push('/marketplace');
								}}
								className='bg-[#2D331F] hover:bg-[#1F2516] text-[#EAB308] font-semibold px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 mt-2'
							>
								কেনাকাটা শুরু করুন <ArrowRight className='h-4 w-4' />
							</Button>
						</div>
					) : (
						<div className='space-y-3'>
							{items.map((item) => {
								const isVariable = item.product.productType === 'VARIABLE';
								const variantName = item.selectedVariant?.variantName;
								const itemDeliveryCharge = Number(
									item.product.deliveryCharge || 0
								);

								// Get the appropriate image
								let imageUrl = '/placeholder.svg';
								if (isVariable && item.selectedVariant?.images?.length) {
									imageUrl = item.selectedVariant.images[0].imageUrl;
								} else if (
									!isVariable &&
									item.product.simpleProduct?.images?.length
								) {
									imageUrl = item.product.simpleProduct.images[0].imageUrl;
								}

								// Get the price
								let price = 0;

								if (isVariable && item.selectedVariant) {
									price =
										item.selectedVariant.discountPrice != null
											? Number(item.selectedVariant.discountPrice)
											: Number(item.selectedVariant.price);
								} else if (!isVariable && item.product.simpleProduct) {
									price =
										item.product.simpleProduct.discountPrice != null
											? Number(item.product.simpleProduct.discountPrice)
											: Number(item.product.simpleProduct.price);
								}

								const formattedPrice = formatPrice(price);
								const itemTotal = formatPrice(price * item.quantity);

								return (
									<div
										key={`${item.productId}-${item.variantId || 'simple'}`}
										className='p-3.5 rounded-[14px] border border-[#E2E8F0] bg-white mb-3 hover:border-[#2D331F]/40 transition-all shadow-2xs group relative'
									>
										<div className='flex gap-3.5'>
											<div className='relative h-[80px] w-[80px] flex-shrink-0 rounded-[12px] overflow-hidden bg-gray-50 border border-gray-100'>
												<Image
													src={imageUrl || '/placeholder.svg'}
													alt={item.product.name}
													fill
													className='object-cover group-hover:scale-105 transition-transform duration-300'
												/>
											</div>

											<div className='flex-1 flex flex-col justify-between min-w-0'>
												<div>
													<div className='flex items-start justify-between gap-2'>
														<Link
															href={`/marketplace/product/${item.productId}`}
															className='font-bold text-sm text-[#172033] hover:text-[#2D331F] transition-colors line-clamp-1'
															onClick={closeCart}
														>
															{item.product.name}
														</Link>

														<button
															onClick={() =>
																removeItem(item.productId, item.variantId)
															}
															className='w-7 h-7 rounded-full flex items-center justify-center text-[#64748B] hover:text-[#EF4444] hover:bg-red-50 transition-colors -mr-1 -mt-1 flex-shrink-0'
															aria-label={`${item.product.name} কার্ট থেকে সরান`}
														>
															<Trash2 className='h-4 w-4' />
														</button>
													</div>

													{variantName ? (
														<p className='text-xs text-[#64748B] mt-0.5'>
															ধরণ: {variantName}
														</p>
													) : (
														<p className='text-[11px] text-[#64748B] mt-0.5 line-clamp-1'>
															তাজা ফল ও কৃষিপণ্য
														</p>
													)}

													<div className='inline-flex items-center gap-1 bg-[#2D331F]/10 text-[#2D331F] border border-[#2D331F]/20 text-[11px] px-2 py-0.5 rounded-full font-medium mt-1.5'>
														<Truck className='w-3 h-3 text-[#2D331F]' />
														<span>
															{itemDeliveryCharge > 0
																? `ডেলিভারি চার্জ: ${formatPrice(itemDeliveryCharge)}`
																: 'ফ্রি ডেলিভারি'}
														</span>
													</div>
												</div>

												<div className='flex items-center justify-between mt-3 pt-2 border-t border-dashed border-gray-100'>
													<div className='flex items-center bg-gray-50 border border-gray-200/80 rounded-lg p-0.5'>
														<button
															className='w-7 h-7 rounded-md flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-2xs transition-all disabled:opacity-40'
															onClick={() =>
																updateQuantity(
																	item.productId,
																	item.quantity - 1,
																	item.variantId
																)
															}
															aria-label='পরিমাণ কমান'
														>
															<Minus className='h-3 w-3' />
														</button>
														<span className='w-7 text-center text-xs font-bold text-[#172033]'>
															{item.quantity}
														</span>
														<button
															className='w-7 h-7 rounded-md flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-2xs transition-all'
															onClick={() =>
																updateQuantity(
																	item.productId,
																	item.quantity + 1,
																	item.variantId
																)
															}
															aria-label='পরিমাণ বাড়ান'
														>
															<Plus className='h-3 w-3' />
														</button>
													</div>

													<div className='text-right'>
														<div className='text-[11px] text-[#64748B]'>
															{formattedPrice} × {item.quantity}
														</div>
														<div className='font-bold text-sm text-[#2D331F]'>
															{itemTotal}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								);
							})}

							{/* Compact Recommendation Section */}
							{items.length > 0 && items.length <= 3 && (
								<div className='bg-[#2D331F]/5 border border-[#2D331F]/15 rounded-xl p-3.5 mt-4 text-center space-y-1.5'>
									<p className='text-xs font-bold text-[#2D331F]'>
										আরও কিছু যোগ করুন
									</p>
									<p className='text-[11px] text-[#64748B]'>
										তাজা কৃষিপণ্য দিয়ে আপনার বাজারের তালিকা পূরণ করুন।
									</p>
									<button
										onClick={() => {
											closeCart();
											router.push('/marketplace');
										}}
										className='inline-flex items-center gap-1 text-xs font-semibold text-[#2D331F] hover:underline pt-0.5'
									>
										কৃষকের বাজার দেখুন <ArrowRight className='h-3.5 w-3.5' />
									</button>
								</div>
							)}
						</div>
					)}
				</div>

				{/* Sticky Footer / Summary */}
				{items.length > 0 && (
					<div className='border-t border-[#E2E8F0] p-4 sm:p-5 bg-white sticky bottom-0 z-20 shadow-[0_-6px_20px_rgba(0,0,0,0.06)]'>
						<div className='space-y-3'>
							{/* Delivery Charge Card */}
							<div className='flex items-center justify-between bg-[#2D331F]/10 border border-[#2D331F]/20 rounded-xl p-3'>
								<div className='flex items-center gap-2.5'>
									<div className='w-8 h-8 rounded-full bg-[#2D331F] flex items-center justify-center flex-shrink-0 text-[#EAB308]'>
										<Truck className='w-4 h-4' />
									</div>
									<div>
										<p className='text-[11px] font-bold text-[#2D331F] uppercase tracking-wide'>
											ডেলিভারি চার্জ
										</p>
										<p className='text-xs text-[#64748B]'>
											আপনার অর্ডারের জন্য প্রযোজ্য
										</p>
									</div>
								</div>
								<span className='font-bold text-sm text-[#2D331F] bg-white px-2.5 py-1 rounded-lg border border-[#2D331F]/20 shadow-2xs'>
									{deliveryCharge > 0 ? formatPrice(deliveryCharge) : 'ফ্রি'}
								</span>
							</div>

							{/* Order Summary Rows */}
							<div className='space-y-2 text-xs text-[#64748B]'>
								<div className='flex justify-between items-center'>
									<span>পণ্যের মূল্য</span>
									<span className='font-medium text-[#172033]'>
										{formatPrice(subtotal)}
									</span>
								</div>
								<div className='flex justify-between items-center'>
									<span>ডেলিভারি চার্জ</span>
									<span className='font-medium text-[#2D331F]'>
										{deliveryCharge > 0 ? formatPrice(deliveryCharge) : 'ফ্রি'}
									</span>
								</div>

								<div className='h-px bg-[#E2E8F0] my-2'></div>

								<div className='flex justify-between items-center text-sm pt-0.5'>
									<span className='font-bold text-[#172033]'>মোট মূল্য</span>
									<span className='font-extrabold text-lg text-[#2D331F]'>
										{formatPrice(total)}
									</span>
								</div>
							</div>

							{/* Buttons */}
							<div className='space-y-2 pt-1'>
								<Button
									className='w-full bg-[#2D331F] hover:bg-[#1F2516] text-[#EAB308] font-bold h-12 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-sm'
									onClick={() => {
										closeCart();
										router.push('/order');
									}}
								>
									<span>চেকআউট করুন ({formatPrice(total)})</span>
									<ArrowRight className='h-4 w-4' />
								</Button>
								<Button
									variant='outline'
									className='w-full border-[#E2E8F0] text-[#172033] hover:bg-gray-50 font-medium h-11 rounded-xl text-xs'
									onClick={closeCart}
								>
									কেনাকাটা চালিয়ে যান
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
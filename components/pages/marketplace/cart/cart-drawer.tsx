"use client"

import { useEffect } from "react"
import { X, ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
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
			className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm'
			onClick={closeCart}
		>
			<div
				className='fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-hidden flex flex-col'
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className='p-4 border-b sticky top-0 bg-white z-10'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<ShoppingCart className='h-5 w-5 text-green-600' />
							<h2 className='text-xl font-semibold'>
								আপনার কার্ট{' '}
								{itemCount > 0 && (
									<span className='text-green-600'>({itemCount})</span>
								)}
							</h2>
						</div>
						<Button
							variant='ghost'
							size='icon'
							onClick={closeCart}
							aria-label='কার্ট বন্ধ করুন'
						>
							<X className='h-5 w-5' />
						</Button>
					</div>
				</div>

				{/* Cart Content */}
				<div className='flex-grow overflow-y-auto p-4'>
					{items.length === 0 ? (
						<div className='flex flex-col items-center justify-center h-full py-12 text-center'>
							<div className='bg-gray-50 rounded-full p-6 mb-4'>
								<ShoppingCart className='h-12 w-12 text-gray-400' />
							</div>
							<h3 className='text-lg font-medium mb-2'>আপনার কার্ট খালি</h3>
							<p className='text-gray-500 mb-6'>
								আপনি এখনও কোন পণ্য আপনার কার্টে যোগ করেননি।
							</p>
							<Button onClick={closeCart}>কেনাকাটা চালিয়ে যান</Button>
						</div>
					) : (
						<div className='space-y-1'>
							{items.map((item) => {
								const isVariable = item.product.productType === 'VARIABLE';
								const variantName = item.selectedVariant?.variantName;

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
										className='p-4 rounded-lg border border-gray-100 bg-white mb-3 hover:border-gray-200 transition-colors'
									>
										<div className='flex gap-3'>
											<div className='relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-50'>
												<Image
													src={imageUrl || '/placeholder.svg'}
													alt={item.product.name}
													fill
													className='object-cover'
												/>
											</div>

											<div className='flex-1'>
												<div className='flex justify-between'>
													<Link
														href={`/marketplace/product/${item.productId}`}
														className='font-medium hover:text-green-600 transition-colors line-clamp-1'
														onClick={closeCart}
													>
														{item.product.name}
													</Link>

													<Button
														variant='ghost'
														size='icon'
														className='h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50 -mr-1.5 -mt-1'
														onClick={() =>
															removeItem(item.productId, item.variantId)
														}
														aria-label={`${item.product.name} কার্ট থেকে সরান`}
													>
														<Trash2 className='h-4 w-4' />
													</Button>
												</div>

												{variantName && (
													<p className='text-xs text-gray-500 mt-1'>
														ধরণ: {variantName}
													</p>
												)}

												<div className='flex items-center justify-between mt-3'>
													<div className='flex items-center bg-gray-50 rounded-md'>
														<Button
															variant='ghost'
															size='icon'
															className='h-7 w-7 rounded-l-md'
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
														</Button>
														<span className='w-8 text-center text-sm'>
															{item.quantity}
														</span>
														<Button
															variant='ghost'
															size='icon'
															className='h-7 w-7 rounded-r-md'
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
														</Button>
													</div>

													<div className='font-medium text-right'>
														<div className='text-sm text-gray-500'>
															{formattedPrice} × {item.quantity}
														</div>
														<div>{itemTotal}</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>

				{/* Footer */}
				{items.length > 0 && (
					<div className='border-t p-4 bg-white sticky bottom-0'>
						<div className='space-y-4'>
							<div className='flex justify-between items-center'>
								<span className='font-medium text-gray-600'>মোট মূল্য</span>
								<span className='font-bold text-lg'>
									{formatPrice(subtotal)}
								</span>
							</div>

							<p className='text-xs text-gray-500'>
								শিপিং এবং ট্যাক্স চেকআউটে গণনা করা হবে
							</p>

							<div className='grid gap-2'>
								<Button
									className='w-full bg-green-600 hover:bg-green-700'
									size='lg'
									onClick={() => {
										closeCart(); // Close the cart drawer
										router.push('/order'); // Redirect to order page
									}}
								>
									চেকআউট করুন
								</Button>
								<Button
									variant='outline'
									className='w-full border-gray-200'
									onClick={closeCart}
								>
									কেনাকাটা চালিয়ে যান
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
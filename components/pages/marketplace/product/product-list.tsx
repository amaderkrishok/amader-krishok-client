"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import type { Product } from "@/types/product"
import { ProductListSkeleton } from "./product-list-skeleton"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "../cart/cart-drawer"

interface ProductListProps {
  products: Product[]
  isLoading: boolean
}

export function ProductList({ products, isLoading }: ProductListProps) {
  if (isLoading) {
    return <ProductListSkeleton />
  }

  if (!isLoading && products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No products found</h3>
        <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or search criteria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <ProductListItem key={product.id} product={product} />
      ))}
    </div>
  )
}

interface ProductListItemProps {
  product: Product
}

function ProductListItem({ product }: ProductListItemProps) {
  const { addItem } = useCart()
  const images = getAllProductImages(product)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const priceInfo = getProductPrice(product)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // For simple products, add directly
    // For variable products, navigate to product page to select variant
    if (product.productType === "SIMPLE") {
      addItem(product, 1)
    } else {
      window.location.href = `/marketplace/${product.id}`
    }
  }

  return (
    <div className="flex flex-col sm:flex-row border-transparent shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 group/card">
      <div className="relative w-full sm:w-40 h-48 sm:h-full min-h-[160px] flex-shrink-0 bg-gray-50/50">
        <Link href={`/marketplace/${product.id}`} className="block h-full w-full">
          <Image
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-in-out group-hover/card:scale-110"
            sizes="(max-width: 768px) 100vw, 160px"
          />
          <div className='absolute inset-0 bg-black/0 group-hover/card:bg-black/10 transition-colors duration-300 z-10'></div>
        </Link>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault()
                prevImage()
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur text-gray-800 p-1.5 rounded-full hover:bg-white hover:text-green-600 shadow-md opacity-0 group-hover/card:opacity-100 transition-all duration-300 z-20 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                nextImage()
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur text-gray-800 p-1.5 rounded-full hover:bg-white hover:text-green-600 shadow-md opacity-0 group-hover/card:opacity-100 transition-all duration-300 z-20 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentImageIndex(idx)
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 z-20 ${currentImageIndex === idx ? "w-4 bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" : "w-1.5 bg-white/80 hover:bg-white"}`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex-grow p-5 flex flex-col justify-between">
        <div className="flex-grow">
          <Link href={`/marketplace/${product.id}`} className="block group/title">
            <h3 className="font-bold text-lg group-hover/title:text-green-600 transition-colors text-gray-900">{product.name}</h3>
          </Link>
          <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">{product.description}</p>

          {product.productCategories && product.productCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {product.productCategories.map((category) => (
                <span key={category.id} className="text-[11px] font-medium tracking-wide bg-green-50 px-2.5 py-1 rounded-full text-green-700 border border-green-100/50">
                  {category.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 pt-4 border-t border-gray-50/50 gap-4">
          <div>
            {product.productType === "VARIABLE" ? (
              <div className="font-extrabold text-xl text-gray-900">{priceInfo.formattedPrice}</div>
            ) : priceInfo.hasDiscount ? (
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-green-600">{priceInfo.formattedDiscountPrice}</span>
                <span className="text-gray-400 line-through text-xs font-medium">{priceInfo.formattedPrice}</span>
              </div>
            ) : (
              <span className="font-extrabold text-xl text-gray-900">{priceInfo.formattedPrice}</span>
            )}
          </div>
          <Button 
            size="sm" 
            onClick={handleAddToCart}
            className="w-full sm:w-auto rounded-xl transition-all duration-300 font-semibold shadow-sm hover:shadow-md active:scale-95 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white border-0"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.productType === "VARIABLE" ? "বিকল্প দেখুন" : "কার্টে যোগ করুন"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Helper functions
function getAllProductImages(product: Product): string[] {
  const images: string[] = []

  if (product.productType === "SIMPLE" && product.simpleProduct?.images?.length) {
    return product.simpleProduct.images.map((img) => img.imageUrl)
  } else if (product.productType === "VARIABLE" && product.variableProduct?.variants?.length) {
    product.variableProduct.variants.forEach((variant) => {
      if (variant.images?.length) {
        variant.images.forEach((img) => {
          if (!images.includes(img.imageUrl)) {
            images.push(img.imageUrl)
          }
        })
      }
    })
  }

  return images.length ? images : ["/placeholder.svg?height=300&width=300"]
}

function getProductPrice(product: Product) {
  let price = 0
  let discountPrice: number | undefined = undefined
  let priceRange = false
  let formattedPrice = ""
  let formattedDiscountPrice: string | undefined = undefined

  if (product.productType === "SIMPLE" && product.simpleProduct) {
    // Handle null or undefined price
    if (product.simpleProduct.price != null) {
      price = Number.parseFloat(String(product.simpleProduct.price))
    }

    // Handle null or undefined discountPrice
    if (product.simpleProduct.discountPrice != null) {
      discountPrice = Number.parseFloat(String(product.simpleProduct.discountPrice))
    }

    formattedPrice = formatPrice(price)
    formattedDiscountPrice = discountPrice !== undefined ? formatPrice(discountPrice) : undefined
  } else if (product.productType === "VARIABLE" && product.variableProduct?.variants?.length) {
    // Extract prices, handling null or undefined values
    const prices = product.variableProduct.variants
      .filter((v) => v.price != null)
      .map((v) => Number.parseFloat(String(v.price)))

    if (prices.length > 0) {
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      // If there's a price range, show it
      if (minPrice !== maxPrice) {
        priceRange = true
        formattedPrice = `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
      } else {
        price = minPrice
        formattedPrice = formatPrice(price)
      }

      // Handle discount prices, filtering out null or undefined values
      const discountPrices = product.variableProduct.variants
        .filter((v) => v.discountPrice != null)
        .map((v) => Number.parseFloat(String(v.discountPrice)))

      if (discountPrices.length > 0) {
        const minDiscountPrice = Math.min(...discountPrices)
        const maxDiscountPrice = Math.max(...discountPrices)

        if (minDiscountPrice !== maxDiscountPrice && discountPrices.length === prices.length) {
          formattedDiscountPrice = `${formatPrice(minDiscountPrice)} - ${formatPrice(maxDiscountPrice)}`
        } else if (discountPrices.length > 0) {
          discountPrice = minDiscountPrice
          formattedDiscountPrice = formatPrice(discountPrice)
        }
      }
    } else {
      // No valid prices found
      formattedPrice = formatPrice(0)
    }
  } else {
    // Fallback for any other case
    formattedPrice = formatPrice(0)
  }

  const hasDiscount = discountPrice !== undefined && discountPrice < price

  return {
    price,
    discountPrice,
    hasDiscount,
    priceRange,
    formattedPrice,
    formattedDiscountPrice,
  }
}

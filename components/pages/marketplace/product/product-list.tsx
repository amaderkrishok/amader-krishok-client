"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ShoppingCart, Star, TrendingUp, Clock } from "lucide-react"
import type { Product } from "@/types/product"
import { ProductListSkeleton } from "./product-list-skeleton"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "../cart/cart-drawer"
import { useSavedProducts } from "@/context/saved-products-context"
import { Bookmark } from "lucide-react"
import { useSession } from "@/components/providers/session-provider"
import { useRouter } from "next/navigation"

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
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-4">
          <ShoppingCart className="h-10 w-10 text-gray-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
        <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">Try adjusting your filters or search criteria to find what you're looking for.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
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
  const { user, status } = useSession()
  const router = useRouter()

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const { toggleSaveProduct, isProductSaved } = useSavedProducts();
  const isSaved = isProductSaved(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (product.productType === "SIMPLE") {
      addItem(product, 1)
    } else {
      window.location.href = `/marketplace/${product.id}`
    }
  }

  return (
    <div className="group relative flex flex-col sm:flex-row bg-white rounded-2xl border border-gray-100/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.12)] transition-all duration-400 ease-out hover:-translate-y-1.5 overflow-hidden">
      {/* Premium accent gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2D331F] via-[#EAB308] to-[#2D331F] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Image Section */}
      <div className="relative w-full sm:w-44 lg:w-52 h-52 sm:h-auto min-h-[180px] flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100/30">
        <Link href={`/marketplace/${product.id}`} className="block h-full w-full">
          <Image
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 208px"
            priority={currentImageIndex === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Quick action badges */}
        {product.productType === "VARIABLE" && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50/90 backdrop-blur-sm text-blue-700 text-[10px] font-semibold rounded-full border border-blue-100/50 shadow-sm">
              <TrendingUp className="h-3 w-3" />
              Variants
            </span>
          </div>
        )}

        {priceInfo.hasDiscount && (
          <div className="absolute top-3 right-12 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50/90 backdrop-blur-sm text-red-600 text-[10px] font-bold rounded-full border border-red-100/50 shadow-sm">
              <Clock className="h-3 w-3" />
              {Math.round(((priceInfo.price - (priceInfo.discountPrice || 0)) / priceInfo.price) * 100)}% OFF
            </span>
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (status === 'unauthenticated' || !user) {
              router.push('/auth/login');
              return;
            }
            toggleSaveProduct(product);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-20 hover:scale-110 shadow-sm ${
            isSaved 
              ? 'bg-[#2D331F]/10 text-[#2D331F] border border-[#2D331F]/20' 
              : 'bg-white/80 text-gray-500 hover:text-[#2D331F] hover:bg-white border border-gray-200/50'
          }`}
          aria-label={isSaved ? 'Remove from saved' : 'Save product'}
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault()
                prevImage()
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-full hover:bg-white hover:text-[#EAB308] shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 hover:scale-110 border border-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                nextImage()
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-full hover:bg-white hover:text-[#EAB308] shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 hover:scale-110 border border-white/20"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Image indicator dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentImageIndex(idx)
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    currentImageIndex === idx
                      ? "w-6 h-1.5 bg-white shadow-lg shadow-black/20"
                      : "w-1.5 h-1.5 bg-white/60 hover:bg-white/90"
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-grow p-5 lg:p-6 flex flex-col justify-between">
        <div className="flex-grow">
          <Link href={`/marketplace/${product.id}`} className="block">
            <h3 className="font-bold text-lg lg:text-xl text-gray-900 group-hover:text-[#2D331F] transition-colors duration-300 line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Categories */}
          {product.productCategories && product.productCategories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {product.productCategories.slice(0, 3).map((category) => (
                <span
                  key={category.id}
                  className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-100/80 hover:bg-[#2D331F]/10 hover:text-[#2D331F] hover:border-[#2D331F]/20 transition-colors duration-200"
                >
                  {category.name}
                </span>
              ))}
              {product.productCategories.length > 3 && (
                <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-gray-50 text-gray-400 border border-gray-100/80">
                  +{product.productCategories.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 pt-4 border-t border-gray-100 gap-3">
          <div className="w-full sm:w-auto">
            {product.productType === "VARIABLE" ? (
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-medium text-gray-400">From</span>
                <span className="font-bold text-xl text-gray-900">{priceInfo.formattedPrice}</span>
              </div>
            ) : priceInfo.hasDiscount ? (
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-xl text-[#2D331F]">{priceInfo.formattedDiscountPrice}</span>
                  <span className="text-sm text-gray-400 line-through font-medium">{priceInfo.formattedPrice}</span>
                </div>
              </div>
            ) : (
              <span className="font-bold text-xl text-gray-900">{priceInfo.formattedPrice}</span>
            )}
          </div>

          <Button
            size="default"
            onClick={handleAddToCart}
            className="w-full sm:w-auto min-w-[140px] rounded-xl font-semibold shadow-sm hover:shadow-md active:scale-95 transition-all duration-300 bg-gradient-to-r from-[#2D331F] to-[#2D331F]/90 hover:from-[#2D331F]/90 hover:to-[#2D331F] text-[#EAB308] border-0 group/btn"
          >
            <ShoppingCart className="h-4 w-4 mr-2 transition-transform group-hover/btn:scale-110" />
            {product.productType === "VARIABLE" ? "View Options" : "Add to Cart"}
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
    if (product.simpleProduct.price != null) {
      price = Number.parseFloat(String(product.simpleProduct.price))
    }

    if (product.simpleProduct.discountPrice != null) {
      discountPrice = Number.parseFloat(String(product.simpleProduct.discountPrice))
    }

    formattedPrice = formatPrice(price)
    formattedDiscountPrice = discountPrice !== undefined ? formatPrice(discountPrice) : undefined
  } else if (product.productType === "VARIABLE" && product.variableProduct?.variants?.length) {
    const prices = product.variableProduct.variants
      .filter((v) => v.price != null)
      .map((v) => Number.parseFloat(String(v.price)))

    if (prices.length > 0) {
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      if (minPrice !== maxPrice) {
        priceRange = true
        formattedPrice = `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
      } else {
        price = minPrice
        formattedPrice = formatPrice(price)
      }

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
      formattedPrice = formatPrice(0)
    }
  } else {
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
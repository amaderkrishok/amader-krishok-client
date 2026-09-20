import { StoreHeader } from '@/components/pages/marketplace/stores/store-header';
import { StoreProducts } from '@/components/pages/marketplace/stores/store-products';
import { ProductService } from '@/services/product-service';
import { StoreService } from '@/services/store-service';
import { ChatProviderWrapper } from '@/providers/ChatProviderWrapper';
import { notFound } from 'next/navigation';

// Specify that we handle dynamic params
export const dynamicParams = true;

// Fix the metadata function with the proper async handling
export async function generateMetadata({
  params,
}: {
  params: { id: string }
}) {
  // When using dynamic params in Next.js 14, we need to access them in a specific way
  const { id } = await params;

  try {
    const storeResponse = await StoreService.getStoreById(id);
    const store = storeResponse;

    if (!store) {
      return {
        title: 'স্টোর পাওয়া যায়নি',
        description: 'অনুরোধকৃত স্টোর পাওয়া যায়নি',
      };
    }

    return {
      title: `${store.name} | কৃষকের বাজার`,
      description: store.description || `${store.name} এর পণ্যসমূহ`,
    };
  } catch (error) {
    console.error('Error fetching store metadata:', error);
    return {
      title: 'স্টোর পাওয়া যায়নি',
      description: 'অনুরোধকৃত স্টোর পাওয়া যায়নি',
    };
  }
}

// Fix the page component with proper async handling
export default async function StorePage({
  params,
}: {
  params: { id: string }
}) {
  // Destructure id from params
  const { id } = await params;

  try {
    const storeResponse = await StoreService.getStoreById(id);
    const store = storeResponse?.data;

    if (!store) {
      notFound();
    }

    try {
      const productsResponse = await ProductService.getProductsByStore(
        store.id,
        1,
        12
      );

      const products = productsResponse?.data || [];
      const meta = productsResponse?.meta || {
        itemsPerPage: 12,
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
      };

      return (
        <ChatProviderWrapper>
          <div className='min-h-screen bg-[#F7F6F0] w-full px-4 sm:px-6 lg:px-[10%] xl:px-[14%] 2xl:px-12 pt-28 sm:pt-36 pb-16 selection:bg-[#F4B400] selection:text-[#172033]'>
            <div className='max-w-7xl mx-auto space-y-8'>
              <StoreHeader store={store} productsCount={meta.totalItems || products.length} />

              <StoreProducts
                storeId={store.id}
                storeName={store.name}
                initialProducts={products}
                initialMeta={meta}
              />
            </div>
          </div>
        </ChatProviderWrapper>
      );
    } catch (productError) {
      console.error('Error fetching store products:', productError);
      
      return (
        <ChatProviderWrapper>
          <div className='min-h-screen bg-[#F7F6F0] w-full px-4 sm:px-6 lg:px-[10%] xl:px-[14%] 2xl:px-12 pt-28 sm:pt-36 pb-16 selection:bg-[#F4B400] selection:text-[#172033]'>
            <div className='max-w-7xl mx-auto space-y-8'>
              <StoreHeader store={store} productsCount={0} />

              <div className='text-center py-16 px-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs max-w-lg mx-auto'>
                <p className='text-lg font-bold text-[#172033]'>পণ্য লোড করতে সমস্যা হয়েছে</p>
                <p className='mt-1 text-sm text-[#667085]'>পরে আবার চেষ্টা করুন</p>
              </div>
            </div>
          </div>
        </ChatProviderWrapper>
      );
    }
  } catch (error) {
    console.error('Error loading store page:', error);
    notFound();
  }
}
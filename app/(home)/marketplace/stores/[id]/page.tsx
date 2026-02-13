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
          <div className='container mx-auto px-4 py-8'>
            <StoreHeader store={store} />

            <div className='mt-8'>
              <h2 className='text-2xl font-bold mb-6'>{store.name} এর পণ্যসমূহ</h2>

              <StoreProducts
                storeId={store.id}
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
          <div className='container mx-auto px-4 py-8'>
            <StoreHeader store={store} />

            <div className='mt-8'>
              <h2 className='text-2xl font-bold mb-6'>{store.name} এর পণ্যসমূহ</h2>

              <div className='text-center py-12 bg-gray-50 rounded-lg'>
                <p className='text-lg text-gray-600'>পণ্য লোড করতে সমস্যা হয়েছে</p>
                <p className='mt-2 text-gray-500'>পরে আবার চেষ্টা করুন</p>
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
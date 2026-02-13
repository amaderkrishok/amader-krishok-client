import { Metadata } from 'next';
import { getBlogMetadata, getBlogListingJsonLd } from '@/lib/metadata';

export const metadata: Metadata = getBlogMetadata();

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD script for blog listing
  const jsonLd = getBlogListingJsonLd();

  return (
    <>
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
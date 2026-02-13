'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar';

// This component uses useSearchParams, so it needs to be isolated
function TopLoadingBarContent() {
  // Use properly typed ref
  const loadingRef = useRef<LoadingBarRef>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track if component has mounted
  const isMounted = useRef(false);
  const isNavigating = useRef(false);

  // Handle route changes using Next.js App Router hooks
  useEffect(() => {
    if (!isMounted.current) {
      // First render - start loading bar
      loadingRef.current?.continuousStart();
      isMounted.current = true;
    } else if (isNavigating.current) {
      // Complete loading after route change finishes
      loadingRef.current?.complete();
      isNavigating.current = false;
    }

    // Wait for content to fully render
    const timer = setTimeout(() => {
      if (isMounted.current && document.readyState === 'complete') {
        loadingRef.current?.complete();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Handle link clicks
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as Element;
      const link = target.closest('a');

      if (
        link &&
        link.href &&
        link.href.startsWith(window.location.origin) &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        e.button === 0 // Left mouse button
      ) {
        isNavigating.current = true;
        loadingRef.current?.continuousStart();
      }
    };

    // Handle navigation events
    const handleBeforeUnload = () => {
      loadingRef.current?.continuousStart();
    };

    document.addEventListener('click', handleLinkClick);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Monitor page load state
    if (document.readyState !== 'complete') {
      loadingRef.current?.continuousStart();

      const handleLoad = () => {
        loadingRef.current?.complete();
      };

      window.addEventListener('load', handleLoad);
      return () => {
        window.removeEventListener('load', handleLoad);
        document.removeEventListener('click', handleLinkClick);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }

    return () => {
      document.removeEventListener('click', handleLinkClick);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <LoadingBar
      color='var(--loading-bar-color, #1dd12f)'
      ref={loadingRef}
      shadow={true}
      height={3}
    />
  );
}

// Main component with Suspense boundary
export default function TopLoadingBar() {
  return (
    <Suspense fallback={
      // This fallback should look identical to the loading bar
      <LoadingBar 
        color='var(--loading-bar-color, #1dd12f)'
        shadow={true}
        height={3}
        progress={20} // Show some progress to indicate loading
      />
    }>
      <TopLoadingBarContent />
    </Suspense>
  );
}
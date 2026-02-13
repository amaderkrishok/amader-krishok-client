import { useState, useEffect, useRef, useCallback } from 'react';

export type TableOfContentItem = {
	id: string;
	title: string;
	level: number;
};

type UseTableOfContentsOptions = {
	tableOfContent: TableOfContentItem[];
	contentRef: React.RefObject<HTMLElement>;
	offset?: number;
};

export function useTableOfContents({
	tableOfContent,
	contentRef,
	offset = -100,
}: UseTableOfContentsOptions) {
	const [activeSection, setActiveSection] = useState<string>('');
	const headingRefs = useRef<Map<string, HTMLElement>>(new Map());

	// Scroll to a specific section
	const scrollToSection = useCallback(
		(id: string) => {
			if (!contentRef.current) return;

			const element = contentRef.current.querySelector(`#${id}`);
			if (element) {
				setActiveSection(id);

				const y =
					element.getBoundingClientRect().top + window.pageYOffset + offset;
				window.scrollTo({
					top: y,
					behavior: 'smooth',
				});
			}
		},
		[contentRef, offset]
	);

	// Setup headings and intersection observer
	useEffect(() => {
		if (!tableOfContent?.length || !contentRef.current) return;

		// Keep a reference to the element for cleanup
		const contentElement = contentRef.current;

		// Create mapping between heading content and TOC IDs
		const headingToIdMap = new Map();
		tableOfContent.forEach((item) => {
			headingToIdMap.set(item.title.trim(), item.id);
		});

		// Process all headings in the content
		const processHeadings = () => {
			// Find all heading elements
			const headingElements = Array.from(
				contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6')
			) as HTMLElement[];

			// Make sure headings have IDs that match the TOC
			headingElements.forEach((heading) => {
				const headingText = heading.textContent?.trim() || '';
				const tocId = headingToIdMap.get(headingText);

				if (tocId && !heading.id) {
					heading.id = tocId;
					heading.setAttribute('data-toc-id', tocId);
					headingRefs.current.set(tocId, heading);
				} else if (heading.id) {
					headingRefs.current.set(heading.id, heading);
				}
			});

			return headingElements;
		};

		// Setup scroll event to handle manual scrolling
		const handleScroll = () => {
			if (headingRefs.current.size === 0) return;

			// Find the heading closest to the top of the viewport
			let closestHeading: HTMLElement | null = null;
			let closestDistance = Infinity;

			headingRefs.current.forEach((heading, id) => {
				const distance = Math.abs(
					heading.getBoundingClientRect().top - 100 // 100px from the top of viewport
				);

				if (distance < closestDistance) {
					closestDistance = distance;
					closestHeading = heading;
				}
			});

			if (
				closestHeading &&
				(closestHeading.getBoundingClientRect().top <= 100 ||
					closestHeading.getBoundingClientRect().top <=
						window.innerHeight * 0.5)
			) {
				const id =
					closestHeading.id || closestHeading.getAttribute('data-toc-id');
				if (id) setActiveSection(id);
			}
		};

		// Observe each heading with Intersection Observer (for performance)
		const setupObserver = (headingElements: HTMLElement[]) => {
			const observer = new IntersectionObserver(
				(entries) => {
					// This will update the activeSection when a heading enters the viewport
					const visibleHeadings = entries.filter(
						(entry) =>
							entry.isIntersecting || entry.boundingClientRect.top <= 100
					);

					if (visibleHeadings.length > 0) {
						visibleHeadings.sort(
							(a, b) =>
								Math.abs(a.boundingClientRect.top) -
								Math.abs(b.boundingClientRect.top)
						);

						const activeElement = visibleHeadings[0].target as HTMLElement;
						const id =
							activeElement.id || activeElement.getAttribute('data-toc-id');

						if (id) setActiveSection(id);
					}
				},
				{
					rootMargin: `${offset}px 0px -70% 0px`,
					threshold: [0, 0.25, 0.5, 0.75, 1],
				}
			);

			headingElements.forEach((heading) => {
				if (heading.id || heading.getAttribute('data-toc-id')) {
					observer.observe(heading);
				}
			});

			return observer;
		};

		// Give the content a moment to fully render
		const timeoutId = setTimeout(() => {
			const headings = processHeadings();
			const observer = setupObserver(headings);

			// Add scroll listener for manual scrolling
			window.addEventListener('scroll', handleScroll, { passive: true });

			// If we have headings but no active section yet, find the first visible one
			if (headings.length > 0 && !activeSection) {
				handleScroll();
			}

			return () => {
				observer.disconnect();
				window.removeEventListener('scroll', handleScroll);
			};
		}, 500);

		return () => {
			clearTimeout(timeoutId);
			window.removeEventListener('scroll', handleScroll);
		};
	}, [tableOfContent, contentRef, offset]);

	return { activeSection, scrollToSection };
}

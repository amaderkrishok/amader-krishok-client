import axios from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TableOfContentItem } from '@/types/post';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getAxiosErrorMessage(error: unknown): string {
	if (axios.isAxiosError(error)) {
		return error.response?.data?.error || error.message;
	}
	return 'Unknown error occurred';
}

// Update the generateSlug function to handle Bangla text
export const generateSlug = (name: string): string => {
	// If empty string, return empty slug
	if (!name.trim()) return '';

	// Check if the name contains mostly Bangla characters
	const containsBangla = /[\u0980-\u09FF]/.test(name);

	if (containsBangla) {
		// For Bangla text:
		// 1. Transliterate common Bangla sounds to Latin characters
		// 2. Remove any remaining non-Latin characters
		// 3. Format as slug

		// Simple transliteration map for common Bangla characters
		const transliterationMap: Record<string, string> = {
			অ: 'o',
			আ: 'a',
			ই: 'i',
			ঈ: 'i',
			উ: 'u',
			ঊ: 'u',
			এ: 'e',
			ঐ: 'oi',
			ও: 'o',
			ঔ: 'ou',
			ক: 'k',
			খ: 'kh',
			গ: 'g',
			ঘ: 'gh',
			ঙ: 'ng',
			চ: 'ch',
			ছ: 'chh',
			জ: 'j',
			ঝ: 'jh',
			ঞ: 'n',
			ট: 't',
			ঠ: 'th',
			ড: 'd',
			ঢ: 'dh',
			ণ: 'n',
			ত: 't',
			থ: 'th',
			দ: 'd',
			ধ: 'dh',
			ন: 'n',
			প: 'p',
			ফ: 'f',
			ব: 'b',
			ভ: 'bh',
			ম: 'm',
			য: 'j',
			র: 'r',
			ল: 'l',
			শ: 'sh',
			ষ: 'sh',
			স: 's',
			হ: 'h',
			ড়: 'r',
			ঢ়: 'rh',
			য়: 'y',
			ৎ: 't',
			'ং': 'ng',
			'ঃ': 'h',
			'ঁ': 'n',
			'্': '',
			'া': 'a',
			'ি': 'i',
			'ী': 'i',
			'ু': 'u',
			'ূ': 'u',
			'ৃ': 'ri',
			'ে': 'e',
			'ৈ': 'oi',
			'ো': 'o',
			'ৌ': 'ou',
			// Add space characters, numbers, etc.
			' ': '-',
			'০': '0',
			'১': '1',
			'২': '2',
			'৩': '3',
			'৪': '4',
			'৫': '5',
			'৬': '6',
			'৭': '7',
			'৮': '8',
			'৯': '9',
		};

		let transliterated = '';

		// Loop through each character and transliterate
		for (let i = 0; i < name.length; i++) {
			const char = name[i];
			transliterated += transliterationMap[char] || char;
		}

		// Now clean up the transliterated string to form a proper slug
		return transliterated
			.toLowerCase()
			.replace(/[^\w\s-]/g, '') // Remove any remaining non-word chars
			.replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
			.replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
	}

	// For English/Latin text, use the original function
	return name
		.toLowerCase()
		.replace(/[^\w\s-]/g, '') // Remove non-word chars
		.replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
		.replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Extracts table of contents from Plate editor content
 * @param content The editor content to analyze
 * @returns An array of table of content items
 */
export function extractTableOfContents(content: any): TableOfContentItem[] {
	if (!content || !Array.isArray(content)) return [];

	const toc: TableOfContentItem[] = [];

	// Process nodes to find headings
	for (const node of content) {
		// Check if this is a heading node
		if (
			node.type === 'h1' ||
			node.type === 'h2' ||
			node.type === 'h3' ||
			node.type === 'h4' ||
			node.type === 'h5' ||
			node.type === 'h6'
		) {
			// Get heading level (h1 = 1, h2 = 2, etc.)
			const level = parseInt(node.type.substring(1), 10);

			// Extract text content from the node
			let title = '';
			if (node.children && Array.isArray(node.children)) {
				title = node.children
					.map((child: any) => child.text || '')
					.join('')
					.trim();
			}

			if (title) {
				// Use the existing node ID from the editor
				toc.push({
					id: node.id, // Use the editor's ID directly
					level,
					title,
					children: [],
				});
			}
		}
	}

	// Build hierarchy (nest children under parents)
	const buildHierarchy = (
		items: TableOfContentItem[]
	): TableOfContentItem[] => {
		const result: TableOfContentItem[] = [];
		const stack: TableOfContentItem[] = [];

		for (const item of items) {
			// Remove all items from stack that are at same or lower level
			while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
				stack.pop();
			}

			if (stack.length === 0) {
				// This is a top-level item
				result.push(item);
			} else {
				// This is a child of the last item in the stack
				stack[stack.length - 1].children.push(item);
			}

			stack.push(item);
		}

		return result;
	};

	return buildHierarchy(toc);
}

export function isMobileDevice() {
	return typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);
  }
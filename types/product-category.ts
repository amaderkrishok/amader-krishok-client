export interface BasicCategoryType {
	id: number;
	name: string;
}

export interface ProductCategoryType {
	id: number; // No longer optional
	name: string;
	parent: BasicCategoryType | null; // Object instead of just an ID
	children?: ProductCategoryType[]; // Keep optional for UI flexibility
}

// For backward compatibility if needed
export interface ProductCategoryLegacyType {
	id?: number;
	name: string;
	parentId?: number | null;
	children?: ProductCategoryLegacyType[];
}

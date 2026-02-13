'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCategoryService } from '@/services/product-category-service';


// Types for categories
interface Category {
    id: number;
    name: string;
    children?: Category[];
    description?: string;
}

interface FlattenedCategory {
    id: number;
    name: string;
    description?: string;
    path: string; // Full path including parent categories
}

interface CategorySelectorProps {
    selectedCategories: number[];
    onChange: (value: number[]) => void;
}

export function CategorySelector({
    selectedCategories,
    onChange,
}: CategorySelectorProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<FlattenedCategory[]>([]);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const response = await ProductCategoryService.getProductAllCategories();
                if (response && response.data && response.data.length > 0) {
                    // Flatten the nested category structure for easier selection
                    const flattenedCategories = flattenCategories(response.data);
                    setCategories(flattenedCategories);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Function to flatten nested categories
    const flattenCategories = (
        categories: Category[],
        parentPath = ''
    ): FlattenedCategory[] => {
        let result: FlattenedCategory[] = [];

        categories.forEach((category) => {
            // Skip the "All Products" root category but include its children
            if (category.name === 'All Products' && !parentPath) {
                if (category.children && category.children.length > 0) {
                    result = result.concat(
                        flattenCategories(category.children, '')
                    );
                }
            } else {
                const currentPath = parentPath
                    ? `${parentPath} > ${category.name}`
                    : category.name;
                
                result.push({
                    id: category.id,
                    name: category.name,
                    description: category.description,
                    path: currentPath,
                });

                if (category.children && category.children.length > 0) {
                    result = result.concat(
                        flattenCategories(category.children, currentPath)
                    );
                }
            }
        });

        return result;
    };

    const toggleCategory = (categoryId: number) => {
        if (selectedCategories.includes(categoryId)) {
            onChange(selectedCategories.filter((id) => id !== categoryId));
        } else {
            onChange([...selectedCategories, categoryId]);
        }
        // Don't close the popover when selecting to allow multiple selections
    };

    const removeCategory = (categoryId: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onChange(selectedCategories.filter((id) => id !== categoryId));
    };

    // Get selected category names with paths for display
    const getSelectedCategory = (id: number) => {
        return categories.find((category) => category.id === id);
    };

    return (
        <div className='space-y-2'>
            {loading ? (
                <Skeleton className='w-full h-10' />
            ) : (
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant='outline'
                            role='combobox'
                            aria-expanded={open}
                            className='w-full justify-between h-auto min-h-10'
                        >
                            {selectedCategories.length > 0 ? (
                                <div className='flex flex-wrap gap-1 py-1'>
                                    {selectedCategories.map((categoryId) => {
                                        const category = getSelectedCategory(categoryId);
                                        return category ? (
                                            <Badge
                                                key={categoryId}
                                                variant='secondary'
                                                className='mr-1 mb-1'
                                            >
                                                {category.name}
                                                <button
                                                    className='ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }}
                                                    onClick={(e) => removeCategory(categoryId, e)}
                                                >
                                                    ✕
                                                </button>
                                            </Badge>
                                        ) : null;
                                    })}
                                </div>
                            ) : (
                                <span className='text-muted-foreground'>
                                    বিভাগ নির্বাচন করুন...
                                </span>
                            )}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-full p-0' align='start'>
                        <Command>
                            <CommandInput placeholder='বিভাগ অনুসন্ধান করুন...' />
                            <CommandList>
                                <CommandEmpty>কোন বিভাগ পাওয়া যায়নি।</CommandEmpty>
                                <CommandGroup className='max-h-64 overflow-auto'>
                                    {categories.map((category) => (
                                        <CommandItem
                                            key={category.id}
                                            value={category.name}
                                            onSelect={() => {
                                                toggleCategory(category.id);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    selectedCategories.includes(category.id)
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                )}
                                            />
                                            <div>
                                                <div>{category.name}</div>
                                                {category.path !== category.name && (
                                                    <div className='text-xs text-muted-foreground'>
                                                        {category.path}
                                                    </div>
                                                )}
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    );
}
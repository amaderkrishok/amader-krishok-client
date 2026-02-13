'use client';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import React from 'react';

const SiteBreadcrumb = () => {
    const pathname = usePathname();

    // Split the pathname into segments and create breadcrumb items
    const segments = pathname
        .split('/')
        .filter(Boolean)
        .map((segment, index, array) => ({
            name: segment
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (char) => char.toUpperCase()),
            path: `/${array.slice(0, index + 1).join('/')}`,
        }));

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {segments.map((segment, index) => (
                    <React.Fragment key={segment.path}>
                        <BreadcrumbItem>
                            {index < segments.length - 1 ? (
                                <BreadcrumbLink href={segment.path}>
                                    {segment.name}
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>{segment.name}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                        {index < segments.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default SiteBreadcrumb;
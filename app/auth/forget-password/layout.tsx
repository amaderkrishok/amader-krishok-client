import { WebsiteWrapper } from '@/app/(home)/WebsiteWrapper';
import React from 'react';


type Props = {
    children: React.ReactNode; // Corrected prop name
};

const Layout = ({ children }: Props) => {
    return (
        <main>
            <WebsiteWrapper>
                {children} 
            </WebsiteWrapper>
        </main>
    );
};

export default Layout;

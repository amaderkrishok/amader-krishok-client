import React from 'react';

type Props = {
    children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
    return (
        <main className='min-h-screen bg-[#F0FDF4]/30 flex flex-col justify-between selection:bg-[#22C55E]/20 selection:text-[#26331B]'>
            {children}
        </main>
    );
};

export default Layout;


import React from 'react';
import { WebsiteWrapper } from './WebsiteWrapper';

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

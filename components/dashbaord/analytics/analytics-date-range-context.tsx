'use client';

import * as React from 'react';

export type AnalyticsDateRange = '7d' | '30d' | '90d';

const AnalyticsDateRangeContext = React.createContext<{
	range: AnalyticsDateRange;
	setRange: (range: AnalyticsDateRange) => void;
}>({
	range: '7d',
	setRange: () => {},
});

export function AnalyticsDateRangeProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [range, setRange] = React.useState<AnalyticsDateRange>('7d');
	return (
		<AnalyticsDateRangeContext.Provider value={{ range, setRange }}>
			{children}
		</AnalyticsDateRangeContext.Provider>
	);
}

export function useAnalyticsDateRange() {
	return React.useContext(AnalyticsDateRangeContext);
}

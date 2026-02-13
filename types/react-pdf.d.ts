declare module '@react-pdf/renderer' {
    import * as React from 'react';
    export const PDFDownloadLink: React.FC<{
        document: React.ReactNode;
        fileName?: string;
        style?: React.CSSProperties;
        className?: string;
        children: (props: { blob?: Blob; url?: string; loading: boolean; error?: Error }) => React.ReactNode;
    }>;
    export const PDFViewer: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }>;
    export const Document: React.FC<{ children?: React.ReactNode }>;
    export const Page: React.FC<{ size?: string | [number, number]; style?: any; children?: React.ReactNode }>;
    export const Text: React.FC<{ style?: any; children?: React.ReactNode }>;
    export const View: React.FC<{ style?: any; children?: React.ReactNode }>;
    export const Image: React.FC<{ src: string; style?: any }>;
    export const StyleSheet: { create: (styles: Record<string, any>) => Record<string, any> };
    export const Font: {
        register: (cfg: {
            family: string;
            src?: string;
            fallback?: boolean;
            fonts?: Array<{ src: string; fontWeight?: string | number; fontStyle?: 'normal' | 'italic' }>;
        }) => void;
    };
}

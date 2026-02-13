import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

// Determine if we're in production build or CI environment
const isProduction = process.env.NODE_ENV === 'production' || process.env.CI === 'true';

const eslintConfig = [
	...compat.extends('next/core-web-vitals', 'next/typescript'),

	// Add specific rules configuration
	{
		rules: {
			// TypeScript rules - completely disabled in production/CI
			'@typescript-eslint/no-explicit-any': isProduction ? 'off' : 'warn',
			'@typescript-eslint/no-unused-vars': isProduction ? 'off' : 'warn',
			'@typescript-eslint/no-empty-object-type': isProduction ? 'off' : 'warn',
			'@typescript-eslint/no-unused-expressions': isProduction ? 'off' : 'warn',
			'@typescript-eslint/no-unsafe-assignment': isProduction ? 'off' : 'warn',
			'@typescript-eslint/no-unsafe-member-access': isProduction ? 'off' : 'warn',
			'@typescript-eslint/no-unsafe-call': isProduction ? 'off' : 'warn',
			'@typescript-eslint/no-unsafe-return': isProduction ? 'off' : 'warn',
			'@typescript-eslint/no-unsafe-argument': isProduction ? 'off' : 'warn',
			'@typescript-eslint/ban-ts-comment': isProduction ? 'off' : 'warn',
			'@typescript-eslint/prefer-as-const': isProduction ? 'off' : 'warn',

			// React rules - disabled in production/CI
			'react/no-unescaped-entities': isProduction ? 'off' : 'warn',
			'react/display-name': isProduction ? 'off' : 'warn',
			'react/jsx-no-target-blank': isProduction ? 'off' : 'warn',
			'react-hooks/exhaustive-deps': isProduction ? 'off' : 'warn',
			'react-hooks/rules-of-hooks': isProduction ? 'off' : 'error',

			// Next.js rules - disabled in production/CI
			'@next/next/no-img-element': isProduction ? 'off' : 'warn',
			'@next/next/no-html-link-for-pages': isProduction ? 'off' : 'warn',

			// TailwindCSS rules
			'tailwindcss/no-custom-classname': 'off',

			// Import/export rules - disabled in production/CI
			'import/no-anonymous-default-export': isProduction ? 'off' : 'warn',
			'no-unused-vars': isProduction ? 'off' : 'warn',

			// General JavaScript rules - disabled in production/CI
			'no-console': isProduction ? 'off' : 'warn',
			'no-debugger': isProduction ? 'off' : 'warn',
		},
	},

	// Files to ignore completely
	{
		ignores: [
			'node_modules/**',
			'.next/**',
			'out/**',
			'public/**',
			'**/*.d.ts',
			'dist/**',
			'build/**',
			'coverage/**',
		],
	},
];

export default eslintConfig;

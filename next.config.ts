import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	// Enable standalone output for Docker optimization
	output: 'standalone',
	images: {
    
		// remotePatterns: [
		// 	{
		// 		protocol: 'https',
		// 		hostname: 'images.unsplash.com',
		// 		port: '',
		// 		pathname: '/**',
		// 	},
		// 	{
		// 		protocol: 'https',
		// 		hostname: 'openweathermap.org',
		// 		port: '',
		// 		pathname: '/**',
		// 	},
		// 	{
		// 		protocol: 'https',
		// 		hostname: 'img.freepik.com',
		// 		port: '',
		// 		pathname: '/**',
		// 	},
		// 	{
		// 		protocol: 'https',
		// 		hostname: 'example.com',
		// 		port: '',
		// 		pathname: '/**',
		// 	},
		// 	{
		// 		protocol: 'https',
		// 		hostname: 'sgzaxzoba8.ufs.sh',
		// 		port: '',
		// 		pathname: '/**',
		// 	},
		// ],
    remotePatterns: [
		{
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
	   {
        protocol: "https",
        hostname: "amader-krishok-server.onrender.com",
        pathname: "/uploads/**",
      },
    ],
	},
	// Add ESLint configuration to ignore errors during build
	eslint: {
		ignoreDuringBuilds: true,
	},
	// Optional: If you also want TypeScript errors to be ignored during build
	typescript: {
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "**",
//       },
//     ],
//   },
//   reactCompiler: true,
// };

// export default nextConfig;

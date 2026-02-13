// components/BackgroundVideo.tsx
'use client';

export default function BackgroundVideo() {
	return (
		<video
			autoPlay
			loop
			muted
			playsInline
			className='absolute inset-0 w-full h-full object-cover z-0'
		>
			<source src='/videos/banner-video.mp4' type='video/mp4' />
		</video>
	);
}

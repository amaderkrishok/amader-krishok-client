import LoginForm from '@/components/auth/login-form';

export default function Page() {
	return (
			<div className='flex flex-col justify-center min-h-[50vh] w-full bg-muted/40 px-4 py-8 md:pt-[5%] md:pb-8'>
				<div className='w-full max-w-md mx-auto'>
					<LoginForm />
				</div>
			</div>
	);
}

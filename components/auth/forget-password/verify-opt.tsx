// components/VerifyOTP.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { forgetPasswordService } from '@/services/forget-password-service';

export default function VerifyOTP() {
	const router = useRouter();
	const [phoneNumber, setPhoneNumber] = useState('');
	const [otp, setOtp] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		// Get phone number from URL query params
		if (router.query.phone) {
			setPhoneNumber(router.query.phone as string);
		}
	}, [router.query]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		try {
			await forgetPasswordService.verifyOtp(phoneNumber, otp);
			// If successful, redirect to reset password page
			router.push(
				`/reset-password?phone=${encodeURIComponent(
					phoneNumber
				)}&otp=${encodeURIComponent(otp)}`
			);
		} catch (err: any) {
			setError(err.message || 'Invalid OTP. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='verify-otp-container'>
			<h2>Verify OTP</h2>

			<form onSubmit={handleSubmit}>
				<div className='form-group'>
					<label htmlFor='phoneNumber'>Phone Number</label>
					<input
						id='phoneNumber'
						type='text'
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.target.value)}
						placeholder='01XXXXXXXXX'
						pattern='01\d{9}'
						required
						readOnly={!!router.query.phone}
					/>
				</div>

				<div className='form-group'>
					<label htmlFor='otp'>OTP Code</label>
					<input
						id='otp'
						type='text'
						value={otp}
						onChange={(e) => setOtp(e.target.value)}
						placeholder='6-digit OTP'
						pattern='\d{6}'
						maxLength={6}
						required
					/>
					<small>Enter the 6-digit code sent to your phone</small>
				</div>

				{error && <div className='error-message'>{error}</div>}

				<button type='submit' disabled={isLoading}>
					{isLoading ? 'Verifying...' : 'Verify OTP'}
				</button>

				<div className='resend-link'>
					<a href='#' onClick={() => router.push('/forgot-password')}>
						Resend OTP
					</a>
				</div>
			</form>
		</div>
	);
}

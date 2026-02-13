// components/ResetPassword.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { forgetPasswordService } from '@/services/forget-password-service';

export default function ResetPassword() {
	const router = useRouter();
	const [phoneNumber, setPhoneNumber] = useState('');
	const [otp, setOtp] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		// Get phone number and OTP from URL query params
		if (router.query.phone) {
			setPhoneNumber(router.query.phone as string);
		}
		if (router.query.otp) {
			setOtp(router.query.otp as string);
		}
	}, [router.query]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (newPassword !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			const response = await forgetPasswordService.resetPassword(
				phoneNumber,
				otp,
				newPassword
			);
			setSuccess(true);
			setTimeout(() => {
				router.push('/auth/login');
			}, 3000);
		} catch (err: any) {
			setError(err.message || 'Password reset failed. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='reset-password-container'>
			<h2>Reset Password</h2>

			{success ? (
				<div className='success-message'>
					<p>
						Password has been reset successfully! Redirecting to login page...
					</p>
				</div>
			) : (
				<form onSubmit={handleSubmit}>
					<div className='form-group'>
						<label htmlFor='newPassword'>New Password</label>
						<input
							id='newPassword'
							type='password'
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							placeholder='Enter new password'
							minLength={6}
							required
						/>
						<small>Password must be at least 6 characters long</small>
					</div>

					<div className='form-group'>
						<label htmlFor='confirmPassword'>Confirm Password</label>
						<input
							id='confirmPassword'
							type='password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder='Confirm new password'
							minLength={6}
							required
						/>
					</div>

					{error && <div className='error-message'>{error}</div>}

					<button type='submit' disabled={isLoading}>
						{isLoading ? 'Resetting...' : 'Reset Password'}
					</button>
				</form>
			)}
		</div>
	);
}

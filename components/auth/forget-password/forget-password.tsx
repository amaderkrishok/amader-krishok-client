// components/ForgotPassword.tsx
import { forgetPasswordService } from '@/services/forget-password-service';
import { useState } from 'react';


export default function ForgotPassword() {
	const [phoneNumber, setPhoneNumber] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [otpSent, setOtpSent] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		try {
			const response = await forgetPasswordService.requestPasswordReset(phoneNumber);
			setMessage(response.data.message);
			setOtpSent(true);
		} catch (err: any) {
			setError(err.message || 'Something went wrong. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='forgot-password-container'>
			<h2>Forgot Password</h2>

			{!otpSent ? (
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
						/>
						<small>
							Enter your 11-digit Bangladeshi phone number (01XXXXXXXXX)
						</small>
					</div>

					{error && <div className='error-message'>{error}</div>}

					<button type='submit' disabled={isLoading}>
						{isLoading ? 'Sending...' : 'Send OTP'}
					</button>
				</form>
			) : (
				<div className='success-message'>
					<p>{message}</p>
					<button
						onClick={() =>
							(window.location.href =
								'/verify-otp?phone=' + encodeURIComponent(phoneNumber))
						}
					>
						Proceed to Verify OTP
					</button>
				</div>
			)}
		</div>
	);
}

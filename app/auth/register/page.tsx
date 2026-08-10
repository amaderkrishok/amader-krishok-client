'use client';

import { RegisterForm } from '@/components/auth/register-form';

export default function Page() {
	return <RegisterForm role='user' showImageUpload={true} />;
}


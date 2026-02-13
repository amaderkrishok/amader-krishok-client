'use client';

import { WithRoleAccess } from './with-role-access';

type Role = 'admin' | 'user' | 'moderator' | 'vendor';

interface ProtectedPageProps {
	allowedRoles: Role[];
	redirectPath?: string;
	children: React.ReactNode;
}

export function ProtectedPage({
	allowedRoles,
	redirectPath = '/unauthorized',
	children,
}: ProtectedPageProps) {
	return (
		<WithRoleAccess allowedRoles={allowedRoles} redirectTo={redirectPath}>
			{children}
		</WithRoleAccess>
	);
}

// Create role-specific helper components for cleaner usage
export function AdminOnly({
	redirectPath,
	children,
}: Omit<ProtectedPageProps, 'allowedRoles'>) {
	return (
		<ProtectedPage allowedRoles={['admin']} redirectPath={redirectPath}>
			{children}
		</ProtectedPage>
	);
}

export function AdminOrVendorOnly({
	redirectPath,
	children,
}: Omit<ProtectedPageProps, 'allowedRoles'>) {
	return (
		<ProtectedPage
			allowedRoles={['admin', 'vendor']}
			redirectPath={redirectPath}
		>
			{children}
		</ProtectedPage>
	);
}

export function VendorOnly({
	redirectPath,
	children,
}: Omit<ProtectedPageProps, 'allowedRoles'>) {
	return (
		<ProtectedPage allowedRoles={['vendor']} redirectPath={redirectPath}>
			{children}
		</ProtectedPage>
	);
}

export function ModeratorOnly({
	redirectPath,
	children,
}: Omit<ProtectedPageProps, 'allowedRoles'>) {
	return (
		<ProtectedPage allowedRoles={['moderator']} redirectPath={redirectPath}>
			{children}
		</ProtectedPage>
	);
}

export function UserOnly({
	redirectPath,
	children,
}: Omit<ProtectedPageProps, 'allowedRoles'>) {
	return (
		<ProtectedPage allowedRoles={['user']} redirectPath={redirectPath}>
			{children}
		</ProtectedPage>
	);
}

export function AdminOrModeratorOnly({
	redirectPath,
	children,
}: Omit<ProtectedPageProps, 'allowedRoles'>) {
	return (
		<ProtectedPage
			allowedRoles={['admin', 'moderator']}
			redirectPath={redirectPath}
		>
			{children}
		</ProtectedPage>
	);
}

export function StaffOnly({
	redirectPath,
	children,
}: Omit<ProtectedPageProps, 'allowedRoles'>) {
	return (
		<ProtectedPage
			allowedRoles={['admin', 'moderator', 'vendor', 'user']}
			redirectPath={redirectPath}
		>
			{children}
		</ProtectedPage>
	);
}

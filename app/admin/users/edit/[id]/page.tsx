import { UserEditForm } from "@/components/dashbaord/users/user-edit-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Edit User",
  description: "Edit user profile and permissions",
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  return (
		<div className='p-6 space-y-6 w-full mx-auto'>
			<UserEditForm userId={params.id} />
		</div>
	);
}

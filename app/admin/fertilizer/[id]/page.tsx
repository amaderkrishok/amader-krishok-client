import { FertilizerEditForm } from '@/components/dashbaord/fertilizer/fertilizer-edit-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Edit Fertilizer Calculator',
	description: 'Edit fertilizer calculator data',
};

export default function EditFertilizerPage({
	params,
}: {
	params: { id: string };
}) {
	return (
		<div className='p-6 space-y-6 w-full mx-auto'>
			<FertilizerEditForm calculatorId={Number.parseInt(params.id)} />
		</div>
	);
}

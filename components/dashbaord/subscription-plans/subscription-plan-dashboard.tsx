'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubscriptionPlanType } from '@/types/subscription-plan';
import { SubscriptionPlanService } from '@/services/subscription-plan-service';
import { toast } from 'sonner';
import { SubscriptionPlanList } from './subscription-plan-list';
import { SubscriptionPlanForm } from './subscription-plan-form';

/**
 * Dashboard component for managing subscription plans
 * Prices are stored in poisha (1 Taka = 100 poisha) in the backend
 * and converted to Taka for display in the form
 */
export function SubscriptionPlanDashboard() {
	const [plans, setPlans] = useState<SubscriptionPlanType[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanType | null>(
		null
	);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [activeTab, setActiveTab] = useState('list');

	useEffect(() => {
		fetchPlans();
	}, []);

	const fetchPlans = async () => {
		try {
			setIsLoading(true);
			const response = await SubscriptionPlanService.getAllPlans();
			// Plans from API have price in poisha
			setPlans(response.data);
		} catch (error) {
			console.error('Failed to fetch plans:', error);
			toast.error('Failed to load subscription plans');
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddPlan = () => {
		setSelectedPlan(null);
		setIsFormOpen(true);
		setActiveTab('form');
	};

	const handleEditPlan = (plan: SubscriptionPlanType) => {
		setSelectedPlan(plan);
		setIsFormOpen(true);
		setActiveTab('form');
	};

	const handleDeletePlan = async (id: number) => {
		try {
			await SubscriptionPlanService.deletePlan(id);
			toast.success('Subscription plan deleted successfully');
			fetchPlans();
		} catch (error) {
			console.error('Delete plan error:', error);
			toast.error('Failed to delete subscription plan');
		}
	};

	const handleFormSubmit = async (
		plan: Omit<SubscriptionPlanType, 'id'> & { id?: number}
	) => {
		try {
			// Form will provide price in poisha (conversion happens in the form)
			if (plan.id) {
				await SubscriptionPlanService.updatePlan(plan.id, plan);
				toast.success('Subscription plan updated successfully');
			} else {
				await SubscriptionPlanService.createPlan(plan);
				toast.success('Subscription plan created successfully');
			}
			setIsFormOpen(false);
			setActiveTab('list');
			fetchPlans();
		} catch (error) {
			console.error('Form submission error:', error);
			toast.error('Failed to save subscription plan');
		}
	};

	const handleFormCancel = () => {
		setIsFormOpen(false);
		setActiveTab('list');
	};

	return (
		<Card className='w-full'>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<div>
					<CardTitle className='text-2xl font-bold tracking-tight'>
						Subscription Plans
					</CardTitle>
					<CardDescription>
						Manage your subscription plans and pricing in BDT (Bangladeshi Taka)
					</CardDescription>
				</div>
				<Button onClick={handleAddPlan}>
					<Plus className='mr-2 h-4 w-4' />
					Add Plan
				</Button>
			</CardHeader>
			<CardContent>
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className='mb-4'>
						<TabsTrigger value='list'>Plans List</TabsTrigger>
						<TabsTrigger value='form' disabled={!isFormOpen}>
							{selectedPlan ? 'Edit Plan' : 'New Plan'}
						</TabsTrigger>
					</TabsList>
					<TabsContent value='list'>
						<SubscriptionPlanList
							plans={plans}
							isLoading={isLoading}
							onEdit={handleEditPlan}
							onDelete={handleDeletePlan}
						/>
					</TabsContent>
					<TabsContent value='form'>
						{isFormOpen && (
							<SubscriptionPlanForm
								plan={selectedPlan}
								onSubmit={handleFormSubmit}
								onCancel={handleFormCancel}
							/>
						)}
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}

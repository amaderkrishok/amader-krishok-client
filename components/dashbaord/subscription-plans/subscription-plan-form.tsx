'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { SubscriptionPlanType } from '@/types/subscription-plan';

// Define the form schema with proper types
const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  price: z.coerce
    .number()
    .min(0, {
      message: 'Price must be a positive number.',
    })
    .refine((val) => !isNaN(val), {
      message: 'Price must be a valid number.',
    }),
  productLimit: z.coerce.number().int().min(1, {
    message: 'Product limit must be at least 1.',
  }),
  supportVariableProduct: z.boolean().default(false),
  analytics: z.boolean().default(false),
});

// Derived type from the schema
type FormValues = z.infer<typeof formSchema>;

// Props interface with proper typing
interface SubscriptionPlanFormProps {
  plan: SubscriptionPlanType | null;
  onSubmit: (
    plan: Omit<SubscriptionPlanType, 'id'> & { id?: number | string }
  ) => void;
  onCancel: () => void;
}

export function SubscriptionPlanForm({
  plan,
  onSubmit,
  onCancel,
}: SubscriptionPlanFormProps) {
  // Use properly typed useForm - this is the key fix
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: plan?.name || '',
      price: plan?.price || 0,
      productLimit: plan?.productLimit || 10,
      supportVariableProduct: Boolean(plan?.supportVariableProduct),
      analytics: Boolean(plan?.analytics),
    },
  });

  // Handle form submission
  const handleSubmit = form.handleSubmit((values) => {
    onSubmit({
      ...(plan?.id ? { id: plan.id } : {}),
      name: values.name,
      price: values.price,
      productLimit: values.productLimit,
      supportVariableProduct: values.supportVariableProduct,
      analytics: values.analytics,
    });
  });

  // Format currency for display
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter plan name' {...field} />
              </FormControl>
              <FormDescription>
                The name of the subscription plan as it will appear to
                customers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='price'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (BDT)</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    type='number'
                    min='0'
                    step='1'
                    placeholder='0'
                    {...field}
                    className='pl-10'
                    onChange={(e) => {
                      // Ensure it's a valid number
                      const value = e.target.value;
                      if (value === '' || !isNaN(Number(value))) {
                        field.onChange(value === '' ? '' : Number(value));
                      }
                    }}
                  />
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                    ৳
                  </span>
                </div>
              </FormControl>
              <FormDescription>
                The monthly price in Bangladeshi Taka. Use 0 for free plans.
                {form.watch('price') > 0 && (
                  <span className='ml-1 font-medium'>
                    ({formatCurrency(form.watch('price'))})
                  </span>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='productLimit'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Limit</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  min='1'
                  placeholder='10'
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || !isNaN(Number(value))) {
                      field.onChange(value === '' ? '' : Number(value));
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                The maximum number of products a user can create with this plan.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='supportVariableProduct'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
              <div className='space-y-0.5'>
                <FormLabel className='text-base'>Variable Products</FormLabel>
                <FormDescription>
                  Allow users to create products with variations (size, color,
                  etc.)
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='analytics'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
              <div className='space-y-0.5'>
                <FormLabel className='text-base'>Analytics</FormLabel>
                <FormDescription>
                  Provide advanced analytics and reporting features
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className='flex justify-end space-x-2'>
          <Button variant='outline' type='button' onClick={onCancel}>
            Cancel
          </Button>
          <Button type='submit'>{plan ? 'Update' : 'Create'} Plan</Button>
        </div>
      </form>
    </Form>
  );
}
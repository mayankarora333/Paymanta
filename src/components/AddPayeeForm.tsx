
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaymanService } from '@/services/paymanService';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

const addPayeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.string().min(1, 'Please select a payee type'),
  email: z.string().email('Please enter a valid email').optional().or(z.literal(''))
});

type AddPayeeFormData = z.infer<typeof addPayeeSchema>;

interface AddPayeeFormProps {
  onClose: () => void;
  onPayeeAdded: () => void;
}

const AddPayeeForm = ({ onClose, onPayeeAdded }: AddPayeeFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<AddPayeeFormData>({
    resolver: zodResolver(addPayeeSchema),
    defaultValues: {
      name: '',
      type: '',
      email: ''
    }
  });

  const onSubmit = async (data: AddPayeeFormData) => {
    setIsLoading(true);
    
    try {
      console.log('Creating payee with data:', data);
      
      await PaymanService.createPayee({
        name: data.name,
        type: data.type,
        email: data.email || undefined
      });

      toast({
        title: "Success",
        description: `Payee "${data.name}" has been created successfully`,
      });

      // Refresh the payees list
      onPayeeAdded();
      onClose();
      
    } catch (error) {
      console.error('Error creating payee:', error);
      toast({
        title: "Error",
        description: "Failed to create payee. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Add New Payee</CardTitle>
            <CardDescription className="text-gray-300">
              Create a new payee to send payments to
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text- bg-purple-600 hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Payee Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter payee name"
                      {...field}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Payee Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select payee type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="contractor">Contractor</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                      <SelectItem value="freelancer">Freelancer</SelectItem>
                      <SelectItem value="supplier">Supplier</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-white/20 text-white hover:bg-white/10 bg-red-600"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Payee'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddPayeeForm;

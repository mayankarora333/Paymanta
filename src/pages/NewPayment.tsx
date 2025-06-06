
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Send, Plus, User } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PaymanService, Payee } from '@/services/paymanService';
import { useToast } from '@/hooks/use-toast';

const NewPayment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    recipient: '',
    description: '',
    type: 'bounty'
  });
  
  const [loading, setLoading] = useState(false);
  const [payees, setPayees] = useState<Payee[]>([]);
  const [loadingPayees, setLoadingPayees] = useState(true);
  const [showNewPayeeDialog, setShowNewPayeeDialog] = useState(false);
  const [newPayeeData, setNewPayeeData] = useState({
    name: '',
    type: 'individual',
    email: ''
  });
  const [creatingPayee, setCreatingPayee] = useState(false);

  useEffect(() => {
    loadPayees();
  }, []);

  const loadPayees = async () => {
    try {
      setLoadingPayees(true);
      const payeeList = await PaymanService.fetchPayees();
      setPayees(payeeList);
    } catch (error) {
      console.error('Error loading payees:', error);
      toast({
        title: "Warning",
        description: "Could not load payees list",
        variant: "destructive"
      });
    } finally {
      setLoadingPayees(false);
    }
  };

  const handleCreatePayee = async () => {
    if (!newPayeeData.name.trim()) {
      toast({
        title: "Error",
        description: "Payee name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setCreatingPayee(true);
      const newPayee = await PaymanService.createPayee(newPayeeData);
      
      // Add to local payees list
      setPayees(prev => [...prev, newPayee]);
      
      // Set as selected recipient
      setFormData(prev => ({
        ...prev,
        recipient: newPayee.name
      }));

      // Reset form and close dialog
      setNewPayeeData({ name: '', type: 'individual', email: '' });
      setShowNewPayeeDialog(false);

      toast({
        title: "Success",
        description: `Payee "${newPayee.name}" created successfully`,
      });
    } catch (error) {
      console.error('Error creating payee:', error);
      toast({
        title: "Error",
        description: "Failed to create payee",
        variant: "destructive"
      });
    } finally {
      setCreatingPayee(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payment = await PaymanService.createPayment({
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        recipient: formData.recipient,
        description: formData.description,
        metadata: {
          type: formData.type,
          source: 'web-app'
        }
      });

      toast({
        title: "Payment Created",
        description: `Payment of ${formData.currency} ${formData.amount} to ${formData.recipient} has been initiated`,
      });

      navigate('/payments');
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: "Error",
        description: "Failed to create payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4 border-white/20 text-white hover:bg-white/10 bg-purple-600 hover:bg-purple-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4 " />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-white mb-2">Create New Payment</h1>
          <p className="text-gray-300">Send payments using AI-powered automation</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Payment Details</CardTitle>
            <CardDescription className="text-gray-300">
              Fill in the payment information below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-white">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-white">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">TDS</SelectItem>
                    
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="recipient" className="text-white">Recipient</Label>
                  <Dialog open={showNewPayeeDialog} onOpenChange={setShowNewPayeeDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10 bg-purple-600 hover:bg-purple-300"
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        New Payee
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-white/20 text-white">
                      <DialogHeader>
                        <DialogTitle>Create New Payee</DialogTitle>
                        <DialogDescription className="text-gray-300">
                          Add a new payee to your contact list
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="payee-name">Name *</Label>
                          <Input
                            id="payee-name"
                            placeholder="Enter payee name"
                            value={newPayeeData.name}
                            onChange={(e) => setNewPayeeData(prev => ({ ...prev, name: e.target.value }))}
                            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="payee-email">Email</Label>
                          <Input
                            id="payee-email"
                            type="email"
                            placeholder="Enter email address"
                            value={newPayeeData.email}
                            onChange={(e) => setNewPayeeData(prev => ({ ...prev, email: e.target.value }))}
                            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="payee-type">Type</Label>
                          <Select 
                            value={newPayeeData.type} 
                            onValueChange={(value) => setNewPayeeData(prev => ({ ...prev, type: value }))}
                          >
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="individual">Individual</SelectItem>
                              <SelectItem value="contractor">Contractor</SelectItem>
                              <SelectItem value="vendor">Vendor</SelectItem>
                              <SelectItem value="employee">Employee</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-3 pt-4">
                          <Button 
                            onClick={handleCreatePayee}
                            disabled={creatingPayee}
                            className="flex-1 bg-purple-600 hover:bg-purple-700"
                          >
                            {creatingPayee ? 'Creating...' : 'Create Payee'}
                          </Button>
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={() => setShowNewPayeeDialog(false)}
                            className="border-white/20 text-white hover:bg-white/10 bg-red-600"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="relative">
                  <Input
                    id="recipient"
                    placeholder="Enter recipient name or select from payees..."
                    value={formData.recipient}
                    onChange={(e) => handleInputChange('recipient', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    list="payees-datalist"
                    required
                  />
                  <datalist id="payees-datalist">
                    {payees.map((payee) => (
                      <option key={payee.id} value={payee.name} />
                    ))}
                  </datalist>
                </div>
                
                {!loadingPayees && payees.length > 0 && (
                  <div className="text-sm text-gray-400">
                    Available payees: {payees.map(p => p.name).join(', ')}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-white">Payment Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bounty">Bounty Reward</SelectItem>
                    <SelectItem value="payroll">Payroll</SelectItem>
                    <SelectItem value="invoice">Invoice Payment</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What is this payment for?"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[100px]"
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {loading ? (
                    'Creating Payment...'
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Create Payment
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/payments')}
                  className="border-white/20 text-white hover:bg-white/10 bg-red-600"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default NewPayment;

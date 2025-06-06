import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuickPayModal from '@/components/QuickPayModal';
import QuickPayForm from '@/components/QuickPayForm';
import AddPayeeForm from '@/components/AddPayeeForm';
import { PaymanService, Payee } from '@/services/paymanService';
import { useToast } from '@/hooks/use-toast';

const PAYEES_CACHE_KEY = 'payman_payees_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const Payees = () => {
  const [payees, setPayees] = useState<Payee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [quickPayModal, setQuickPayModal] = useState<{
    isOpen: boolean;
    payeeName: string;
    amount: string;
  }>({
    isOpen: false,
    payeeName: '',
    amount: ''
  });
  const {
    toast
  } = useToast();

  // Load payees from API
  const loadPayees = async () => {
    try {
      setLoading(true);
      console.log('Loading payees from API...');
      const data = await PaymanService.fetchPayees();
      setPayees(data);
      console.log('Payees loaded successfully:', data);
    } catch (error) {
      console.error('Error fetching payees:', error);
      toast({
        title: "Error",
        description: "Failed to load payees",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayees();
  }, []);

  const filteredPayees = payees.filter(payee => 
    payee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    payee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuickPay = (payeeName: string, amount: string) => {
    setQuickPayModal({
      isOpen: true,
      payeeName,
      amount
    });
  };

  const handlePaymentComplete = () => {
    // Refresh payees data
    loadPayees();
  };

  const handlePayeeAdded = () => {
    // Refresh payees list after adding new payee
    loadPayees();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Inactive</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-white text-xl">Loading payees...</div>
        </div>
        <Footer />
      </div>;
  }

  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Payees</h1>
              <p className="text-gray-300">Manage your payment recipients and send quick payments</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={loadPayees} variant="outline" className="border-white/20 text-white bg-purple-700 hover:bg-purple-600">
                Refresh
              </Button>
              <Button onClick={() => setShowAddForm(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Payee
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search payees..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400" 
              />
            </div>
            <Button variant="outline" className="border-white/20 text-white bg-purple-700 hover:bg-purple-600">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Add Payee Form */}
        {showAddForm && (
          <div className="mb-8">
            <AddPayeeForm onClose={() => setShowAddForm(false)} onPayeeAdded={handlePayeeAdded} />
          </div>
        )}

        {/* Payees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPayees.map(payee => (
            <Card key={payee.id} className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">{payee.name}</CardTitle>
                  {getStatusBadge(payee.status)}
                </div>
                <CardDescription className="text-gray-300">
                  {payee.email}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payee.walletAddress && (
                    <div>
                      <p className="text-sm text-gray-400">Wallet Address</p>
                      <p className="text-white text-sm font-mono">
                        {payee.walletAddress.slice(0, 6)}...{payee.walletAddress.slice(-4)}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-400">Total Paid</p>
                    <p className="text-white font-bold">${payee.totalPaid.toLocaleString()} {payee.currency}</p>
                  </div>

                  {payee.type && (
                    <div>
                      <p className="text-sm text-gray-400">Type</p>
                      <p className="text-white">{payee.type}</p>
                    </div>
                  )}
                  
                  <div className="pt-3">
                    <QuickPayForm 
                      payeeName={payee.name} 
                      disabled={payee.status === 'inactive'} 
                      onQuickPay={amount => handleQuickPay(payee.name, amount)} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPayees.length === 0 && !showAddForm && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="text-center py-8">
              <p className="text-gray-400 mb-4">No payees found</p>
              <Button onClick={() => setShowAddForm(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
                Add Your First Payee
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      
      <QuickPayModal 
        isOpen={quickPayModal.isOpen} 
        onClose={() => setQuickPayModal({ isOpen: false, payeeName: '', amount: '' })} 
        payeeName={quickPayModal.payeeName} 
        prefilledAmount={quickPayModal.amount} 
        onPaymentComplete={handlePaymentComplete} 
      />
      
      <Footer />
    </div>;
};

export default Payees;

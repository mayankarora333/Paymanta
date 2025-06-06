
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PaymanService, Payment } from '@/services/paymanService';
import { useToast } from '@/hooks/use-toast';

const PAYMENTS_CACHE_KEY = 'payman_payments_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes (increased from 3)

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const { toast } = useToast();

  // Load payments from cache or fetch from API
  const loadPayments = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setRateLimitError(false);
      console.log('=== LOADING PAYMENTS ===');
      console.log('Force refresh:', forceRefresh);

      // Check credential status
      const credentialStatus = PaymanService.getCredentialStatus();
      console.log('Credential status:', credentialStatus);

      // Check cache first (only if not forcing refresh)
      if (!forceRefresh) {
        const cached = localStorage.getItem(PAYMENTS_CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const isValid = Date.now() - timestamp < CACHE_DURATION;
          
          if (isValid && data.length > 0) {
            console.log('✅ Loading payments from cache:', data);
            setPayments(data);
            setLastFetchTime(new Date(timestamp));
            setIsUsingMockData(credentialStatus.isUsingMockData);
            setLoading(false);
            return;
          } else {
            console.log('❌ Cache expired or empty, fetching from API');
          }
        } else {
          console.log('❌ No cache found, fetching from API');
        }
      }

      // Fetch from Payman SDK API
      console.log('🔄 Fetching payments from Payman SDK API...');
      const data = await PaymanService.fetchPayments();
      console.log('✅ Raw API response:', data);
      console.log(`📊 Fetched ${data.length} payments from API`);
      
      // Check if we're using mock data
      const isMockData = credentialStatus.isUsingMockData;
      setIsUsingMockData(isMockData);
      
      // Log each payment for debugging
      data.forEach((payment, index) => {
        console.log(`Payment ${index + 1}:`, {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          recipient: payment.recipient,
          status: payment.status,
          description: payment.description,
          createdAt: payment.createdAt
        });
      });

      setPayments(data);
      setLastFetchTime(new Date());
      
      // Cache the data
      localStorage.setItem(PAYMENTS_CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      console.log('💾 Payments cached successfully');
      
      toast({
        title: "Success",
        description: `Loaded ${data.length} payments${isMockData ? ' (using mock data)' : ' from Payman SDK'}`,
      });
      
    } catch (error: any) {
      console.error('❌ Error fetching payments:', error);
      
      // Check if it's a rate limit error
      if (error.message && error.message.includes('rate_limit_error')) {
        setRateLimitError(true);
        toast({
          title: "Rate Limit Reached",
          description: "Payman SDK rate limit exceeded. Using cached data if available.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to load payments",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 Payments page mounted, loading data...');
    loadPayments();
    
    // Auto-refresh every 2 minutes (reduced from 30 seconds to avoid rate limits)
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing payments...');
      loadPayments();
    }, 120000);
    
    return () => {
      console.log('🧹 Cleaning up payments page interval');
      clearInterval(interval);
    };
  }, []);

  const handleManualRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    loadPayments(true);
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  console.log('🔍 Filtered payments:', filteredPayments.length, 'out of', payments.length);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Failed</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-white text-xl">Loading payments from Payman SDK...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          {/* Status Alerts */}
          {rateLimitError && (
            <Alert className="mb-4 bg-yellow-500/10 border-yellow-500/20">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-300">
                Payman SDK rate limit exceeded. Showing cached data. Try refreshing in a few minutes.
              </AlertDescription>
            </Alert>
          )}
          
          {isUsingMockData && !rateLimitError && (
            <Alert className="mb-4 bg-blue-500/10 border-blue-500/20">
              <AlertCircle className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-300">
                Currently using mock data. Payman SDK integration is active but may be experiencing rate limits.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Payments</h1>
              <p className="text-gray-300">Track and manage all your payment transactions from Payman SDK</p>
              <div className="flex items-center gap-4 text-gray-400 text-sm mt-1">
                <span>Total: {payments.length} | Filtered: {filteredPayments.length}</span>
                {lastFetchTime && (
                  <span>Last updated: {lastFetchTime.toLocaleTimeString()}</span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleManualRefresh}
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 bg-purple-600"
                disabled={loading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Link to="/payments/new">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  New Payment
                </Button>
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search payments by recipient, description, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-md"
            >
              <option value="all">All Status</option>
              <option className="text-purple-600" value="completed">Completed</option>
              <option className="text-purple-600" value="pending">Pending</option>
              <option className="text-purple-600" value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Payments Table */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white">All Transactions</CardTitle>
            <CardDescription className="text-gray-300">
              {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''} found
              {isUsingMockData && ' (mock data)'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20">
                      <TableHead className="text-gray-300">Transaction ID</TableHead>
                      <TableHead className="text-gray-300">Recipient</TableHead>
                      <TableHead className="text-gray-300">Amount</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Description</TableHead>
                      <TableHead className="text-gray-300">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-white font-mono text-sm">
                          {payment.id}
                        </TableCell>
                        <TableCell className="text-white">
                          <div>
                            <p className="font-medium">{payment.recipient}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              {formatCurrency(payment.amount, payment.currency)}
                            </p>
                            <p className="text-gray-400 text-sm">{payment.currency}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(payment.status)}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {payment.description}
                        </TableCell>
                        <TableCell className="text-gray-400">
                          <div>
                            <p>{new Date(payment.createdAt).toLocaleDateString()}</p>
                            <p className="text-sm">{new Date(payment.createdAt).toLocaleTimeString()}</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4 text-lg">
                  {payments.length === 0 ? 'No payments found in Payman SDK' : 'No payments match your search criteria'}
                </p>
                <p className="text-gray-500 mb-6">
                  {payments.length === 0 ? 'Create your first payment to get started' : 'Try adjusting your search or filters'}
                </p>
                <Link to="/payments/new">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Payment
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Payments;


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, Wallet, CircleDollarSign, Hourglass, CheckCircle2, RefreshCw, X, HelpCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PaymanService, Payment } from '@/services/paymanService';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalBalance: number;
  totalPayments: number;
  activePayees: number;
  pendingPayments: number;
  monthlyVolume: number;
  successRate: number;
}

const DASHBOARD_CACHE_KEY = 'payman_dashboard_cache';
const PAYMENTS_CACHE_KEY = 'payman_payments_cache';
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for dashboard

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBalance: 0,
    totalPayments: 0,
    activePayees: 0,
    pendingPayments: 0,
    monthlyVolume: 0,
    successRate: 0
  });
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load dashboard data from cache or fetch from API
  const loadDashboardData = async (forceRefresh = false) => {
    try {
      // Load stats from cache
      if (!forceRefresh) {
        const cachedStats = localStorage.getItem(DASHBOARD_CACHE_KEY);
        const cachedPayments = localStorage.getItem(PAYMENTS_CACHE_KEY);
        
        if (cachedStats && cachedPayments) {
          const { data: statsData, timestamp: statsTimestamp } = JSON.parse(cachedStats);
          const { data: paymentsData, timestamp: paymentsTimestamp } = JSON.parse(cachedPayments);
          
          const isStatsValid = Date.now() - statsTimestamp < CACHE_DURATION;
          const isPaymentsValid = Date.now() - paymentsTimestamp < CACHE_DURATION;
          
          if (isStatsValid && isPaymentsValid) {
            console.log('Loading dashboard data from cache');
            setStats(statsData);
            setRecentPayments(paymentsData);
            setLoading(false);
            return;
          }
        }
      }

      // Fetch from API
      console.log('Fetching dashboard data from API...');
      
      const [dashboardStats, payments] = await Promise.all([
        PaymanService.getDashboardStats(),
        PaymanService.fetchPayments()
      ]);
      
      setStats(dashboardStats);
      setRecentPayments(payments.slice(0, 5)); // Show only recent 5
      
      // Cache the data
      localStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify({
        data: dashboardStats,
        timestamp: Date.now()
      }));
      
      localStorage.setItem(PAYMENTS_CACHE_KEY, JSON.stringify({
        data: payments,
        timestamp: Date.now()
      }));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadDashboardData(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'pending':
        return <Hourglass className="h-4 w-4" />;
      case 'failed':
        return <X className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
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
          <div className="text-white text-xl">Loading dashboard...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-300">Overview of your payment activities</p>
          </div>
          <Button 
            onClick={() => loadDashboardData(true)}
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10 bg-purple-600"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-lg">Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {formatCurrency(stats.totalBalance, 'USD')}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-lg">Total Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalPayments}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-lg">Active Payees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.activePayees}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-lg">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.pendingPayments}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-lg">Monthly Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {formatCurrency(stats.monthlyVolume, 'USD')}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-lg">Payment Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.successRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Payments */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-xl">Recent Payments</CardTitle>
              <Link to="/payments">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-purple-600">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.length > 0 ? (
                recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{payment.recipient}</p>
                        <p className="text-gray-400 text-sm">{payment.description}</p>
                        <p className="text-gray-500 text-xs">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">
                        {formatCurrency(payment.amount, payment.currency)}
                      </p>
                      <Badge className={`${getStatusColor(payment.status)} text-xs`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No recent payments</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;

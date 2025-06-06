
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="relative z-50 bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Paymanta</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/dashboard" 
              className={`text-lg font-medium transition-colors ${
                isActive('/dashboard') ? 'text-purple-400' : 'text-white hover:text-purple-400'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/payments" 
              className={`text-lg font-medium transition-colors ${
                isActive('/payments') ? 'text-purple-400' : 'text-white hover:text-purple-400'
              }`}
            >
              Payments
            </Link>
            <Link 
              to="/payees" 
              className={`text-lg font-medium transition-colors ${
                isActive('/payees') ? 'text-purple-400' : 'text-white hover:text-purple-400'
              }`}
            >
              Payees
            </Link>
            <Link 
              to="/settings" 
              className={`text-lg font-medium transition-colors ${
                isActive('/settings') ? 'text-purple-400' : 'text-white hover:text-purple-400'
              }`}
            >
              Settings
            </Link>
          </nav>
          
          <Link to="/payments/new">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              New Payment
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

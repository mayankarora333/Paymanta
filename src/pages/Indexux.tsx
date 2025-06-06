
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CreditCard, Users, Zap, Shield, Globe, Banknote } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Indexux = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800 mb-6">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Payment Platform
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Automate Payments
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              With AI Agents
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Fund bounties, run payroll, trigger invoices, and manage payments seamlessly 
            with our intelligent payment automation platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/dashboard">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/payments">
              <Button size="lg" variant="outline" className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold">
                View Payments
              </Button>
            </Link>
          </div>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <CreditCard className="w-12 h-12 text-purple-400 mb-4" />
                <CardTitle className="text-xl">Smart Payments</CardTitle>
                <CardDescription className="text-gray-300">
                  AI agents handle complex payment workflows automatically
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <Users className="w-12 h-12 text-blue-400 mb-4" />
                <CardTitle className="text-xl">create Payee in one click </CardTitle>
                <CardDescription className="text-gray-300">
                  Manage contributors, vendors, and team members effortlessly
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <Shield className="w-12 h-12 text-green-400 mb-4" />
                <CardTitle className="text-xl">Secure & Reliable</CardTitle>
                <CardDescription className="text-gray-300">
                  Enterprise-grade security with real-time monitoring
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose Payman?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform combines AI intelligence with robust payment infrastructure 
              to streamline your financial operations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Banknote className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Automated Bounties</h3>
              <p className="text-gray-300">Fund and manage bounties automatically with AI-driven workflows</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Global Payroll</h3>
              <p className="text-gray-300">Run international payroll with multi-currency support</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Instant Invoicing</h3>
              <p className="text-gray-300">Trigger invoice payments and manage cash flow automatically</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Indexux;

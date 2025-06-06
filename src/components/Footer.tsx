
import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black/50 backdrop-blur-lg border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Payman</span>
            </div>
            <p className="text-gray-300 max-w-md">
              AI-powered payment automation for the modern business. 
              Streamline your financial workflows with intelligent agents.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/payments" className="text-gray-400 hover:text-white transition-colors">Payments</Link></li>
              <li><Link to="/payees" className="text-gray-400 hover:text-white transition-colors">Payees</Link></li>
              <li><Link to="/settings" className="text-gray-400 hover:text-white transition-colors">Settings</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Payman. All rights reserved. Built with AI-powered automation.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

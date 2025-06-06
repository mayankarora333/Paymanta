
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Bell, Shield, Palette } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CredentialsConfig from '@/components/CredentialsConfig';

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-300">Manage your account preferences and API configuration</p>
        </div>

        <div className="space-y-6">
          {/* API Credentials */}
          <CredentialsConfig />

          {/* Notifications */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-white">Notifications</CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                Configure your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="text-white">Email notifications</Label>
                <Switch id="email-notifications" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications" className="text-white">Push notifications</Label>
                <Switch id="push-notifications" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="payment-alerts" className="text-white">Payment completion alerts</Label>
                <Switch id="payment-alerts" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-400" />
                <CardTitle className="text-white">Security</CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                Manage your security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="two-factor" className="text-white">Two-factor authentication</Label>
                <Switch id="two-factor" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="session-timeout" className="text-white">Auto logout after inactivity</Label>
                <Switch id="session-timeout" defaultChecked />
              </div>
              <Button variant="outline" className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white">
                Change Password
              </Button>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-400" />
                <CardTitle className="text-white">Appearance</CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                Customize your interface preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="text-white">Dark mode</Label>
                <Switch id="dark-mode" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="compact-view" className="text-white">Compact view</Label>
                <Switch id="compact-view" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;

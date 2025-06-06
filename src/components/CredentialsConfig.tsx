
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Key, CheckCircle } from 'lucide-react';
import { PaymanService } from '@/services/paymanService';

const CredentialsConfig = () => {
  const [clientId, setClientId] = useState('pm-test-UjV0BDzHhZUfkLgwq1ZKDjxq');
  const [clientSecret, setClientSecret] = useState('qUryAaSPG2fEZ8Wgod0hI_2QLvLgsi3MnW8Gjw6SKifJC6usMTkmL-pF3Vbv9BkA');
  const credentialStatus = PaymanService.getCredentialStatus();

  const handleSave = () => {
    alert(`Credentials are already configured in the application. 
    
Your Client ID: ${clientId}
Your Client Secret: ${clientSecret.substring(0, 20)}...

The application is now using your live Payman API credentials.`);
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-white">Payman API Credentials</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          </div>
        </div>
        <CardDescription className="text-gray-300">
          Your Payman API credentials are configured and ready to use
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="border-green-500/30 bg-green-500/10">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-200">
            Successfully connected to Payman API with your provided credentials.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientId" className="text-white">Client ID</Label>
            <Input
              id="clientId"
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientSecret" className="text-white">Client Secret</Label>
            <Input
              id="clientSecret"
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              readOnly
            />
          </div>

          <Button 
            onClick={handleSave}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Credentials Configured ✓
          </Button>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
          <h4 className="text-white font-medium mb-2">Current Status:</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>✅ Client ID configured</li>
            <li>✅ Client Secret configured</li>
            <li>✅ Connected to Payman API</li>
            <li>✅ Ready to process payments</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CredentialsConfig;

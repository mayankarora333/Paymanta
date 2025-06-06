
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign } from 'lucide-react';

interface QuickPayFormProps {
  payeeName: string;
  disabled?: boolean;
  onQuickPay: (amount: string) => void;
}

const QuickPayForm = ({ payeeName, disabled = false, onQuickPay }: QuickPayFormProps) => {
  const [amount, setAmount] = useState('');

  const handleQuickPay = () => {
    if (amount && parseFloat(amount) > 0) {
      onQuickPay(amount);
      setAmount(''); // Clear the input after payment
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor={`amount-${payeeName}`} className="text-sm text-gray-400">
          Payment Amount (TD)
        </Label>
        <Input
          id={`amount-${payeeName}`}
          type="number"
          step="0.01"
          placeholder="Enter amount..."
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder-gray-400"
          disabled={disabled}
        />
      </div>
      
      <Button
        onClick={handleQuickPay}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        disabled={disabled || !amount || parseFloat(amount) <= 0}
      >
        <DollarSign className="mr-2 h-4 w-4" />
        Quick Pay
      </Button>
    </div>
  );
};

export default QuickPayForm;

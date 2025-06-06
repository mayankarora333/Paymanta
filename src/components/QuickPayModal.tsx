
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PaymanService } from '@/services/paymanService';
import { useToast } from '@/hooks/use-toast';

interface QuickPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  payeeName: string;
  prefilledAmount?: string;
  onPaymentComplete?: () => void;
}

const QuickPayModal = ({ isOpen, onClose, payeeName, prefilledAmount = '', onPaymentComplete }: QuickPayModalProps) => {
  const [amount, setAmount] = useState(prefilledAmount);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePay = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const payment = await PaymanService.quickPay(parseFloat(amount), payeeName);
      
      toast({
        title: "Payment Sent",
        description: `$${amount} sent to ${payeeName} successfully`,
      });

      setAmount('');
      onClose();
      onPaymentComplete?.();
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
        <DialogHeader>
          <DialogTitle>Quick Pay</DialogTitle>
          <DialogDescription className="text-gray-300">
            Send payment to {payeeName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount" className="text-white">Amount (TDS)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handlePay}
              disabled={loading || !amount}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {loading ? 'Processing...' : 'Pay'}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickPayModal;

'use client';

import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/Button';

interface CheckoutFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function StripePaymentForm({ onSuccess, onCancel }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Typically, you redirect to a return_url, or use redirect: "if_required" for single-page experience
        // We'll use redirect: 'if_required' to handle state cleanly
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message ?? 'An unknown error occurred');
      setIsProcessing(false);
    } else {
      // Payment successful
      onSuccess();
    }
  };

  return (
    <div className="relative p-8 bg-black/40 backdrop-blur-md border border-white/10 shadow-[0_8px_30px_rgba(181,164,138,0.08)] rounded-md">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-gold/5 to-transparent pointer-events-none rounded-md" />
      <div className="relative z-10">
        <h2 className="font-decorative text-2xl text-brand-cream tracking-wide mb-6 text-center">
          Finalize Reservation
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 bg-[#141210]/80 rounded-md border border-white/5">
            <PaymentElement 
              options={{
                layout: 'tabs',
              }}
            />
          </div>

          {errorMessage && (
            <div className="text-status-error text-sm text-center">
              {errorMessage}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!stripe || isProcessing}
              isLoading={isProcessing}
              fullWidth
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

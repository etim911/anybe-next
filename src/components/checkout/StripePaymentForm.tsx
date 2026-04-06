'use client';

import React, { useState, useEffect } from 'react';
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
  const [isReady, setIsReady] = useState(false);
  const [hasTimeout, setHasTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isReady) setHasTimeout(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, [isReady]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {},
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message ?? 'An unknown error occurred');
        setIsProcessing(false);
      } else {
        onSuccess();
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred during payment processing.');
      setIsProcessing(false);
    }
  };

  if (hasTimeout && !isReady) {
    return (
      <div className="relative p-6 sm:p-8 bg-black/80 backdrop-blur-md border border-red-500/30 rounded-md text-center">
         <h3 className="text-red-400 font-display mb-2">Connection Timeout</h3>
         <p className="text-silver-dim text-sm mb-4">The payment provider took too long to respond. Please try again.</p>
         <Button onClick={onCancel} variant="outline" fullWidth>Close</Button>
      </div>
    );
  }

  return (
    <div className="relative p-6 sm:p-8 bg-black/40 backdrop-blur-md border border-white/10 shadow-[0_8px_30px_rgba(181,164,138,0.08)] rounded-md w-full max-w-[400px] sm:max-w-md mx-auto overflow-hidden">
      {isProcessing && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="w-12 h-12 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin mb-4"></div>
          <div className="text-brand-gold font-display tracking-widest text-sm animate-pulse">PROCESSING PAYMENT...</div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-gold/5 to-transparent pointer-events-none rounded-md" />
      <div className="relative z-10">
        <h2 className="font-decorative text-xl sm:text-2xl text-brand-cream tracking-wide mb-6 text-center">
          Finalize Reservation
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="min-h-[200px] p-4 bg-[#141210]/80 rounded-md border border-white/5 relative">
            {!isReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-brand-gold/50 animate-pulse text-sm tracking-widest uppercase">Loading Secure Payment...</div>
              </div>
            )}
            <div className={!isReady ? 'invisible' : 'visible'}>
              <PaymentElement 
                onReady={() => setIsReady(true)}
                options={{
                  layout: 'tabs',
                }}
              />
            </div>
          </div>

          {errorMessage && (
            <div className="text-status-error text-sm text-center bg-status-error/10 border border-status-error/20 p-3 rounded">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
              fullWidth
              className="order-2 sm:order-1 text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!stripe || !isReady || isProcessing}
              isLoading={isProcessing}
              fullWidth
              className="order-1 sm:order-2 text-xs sm:text-sm"
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

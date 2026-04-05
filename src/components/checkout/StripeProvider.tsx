'use client';

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

export function StripeProvider({ 
  clientSecret, 
  children 
}: { 
  clientSecret: string;
  children: React.ReactNode;
}) {
  const options = {
    clientSecret,
    appearance: {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#b5a48a', // brand-gold
        colorBackground: '#141210', // bg-secondary or a bit transparent but Stripe iframes don't support rgba perfectly, we use solid dark
        colorText: '#ece6d8', // brand-cream
        colorDanger: '#8b3a3a', // status-error
        fontFamily: '"Cormorant Garamond", serif',
        spacingUnit: '4px',
        borderRadius: '4px',
      },
      rules: {
        '.Input': {
          backgroundColor: '#1a1814', // bg-tertiary
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: 'none',
        },
        '.Input:focus': {
          borderColor: '#b5a48a',
        },
        '.Label': {
          color: '#c4bfb3', // text-secondary
        },
        '.Tab': {
          backgroundColor: '#1a1814',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.Tab--selected': {
          borderColor: '#b5a48a',
          color: '#b5a48a',
        },
      }
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}

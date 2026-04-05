'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { setStoredGuest, clearStoredGuest } from '@/lib/auth';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { OTPInput } from '@/components/auth/OTPInput';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 30 : -30,
    opacity: 0
  })
};

const transition = {
  type: "spring",
  stiffness: 320,
  damping: 30
};

export default function AuthPage() {
  const router = useRouter();
  const [currentStep, setCurrentStepState] = useState(1);
  const [direction, setDirection] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  
  const setCurrentStep = (newStep: number) => {
    setDirection(newStep > currentStep ? 1 : -1);
    setCurrentStepState(newStep);
  };
  
  // Step 1 State
  const [phoneInput, setPhoneInput] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [isLoadingSend, setIsLoadingSend] = useState(false);
  
  // Step 2 State
  const [otp, setOtp] = useState('');
  const [isLoadingVerify, setIsLoadingVerify] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  
  // Step 3 State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  // Derived
  const fullPhone = '+1' + phoneInput.replace(/\D/g, '');
  const isProfileValid = firstName.trim().length > 0 && lastName.trim().length > 0;
  const isOtpValid = otp.length === 6;

  useEffect(() => {
    clearStoredGuest();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  

  const handleSendCode = async () => {
    setErrorMsg('');
    setIsLoadingSend(true);
    
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone })
      });
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to send verification code.');
      }
      
      setCurrentStep(2);
      setResendCountdown(30);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsLoadingSend(false);
    }
  };

  const handleResend = async () => {
    setErrorMsg('');
    setResendCountdown(30);
    
    try {
      await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone })
      });
    } catch {
      setErrorMsg('Failed to resend code.');
      setResendCountdown(0);
    }
  };

  const handleVerifyCode = async () => {
    setErrorMsg('');
    setIsLoadingVerify(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone, code: otp })
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Invalid code.');
      }

      const guest = data.guest;
      setStoredGuest(guest);
      
      if (guest.first_name) {
        router.push('/events');
      } else {
        setCurrentStep(3);
      }
    } catch (err) {
      setErrorMsg((err as Error).message);
      // Keep OTP visible so user can see and fix their mistake
    } finally {
      setIsLoadingVerify(false);
    }
  };

  const handleCompleteProfile = async () => {
    setErrorMsg('');
    setIsLoadingComplete(true);

    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: fullPhone,
          firstName: firstName.trim(),
          lastName: lastName.trim()
        })
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to save profile.');
      }

      setStoredGuest(data.guest);
      setCurrentStep(4);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsLoadingComplete(false);
    }
  };

  return (
    <div className="auth-page flex-1 max-w-[440px] w-full mx-auto px-4 flex flex-col justify-center">
      <div className="logo-area text-center mb-4">
        <div className="logo-title font-decorative text-3xl text-brand-cream tracking-widest mb-2">Anybe Night</div>
        <div className="logo-divider text-brand-creamDark text-sm tracking-widest opacity-60">- ✦ -</div>
      </div>

      {currentStep < 4 && (
        <div className="step-dots flex justify-center gap-3 mb-4">
          <div className={`w-2.5 h-2.5 rounded-full transition-all ${currentStep === 1 ? 'bg-brand-gold shadow-[0_0_8px_rgba(181,164,138,0.4)]' : 'bg-brand-gold/50'}`}></div>
          <div className={`w-2.5 h-2.5 rounded-full transition-all ${currentStep === 2 ? 'bg-brand-gold shadow-[0_0_8px_rgba(181,164,138,0.4)]' : currentStep > 2 ? 'bg-brand-gold/50' : 'bg-brand-gold/20'}`}></div>
          <div className={`w-2.5 h-2.5 rounded-full transition-all ${currentStep === 3 ? 'bg-brand-gold shadow-[0_0_8px_rgba(181,164,138,0.4)]' : 'bg-brand-gold/20'}`}></div>
        </div>
      )}

      {errorMsg && <div className="error-msg bg-red-900/20 border border-red-900/50 text-red-200 p-3 text-center mb-6 text-sm">{errorMsg}</div>}

      <Card variant="featured">
        <motion.div layout transition={transition} className="py-6 px-2 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {currentStep === 1 && (
              <motion.div key="step1" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition} className="text-center w-full">
                <form onSubmit={(e) => { e.preventDefault(); handleSendCode(); }}>
                  <div className="step-title font-decorative text-2xl text-brand-cream mb-6">Join the Inner Circle</div>

                  <div className="mb-6 text-left">
                    <PhoneInput
                      value={phoneInput}
                      onChange={(val) => {
                        setPhoneInput(val);
                        setIsPhoneValid(val.replace(/\D/g, '').length === 10);
                      }}
                    />
                  </div>

                  <div className="checkbox-row flex items-start justify-center gap-3 mb-6 text-left">
                    <input type="checkbox" id="ageCheck" checked={ageConfirmed} onChange={e => setAgeConfirmed(e.target.checked)} className="accent-brand-gold w-4 h-4 mt-1 flex-shrink-0" />
                    <label htmlFor="ageCheck" className="text-[12px] sm:text-[13px] text-brand-cream cursor-pointer leading-snug sm:leading-relaxed">I confirm I am 21+, agree to the Terms & Privacy Policy, and consent to receive marketing updates.</label>
                  </div>

                  <Button
                    type="submit"
                    isLoading={isLoadingSend}
                    disabled={!isPhoneValid || !ageConfirmed || isLoadingSend}
                    fullWidth
                  >
                    Next
                  </Button>
                </form>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition} className="text-center w-full">
                <form onSubmit={(e) => { e.preventDefault(); handleVerifyCode(); }}>
                  <div className="step-title font-decorative text-2xl text-brand-cream mb-6">Enter Code</div>
                  
                  <div className="mb-8">
                    <OTPInput value={otp} onChange={setOtp} length={6} error={errorMsg} />
                  </div>

                  <Button
                    type="submit"
                    isLoading={isLoadingVerify}
                    disabled={otp.length !== 6 || isLoadingVerify}
                    fullWidth
                  >
                    Verify
                  </Button>

                  <div className="mt-6">
                    <button type="button" className="text-sm italic text-brand-creamMuted hover:text-brand-cream underline underline-offset-4" disabled={resendCountdown > 0} onClick={handleResend}>
                      {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend code'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div key="step3" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition} className="text-center w-full">
                <form onSubmit={(e) => { e.preventDefault(); handleCompleteProfile(); }}>
                  <div className="step-title font-decorative text-2xl text-brand-cream mb-6">Your Name for the Guest List</div>

                  <div className="space-y-4 mb-6 text-left">
                    <div>
                      <label className="block font-display text-xs tracking-widest uppercase text-brand-creamDark mb-2">First Name</label>
                      <input type="text" className="w-full p-4 bg-brand-gold/5 border border-brand-gold/20 text-brand-cream font-serif text-lg focus:border-brand-gold outline-none" value={firstName} onChange={e => setFirstName(e.target.value)} />
                    </div>
                    <div>
                      <label className="block font-display text-xs tracking-widest uppercase text-brand-creamDark mb-2">Last Name</label>
                      <input type="text" className="w-full p-4 bg-brand-gold/5 border border-brand-gold/20 text-brand-cream font-serif text-lg focus:border-brand-gold outline-none" value={lastName} onChange={e => setLastName(e.target.value)} />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    isLoading={isLoadingComplete}
                    disabled={!isProfileValid || isLoadingComplete}
                    fullWidth
                  >
                    Secure My Spot
                  </Button>
                </form>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div key="step4" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition} className="text-center py-8 w-full">
                <h2 className="font-decorative text-4xl text-brand-cream mb-4 tracking-wider">Welcome</h2>
                <p className="text-lg italic text-brand-creamMuted mb-8">Enter the immersive experience. We hope you are ready to cross the threshold.</p>
                <div className="w-16 h-px bg-brand-gold/50 mx-auto mb-8"></div>
                <Button onClick={() => router.push('/events')} fullWidth>
                  View Upcoming Events
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Card>
    </div>
  );
}

'use client';

import React, { useState, useEffect, } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { setStoredGuest } from '@/lib/auth';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { OTPInput } from '@/components/auth/OTPInput';
import { Button } from '@/components/ui/Button';
import { OrnateFrame } from '@/components/ui/OrnateFrame';

export default function AuthPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Step 1 State
  const [phoneInput, setPhoneInput] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
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
  const fullPhone = countryCode + phoneInput.replace(/\D/g, '');
  const isProfileValid = firstName.trim().length > 0 && lastName.trim().length > 0;
  const isOtpValid = otp.length === 6;

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
      setOtp('');
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
    <OrnateFrame>
      <div className="auth-page max-w-[440px] mx-auto px-4 py-4 flex flex-col justify-center min-h-[100dvh]">
        <div className="logo-area text-center mb-4">
          <div className="logo-title font-decorative text-3xl text-cream tracking-widest mb-2">Anybe Night</div>
          <div className="logo-divider text-silver-dim text-sm tracking-widest opacity-60">- ✦ -</div>
        </div>

        {currentStep < 4 && (
          <div className="step-dots flex justify-center gap-3 mb-4">
            <div className={`w-2.5 h-2.5 rounded-full transition-all ${currentStep === 1 ? 'bg-gold shadow-[0_0_8px_rgba(181,164,138,0.4)]' : 'bg-gold/50'}`}></div>
            <div className={`w-2.5 h-2.5 rounded-full transition-all ${currentStep === 2 ? 'bg-gold shadow-[0_0_8px_rgba(181,164,138,0.4)]' : currentStep > 2 ? 'bg-gold/50' : 'bg-border-light'}`}></div>
            <div className={`w-2.5 h-2.5 rounded-full transition-all ${currentStep === 3 ? 'bg-gold shadow-[0_0_8px_rgba(181,164,138,0.4)]' : 'bg-border-light'}`}></div>
          </div>
        )}

        {errorMsg && <div className="error-msg bg-red-900/20 border border-red-900/50 text-red-200 p-3 text-center mb-6 text-sm">{errorMsg}</div>}

        {currentStep === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center">
            <div className="step-title font-decorative text-2xl text-cream mb-6">Sign In or Register</div>

            <div className="mb-6 text-left">
              <PhoneInput 
                value={phoneInput} 
                onChange={(val) => {
                  setPhoneInput(val);
                  setIsPhoneValid(val.replace(/\D/g, '').length === 10);
                }}
                countryCode={countryCode} 
                onCountryCodeChange={setCountryCode} 
              />
              
            </div>

            <div className="checkbox-row flex items-center justify-center gap-2 mb-6">
              <input type="checkbox" id="ageCheck" checked={ageConfirmed} onChange={e => setAgeConfirmed(e.target.checked)} className="accent-gold w-4 h-4" />
              <label htmlFor="ageCheck" className="text-sm text-cream cursor-pointer">I confirm I am 21 years of age or older.</label>
            </div>

            
            <Button 
              onClick={handleSendCode} 
              isLoading={isLoadingSend} 
              disabled={!isPhoneValid || !ageConfirmed || isLoadingSend} 
              fullWidth
            >
              Next
            </Button>
            <div className="mt-4 text-[10px] text-silver-dim/60 leading-relaxed text-center">
              By continuing, you agree to our <a href="/terms" className="text-gold underline underline-offset-2">Terms & Privacy Policy</a> and consent to SMS verification (msg/data rates may apply).
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center">
            <div className="step-title font-decorative text-2xl text-cream mb-6">Enter Code</div>
            
            <div className="mb-8">
              <OTPInput value={otp} onChange={setOtp} length={6} />
            </div>

            <Button 
              onClick={handleVerifyCode} 
              isLoading={isLoadingVerify} 
              disabled={!isOtpValid || isLoadingVerify} 
              fullWidth
            >
              Verify
            </Button>

            <div className="mt-6">
              <button className="text-sm italic text-text-secondary hover:text-silver-light underline underline-offset-4" disabled={resendCountdown > 0} onClick={handleResend}>
                {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend code'}
              </button>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center">
            <div className="step-title font-decorative text-2xl text-cream mb-6">We Want to Know You</div>

            <div className="space-y-4 mb-6 text-left">
              <div>
                <label className="block font-display text-[10px] tracking-[3px] uppercase text-silver-dim mb-2">First Name</label>
                <input type="text" className="w-full p-3.5 bg-black/60 border border-border-light text-cream font-serif text-lg focus:border-gold outline-none" value={firstName} onChange={e => setFirstName(e.target.value)} />
              </div>
              <div>
                <label className="block font-display text-[10px] tracking-[3px] uppercase text-silver-dim mb-2">Last Name</label>
                <input type="text" className="w-full p-3.5 bg-black/60 border border-border-light text-cream font-serif text-lg focus:border-gold outline-none" value={lastName} onChange={e => setLastName(e.target.value)} />
              </div>
            </div>

            <Button 
              onClick={handleCompleteProfile} 
              isLoading={isLoadingComplete} 
              disabled={!isProfileValid || isLoadingComplete} 
              fullWidth
            >
              Enter
            </Button>
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center py-8">
            <h2 className="font-decorative text-4xl text-cream mb-4 tracking-wider">Welcome</h2>
            <p className="text-lg italic text-text-secondary mb-8">Enter the immersive experience. We hope you are ready to cross the threshold.</p>
            <div className="w-16 h-px bg-gold/50 mx-auto mb-8"></div>
            <Button onClick={() => router.push('/events')} fullWidth>
              Enter
            </Button>
          </motion.div>
        )}

      </div>
    </OrnateFrame>
  );
}

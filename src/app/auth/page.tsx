'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { setStoredGuest, Guest } from '@/lib/auth';

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
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isLoadingVerify, setIsLoadingVerify] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  
  // Step 3 State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  // Derived
  const fullPhone = countryCode + phoneInput.replace(/\D/g, '');
  const isProfileValid = firstName.trim().length > 0 && lastName.trim().length > 0;
  const isOtpValid = otp.join('').length === 6;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, '');
    if (digits.length > 10) digits = digits.slice(0, 10);

    let formatted = digits;
    if (digits.length > 6) {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length > 3) {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else if (digits.length > 0) {
      formatted = `(${digits}`;
    }
    
    setPhoneInput(formatted);
    setIsPhoneValid(digits.length === 10);
  };

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
      setTimeout(() => otpRefs.current[0]?.focus(), 200);
    } catch (err: any) {
      setErrorMsg(err.message);
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
    } catch (err: any) {
      setErrorMsg('Failed to resend code.');
      setResendCountdown(0);
    }
  };

  const handleOtpChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter' && isOtpValid) {
      handleVerifyCode();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pasted.split('').forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });
    setOtp(newOtp);
    const focusIdx = Math.min(pasted.length, 5);
    otpRefs.current[focusIdx]?.focus();
  };

  const handleVerifyCode = async () => {
    setErrorMsg('');
    setIsLoadingVerify(true);
    const code = otp.join('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone, code })
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Invalid code.');
      }

      const guest = data.guest;
      if (guest.first_name) {
        setStoredGuest(guest);
        // Already registered, go to events or dashboard
        router.push('/events');
      } else {
        // Needs profile setup
        setCurrentStep(3);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
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
      router.push('/events');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoadingComplete(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Cinzel:wght@400;500;600;700&family=Cinzel+Decorative:wght@400;700;900&display=swap');
        
        :root {
          --bg-deep: #0c0b0a;
          --bg-card: #1a1816;
          --silver-light: #ddd8cc;
          --silver-dim: #6e6a61;
          --gold: #b5a48a;
          --cream: #ece6d8;
          --text-primary: #ddd8cc;
          --text-secondary: #8a857a;
          --border: #2e2a24;
          --border-light: #3d3830;
        }

        body {
          font-family: 'Cormorant Garamond', Georgia, serif;
          background: var(--bg-deep);
          color: var(--text-primary);
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(30, 27, 22, 0.5) 0%, transparent 60%),
            radial-gradient(ellipse at 50% 100%, rgba(20, 18, 14, 0.8) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .auth-page {
          position: relative;
          z-index: 1;
          max-width: 520px;
          margin: 0 auto;
          padding: 48px 24px 64px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .logo-area { text-align: center; margin-bottom: 28px; }
        .logo-svg { display: inline-block; margin-bottom: 8px; }
        .logo-svg svg { width: 56px; height: 56px; opacity: 0.85; }
        .logo-title {
          font-family: 'Cinzel Decorative', serif;
          font-size: 32px;
          font-weight: 400;
          color: var(--cream);
          letter-spacing: 2px;
          text-shadow: 0 1px 16px rgba(180, 170, 150, 0.08);
        }
        .logo-divider {
          text-align: center;
          color: var(--silver-dim);
          font-size: 14px;
          margin: 12px 0 8px;
          letter-spacing: 4px;
          opacity: 0.6;
        }

        .step-dots { display: flex; justify-content: center; gap: 12px; margin-bottom: 28px; }
        .step-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--border-light); transition: all 0.4s ease; }
        .step-dot.active { background: var(--gold); box-shadow: 0 0 8px rgba(181, 164, 138, 0.4); }
        .step-dot.completed { background: var(--gold); opacity: 0.5; }

        .book-frame {
          position: relative;
          padding: 48px 36px 40px;
          border: 1px solid var(--border);
          background: linear-gradient(160deg, rgba(26,24,20,0.6), rgba(14,12,10,0.8));
        }

        .book-frame .cn { position: absolute; width: 28px; height: 28px; opacity: 0.4; }
        .book-frame .cn svg { width: 100%; height: 100%; }
        .cn-tl { top: 8px; left: 8px; }
        .cn-tr { top: 8px; right: 8px; transform: scaleX(-1); }
        .cn-bl { bottom: 8px; left: 8px; transform: scaleY(-1); }
        .cn-br { bottom: 8px; right: 8px; transform: scale(-1); }

        .book-frame::before, .book-frame::after {
          content: '·  ✦  ·';
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          letter-spacing: 4px;
          color: var(--silver-dim);
          opacity: 0.6;
        }
        .book-frame::before { top: -8px; background: var(--bg-deep); padding: 0 12px; }
        .book-frame::after { bottom: -8px; background: var(--bg-deep); padding: 0 12px; }

        .step-heading {
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: var(--gold);
          text-align: center;
          margin-bottom: 8px;
        }

        .step-title {
          font-family: 'Cinzel Decorative', serif;
          font-size: 24px;
          font-weight: 400;
          color: var(--cream);
          text-align: center;
          letter-spacing: 1px;
          margin-bottom: 24px;
        }

        .step-subtitle {
          font-size: 16px;
          color: var(--text-secondary);
          text-align: center;
          font-style: italic;
          margin-bottom: 28px;
          line-height: 1.6;
        }

        .form-group { margin-bottom: 20px; }
        .form-label {
          display: block;
          font-family: 'Cinzel', serif;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--silver-dim);
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(12, 11, 10, 0.6);
          border: 1px solid var(--border-light);
          color: var(--cream);
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 18px;
          transition: border-color 0.3s;
          outline: none;
        }
        .form-input:focus { border-color: var(--gold); }
        .form-input::placeholder { color: var(--silver-dim); opacity: 0.6; }

        .phone-row { display: flex; gap: 10px; }
        .country-select {
          width: 110px;
          flex-shrink: 0;
          padding: 14px 10px;
          background: rgba(12, 11, 10, 0.6);
          border: 1px solid var(--border-light);
          color: var(--cream);
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 16px;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236e6a61' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
        }
        .country-select:focus { border-color: var(--gold); }
        .phone-input { flex: 1; }

        .checkbox-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 24px;
        }
        
        .checkbox-row input {
          width: 16px;
          height: 16px;
          accent-color: var(--gold);
        }

        .checkbox-row label {
          font-size: 14px;
          color: var(--cream);
          cursor: pointer;
        }

        .otp-container { display: flex; justify-content: center; gap: 10px; margin-bottom: 24px; }
        .otp-box {
          width: 48px;
          height: 56px;
          text-align: center;
          background: rgba(12, 11, 10, 0.6);
          border: 1px solid var(--border-light);
          color: var(--cream);
          font-family: 'Cinzel', serif;
          font-size: 24px;
          outline: none;
          transition: border-color 0.3s;
          caret-color: var(--gold);
        }
        .otp-box:focus {
          border-color: var(--gold);
          box-shadow: 0 0 12px rgba(181, 164, 138, 0.15);
        }

        .cta-btn {
          display: block;
          width: 100%;
          padding: 16px 32px;
          background: transparent;
          border: 1px solid var(--gold);
          color: var(--gold);
          font-family: 'Cinzel', serif;
          font-size: 13px;
          letter-spacing: 5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.4s;
          margin-top: 8px;
        }
        .cta-btn:hover:not(:disabled) {
          background: rgba(181, 164, 138, 0.08);
          box-shadow: 0 0 32px rgba(181, 164, 138, 0.1);
          transform: translateY(-1px);
        }
        .cta-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .cta-btn.loading { opacity: 0.6; pointer-events: none; }

        .link-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 15px;
          font-style: italic;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.3s;
          padding: 0;
        }
        .link-btn:hover { color: var(--silver-light); }
        .resend-row { text-align: center; margin-top: 20px; }

        .terms {
          text-align: center;
          font-size: 13px;
          color: var(--silver-dim);
          font-style: italic;
          margin-top: 24px;
          line-height: 1.6;
        }

        .error-msg {
          background: rgba(143, 80, 80, 0.15);
          border: 1px solid rgba(143, 80, 80, 0.3);
          color: #d4a0a0;
          padding: 12px 16px;
          font-size: 15px;
          text-align: center;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        @media (max-width: 480px) {
          .auth-page { padding: 28px 16px 48px; }
          .book-frame { padding: 36px 20px 28px; }
          .logo-title { font-size: 26px; }
          .step-title { font-size: 20px; }
          .otp-box { width: 42px; height: 50px; font-size: 20px; }
          .otp-container { gap: 8px; }
          .country-select { width: 100px; }
        }
      `}} />

      <div className="auth-page">
        <div className="logo-area">
          <div className="logo-svg">
            <svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
              <g fill="#c4bfb3">
                <rect x="28" y="2" width="44" height="24" rx="12" fill="none" stroke="#c4bfb3" strokeWidth="2.5"/>
                <circle cx="60" cy="14" r="7" fill="#c4bfb3"/>
                <circle cx="36" cy="42" r="8" fill="none" stroke="#c4bfb3" strokeWidth="2.5"/>
                <path d="M36 50 L36 70 M28 58 L44 58 M36 70 L28 80 M36 70 L44 80" stroke="#c4bfb3" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <circle cx="64" cy="42" r="8" fill="none" stroke="#c4bfb3" strokeWidth="2.5"/>
                <path d="M64 50 L64 70 M56 58 L72 58 M64 70 L56 80 M64 70 L72 80" stroke="#c4bfb3" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              </g>
            </svg>
          </div>
          <div className="logo-title">Anybe Night</div>
          <div className="logo-divider">- ✦ -</div>
        </div>

        <div className="step-dots">
          <div className={`step-dot ${currentStep === 1 ? 'active' : 'completed'}`}></div>
          <div className={`step-dot ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}></div>
          <div className={`step-dot ${currentStep === 3 ? 'active' : ''}`}></div>
        </div>

        <div className="book-frame">
          <div className="cn cn-tl"><svg viewBox="0 0 40 40"><path d="M2 38 C2 18 18 2 38 2" stroke="#c4bfb3" strokeWidth="1" fill="none" opacity="0.4"/><circle cx="4" cy="36" r="2" fill="#c4bfb3" opacity="0.3"/><circle cx="36" cy="4" r="2" fill="#c4bfb3" opacity="0.3"/></svg></div>
          <div className="cn cn-tr"><svg viewBox="0 0 40 40"><path d="M2 38 C2 18 18 2 38 2" stroke="#c4bfb3" strokeWidth="1" fill="none" opacity="0.4"/><circle cx="4" cy="36" r="2" fill="#c4bfb3" opacity="0.3"/><circle cx="36" cy="4" r="2" fill="#c4bfb3" opacity="0.3"/></svg></div>
          <div className="cn cn-bl"><svg viewBox="0 0 40 40"><path d="M2 38 C2 18 18 2 38 2" stroke="#c4bfb3" strokeWidth="1" fill="none" opacity="0.4"/><circle cx="4" cy="36" r="2" fill="#c4bfb3" opacity="0.3"/><circle cx="36" cy="4" r="2" fill="#c4bfb3" opacity="0.3"/></svg></div>
          <div className="cn cn-br"><svg viewBox="0 0 40 40"><path d="M2 38 C2 18 18 2 38 2" stroke="#c4bfb3" strokeWidth="1" fill="none" opacity="0.4"/><circle cx="4" cy="36" r="2" fill="#c4bfb3" opacity="0.3"/><circle cx="36" cy="4" r="2" fill="#c4bfb3" opacity="0.3"/></svg></div>

          {errorMsg && <div className="error-msg">{errorMsg}</div>}

          {currentStep === 1 && (
            <div>
              <div className="step-heading">Step One</div>
              <div className="step-title">Sign In or Register</div>
              <div className="step-subtitle">Enter your phone number to begin</div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="phone-row">
                  <select 
                    className="country-select" 
                    value={countryCode} 
                    onChange={e => setCountryCode(e.target.value)}
                  >
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+61">🇦🇺 +61</option>
                  </select>
                  <input 
                    type="tel" 
                    className="form-input phone-input" 
                    placeholder="(555) 123-4567" 
                    value={phoneInput}
                    onChange={handlePhoneChange}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && isPhoneValid && ageConfirmed && !isLoadingSend) {
                        handleSendCode();
                      }
                    }}
                  />
                </div>
              </div>

              <div className="checkbox-row">
                <input 
                  type="checkbox" 
                  id="ageCheck" 
                  checked={ageConfirmed} 
                  onChange={e => setAgeConfirmed(e.target.checked)} 
                />
                <label htmlFor="ageCheck">I confirm I am 21 years of age or older.</label>
              </div>

              <button 
                className={`cta-btn ${isLoadingSend ? 'loading' : ''}`} 
                disabled={!isPhoneValid || !ageConfirmed || isLoadingSend}
                onClick={handleSendCode}
              >
                {isLoadingSend ? 'Sending...' : 'Next'}
              </button>

              <p className="terms">
                By clicking NEXT, you agree to our <a href="/terms" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>Terms and Privacy Policy</a>. 
                You consent to receive recurring automated promotional and transactional text messages from Anybe and its affiliated event brands. 
                Message frequency varies. Consent is not required as a condition of purchase. Msg & data rates may apply. Reply STOP to opt out or HELP for help.
              </p>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div className="step-heading">Step Two</div>
              <div className="step-title">Enter Code</div>
              <div className="step-subtitle">Verification code sent to {fullPhone}</div>

              <div className="otp-container">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el }}
                    type="text"
                    className="otp-box"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    onPaste={handleOtpPaste}
                  />
                ))}
              </div>

              <button 
                className={`cta-btn ${isLoadingVerify ? 'loading' : ''}`} 
                disabled={!isOtpValid || isLoadingVerify}
                onClick={handleVerifyCode}
              >
                {isLoadingVerify ? 'Verifying...' : 'Verify'}
              </button>

              <div className="resend-row">
                <button 
                  className="link-btn" 
                  disabled={resendCountdown > 0} 
                  onClick={handleResend}
                >
                  {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend code'}
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div className="step-heading">Step Three</div>
              <div className="step-title">We Want to Know You</div>
              <div className="step-subtitle">Tell us a little about yourself</div>

              <div className="form-group">
                <label className="form-label">First Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Your first name" 
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Your last name" 
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && isProfileValid && !isLoadingComplete) {
                      handleCompleteProfile();
                    }
                  }}
                />
              </div>

              <button 
                className={`cta-btn ${isLoadingComplete ? 'loading' : ''}`} 
                disabled={!isProfileValid || isLoadingComplete}
                onClick={handleCompleteProfile}
              >
                {isLoadingComplete ? 'Saving...' : 'Enter'}
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

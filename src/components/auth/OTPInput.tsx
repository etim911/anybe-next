import React, { useRef, useState, useEffect } from 'react';

export interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  error?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({ length = 6, value, onChange, error }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Sync external value to internal array representation
    const valArr = value.split('').slice(0, length);
    const newOtp = [...valArr, ...Array(length - valArr.length).fill('')];
    setOtp(newOtp);
  }, [value, length]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isNaN(Number(val))) return; // only allow numbers

    const newOtp = [...otp];
    // Take only the last character entered
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);
    onChange(newOtp.join(''));

    // Move to next input if not empty
    if (val && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length);
    if (!pastedData) return;
    
    const newOtp = [...otp];
    pastedData.split('').forEach((char, idx) => {
      newOtp[idx] = char;
    });
    setOtp(newOtp);
    onChange(newOtp.join(''));
    
    // Focus last filled input or end
    const targetIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[targetIndex]?.focus();
  };

  return (
    <div className="flex flex-col items-center">
      <label className="text-sm font-cinzel text-cream mb-4 tracking-wide uppercase">
        Enter Security Code
      </label>
      <div className="flex space-x-2 md:space-x-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`
              w-10 h-12 md:w-14 md:h-16 text-center text-xl md:text-3xl font-cinzel text-gold bg-[#141210] 
              border-b-2 ${error ? 'border-red-500' : 'border-gold/30'}
              focus:outline-none focus:border-gold focus:bg-gold/5 transition-all duration-300
              placeholder-cream/10
            `}
            placeholder="-"
          />
        ))}
      </div>
      {error && (
        <span className="text-red-500 text-xs mt-4 font-cormorant">{error}</span>
      )}
    </div>
  );
};

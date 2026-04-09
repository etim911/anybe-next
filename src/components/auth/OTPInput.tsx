import React, { useRef } from 'react';

export interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  error?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({ length = 6, value, onChange, error }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otp = [...value.split('').slice(0, length), ...Array(length).fill('')].slice(0, length);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isNaN(Number(val))) return;

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    onChange(newOtp.join(''));

    if (val && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
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
    onChange(newOtp.join(''));
    
    const targetIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[targetIndex]?.focus();
  };

  return (
    <div className="flex flex-col items-center">
      <label className="text-sm font-display text-cream mb-4 tracking-wide uppercase">
        Enter Security Code
      </label>
      <div className="flex gap-2 w-full max-w-sm mx-auto">
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
              flex-1 min-w-0 aspect-[4/5] text-center text-2xl md:text-3xl font-display text-gold bg-[#141210] 
              border-b-2 ${error ? 'border-red-500' : 'border-gold/30'}
              focus:outline-none focus:border-gold focus:bg-gold/5 focus:shadow-[0_0_15px_rgba(212,168,84,0.15)] transition-all duration-300
              placeholder-cream/10
            `}
            placeholder="-"
          />
        ))}
      </div>
      {error && (
        <span className="text-red-500 text-xs mt-4 font-serif">{error}</span>
      )}
    </div>
  );
};

import React from 'react';

export interface PhoneInputProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    onChange(formatted);
  };

  return (
    <div className="flex flex-col mb-4">
      <label className="text-base font-display text-cream mb-2 tracking-wide text-left uppercase">
        Phone Number
      </label>
      <div className="flex border border-border-light bg-black/60 focus-within:border-gold focus-within:shadow-[0_0_15px_rgba(212,168,84,0.15)] transition-all duration-300">
        <div className="flex items-center border-r border-border-light px-4">
          <span className="text-cream font-serif text-xl">+1</span>
        </div>
        <input
          type="tel"
          autoComplete="tel"
          value={value}
          onChange={handleChange}
          placeholder="(XXX) XXX-XXXX"
          className="w-full bg-transparent text-cream font-serif placeholder-silver-dim px-4 py-4 focus:outline-none text-xl outline-none"
        />
      </div>
      {error && (
        <span className="text-red-500 text-xs mt-1 font-serif text-left">{error}</span>
      )}
    </div>
  );
};

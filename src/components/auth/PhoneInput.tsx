import React from 'react';
import PhoneInputLib from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

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
  return (
    <div className="flex flex-col mb-4">
      <label className="text-base font-display text-cream mb-2 tracking-wide text-left uppercase">
        Phone Number
      </label>
      <div className="flex border border-border-light bg-black/60 focus-within:border-gold focus-within:shadow-[0_0_15px_rgba(212,168,84,0.15)] transition-all duration-300">
        <PhoneInputLib
          placeholder="Enter phone number"
          value={value}
          onChange={(val) => onChange(val || '')}
          defaultCountry="US"
          className="w-full text-cream font-serif placeholder-silver-dim px-4 py-4 focus:outline-none text-xl outline-none [&>.PhoneInputCountry]:border-r [&>.PhoneInputCountry]:border-border-light [&>.PhoneInputCountry]:pr-4 [&>.PhoneInputCountry]:mr-4 [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:border-none [&_.PhoneInputInput]:w-full"
        />
      </div>
      {error && (
        <span className="text-red-500 text-xs mt-1 font-serif text-left">{error}</span>
      )}
    </div>
  );
};

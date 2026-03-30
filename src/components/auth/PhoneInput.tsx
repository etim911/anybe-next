import React from 'react';

export interface PhoneInputProps {
  value: string;
  onChange: (val: string) => void;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  error?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  countryCode,
  onCountryCodeChange,
  error,
}) => {
  return (
    <div className="flex flex-col mb-4">
      <label className="text-sm font-cinzel text-cream mb-2 tracking-wide">
        Phone Number
      </label>
      <div className="flex border border-gold/30 rounded-none bg-[#141210] focus-within:border-gold focus-within:ring-1 focus-within:ring-gold/50 transition-all duration-300">
        <div className="flex items-center border-r border-gold/20 pl-2 pr-1">
          <select
            value={countryCode}
            onChange={(e) => onCountryCodeChange(e.target.value)}
            className="bg-transparent text-cream font-cinzel tracking-widest uppercase focus:outline-none appearance-none py-3 pr-4 pl-2 text-sm md:text-base"
          >
            <option value="+1">US (+1)</option>
            <option value="+44">UK (+44)</option>
            <option value="+61">AU (+61)</option>
            <option value="+91">IN (+91)</option>
            {/* Add more as needed */}
          </select>
          <div className="pointer-events-none -ml-4 mr-2 text-gold/60">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="(555) 000-0000"
          className="w-full bg-transparent text-cream font-cormorant placeholder-cream/30 px-4 py-3 focus:outline-none text-lg tracking-wide"
        />
      </div>
      {error && (
        <span className="text-red-500 text-xs mt-1 font-cormorant">{error}</span>
      )}
    </div>
  );
};

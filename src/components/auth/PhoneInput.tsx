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
      <label className="text-sm font-cinzel text-cream mb-2 tracking-wide text-left uppercase">
        Phone Number
      </label>
      <div className="flex border border-border-light bg-black/60 focus-within:border-gold focus-within:shadow-[0_0_15px_rgba(212,168,84,0.15)] transition-all duration-300">
        <div className="flex items-center border-r border-border-light">
          <select
            value={countryCode}
            onChange={(e) => onCountryCodeChange(e.target.value.split("-")[0])}
            className="bg-transparent text-cream font-serif focus:outline-none appearance-none py-3.5 pl-4 pr-6 text-lg cursor-pointer outline-none"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%236e6a61\' stroke-width=\'1.5\' fill=\'none\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
          >
            <option value="+1-US">🇺🇸 +1</option>
            <option value="+1-CA">🇨🇦 +1</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+61">🇦🇺 +61</option>
            <option value="+64">🇳🇿 +64</option>
            <option value="+353">🇮🇪 +353</option>
            <option value="+49">🇩🇪 +49</option>
            <option value="+33">🇫🇷 +33</option>
            <option value="+34">🇪🇸 +34</option>
            <option value="+39">🇮🇹 +39</option>
            <option value="+31">🇳🇱 +31</option>
            <option value="+46">🇸🇪 +46</option>
            <option value="+47">🇳🇴 +47</option>
            <option value="+45">🇩🇰 +45</option>
            <option value="+358">🇫🇮 +358</option>
            <option value="+41">🇨🇭 +41</option>
            <option value="+43">🇦🇹 +43</option>
            <option value="+32">🇧🇪 +32</option>
            <option value="+351">🇵🇹 +351</option>
            <option value="+48">🇵🇱 +48</option>
            <option value="+7">🇷🇺 +7</option>
            <option value="+81">🇯🇵 +81</option>
            <option value="+82">🇰🇷 +82</option>
            <option value="+86">🇨🇳 +86</option>
            <option value="+52">🇲🇽 +52</option>
          </select>
        </div>
        <input
          type="tel"
          value={value}
          onChange={handleChange}
          placeholder="(555) 000-0000"
          className="w-full bg-transparent text-cream font-serif placeholder-silver-dim px-4 py-3.5 focus:outline-none text-lg outline-none"
        />
      </div>
      {error && (
        <span className="text-red-500 text-xs mt-1 font-serif text-left">{error}</span>
      )}
    </div>
  );
};
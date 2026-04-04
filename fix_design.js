const fs = require('fs');
const path = require('path');

const baseDir = '/tmp/anybe-next-integration';

// 1. Footer.tsx
const footerPath = path.join(baseDir, 'src/components/layout/Footer.tsx');
let footer = fs.readFileSync(footerPath, 'utf8');
footer = footer.replace(
  /<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white\/20 to-transparent" \/>/,
  '<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />'
);
footer = footer.replace(
  /<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black\/60 via-black\/20 to-transparent backdrop-blur-sm pointer-events-none -z-10" \/>/,
  '<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-md pointer-events-none -z-10" />'
);
fs.writeFileSync(footerPath, footer);

// 2. Input.tsx
const inputPath = path.join(baseDir, 'src/components/ui/Input.tsx');
let input = fs.readFileSync(inputPath, 'utf8');
input = input.replace(
  /<MotionDiv\s+className={`relative rounded-none border transition-colors duration-300 bg-\[#141210\] \${\s+error\s+\?\s+'border-red-500\/50'\s+:\s+isFocused\s+\?\s+'border-\[#d4a854\] shadow-\[0_0_15px_rgba\(212,168,84,0\.15\)\]'\s+:\s+'border-\[#d4a854\]\/30 hover:border-\[#d4a854\]\/50'\s+}`}\s+animate={{\s+boxShadow: isFocused && !error \? '0 0 15px rgba\(212,168,84,0\.25\)' : '0 0 0px rgba\(212,168,84,0\)',\s+}}\s+transition={{ duration: 0\.3 }}\s+>/g,
  `<div className={\`relative rounded-none border transition-all duration-300 bg-[#141210] focus-within:shadow-[0_0_15px_rgba(212,168,84,0.15)] \${error ? 'border-red-500/50' : isFocused ? 'border-[#d4a854]' : 'border-[#d4a854]/30 hover:border-[#d4a854]/50'}\`}>`
);
input = input.replace(/<\/MotionDiv>/g, '</div>');
// Also remove MotionDiv const if possible, but leaving it unused is fine.
fs.writeFileSync(inputPath, input);

// 3. OTPInput.tsx
const otpPath = path.join(baseDir, 'src/components/auth/OTPInput.tsx');
let otp = fs.readFileSync(otpPath, 'utf8');
otp = otp.replace(/w-10 h-12/g, 'w-11 h-12');
fs.writeFileSync(otpPath, otp);

// 4. Glassmorphism Consistency
// ProfileDrawer.tsx
const profilePath = path.join(baseDir, 'src/components/profile/ProfileDrawer.tsx');
let profile = fs.readFileSync(profilePath, 'utf8');
profile = profile.replace(
  /bg-\[#0c0b0a\]\/95 border-l border-\[#2e2a24\]/g,
  'backdrop-blur-md bg-black/40 border-l border-white/10'
);
fs.writeFileSync(profilePath, profile);

console.log('Script completed');

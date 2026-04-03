'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getStoredGuest, Guest } from '@/lib/auth';
import { ProfileDrawer } from '@/components/profile/ProfileDrawer';

export function Header() {
  const pathname = usePathname();
  const [guest, setGuest] = useState<Guest | null>(null);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGuest(getStoredGuest());
  }, []);
  
  const initials = guest ? `${guest.first_name?.[0] || ''}${guest.last_name?.[0] || ''}`.toUpperCase() : null;

  if (pathname === '/auth') return null;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between py-4 px-6 bg-gradient-to-b from-bg-primary/95 to-bg-primary/0 backdrop-blur-[4px]">
        <Link href="/events" className="flex items-center gap-2.5 opacity-85 hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 100 80" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
            <g fill="#c4bfb3">
              <rect x="28" y="2" width="44" height="24" rx="12" fill="none" stroke="#c4bfb3" strokeWidth="2.5"/>
              <circle cx="60" cy="14" r="7" fill="#c4bfb3"/>
              <circle cx="36" cy="42" r="8" fill="none" stroke="#c4bfb3" strokeWidth="2.5"/>
              <path d="M36 50 L36 70 M28 58 L44 58 M36 70 L28 80 M36 70 L44 80" stroke="#c4bfb3" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <circle cx="64" cy="42" r="8" fill="none" stroke="#c4bfb3" strokeWidth="2.5"/>
              <path d="M64 50 L64 70 M56 58 L72 58 M64 70 L56 80 M64 70 L72 80" stroke="#c4bfb3" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            </g>
          </svg>
          <span className="font-decorative text-cream tracking-[1px] text-base hidden sm:inline-block">Anybe</span>
        </Link>
        
        {initials && (
          <button
            id="profile-trigger"
            className="w-10 h-10 rounded-full bg-[#1a1814] border border-[#b5a48a]/30 flex items-center justify-center text-[#b5a48a] font-display text-sm tracking-widest hover:border-[#b5a48a] transition-all duration-300 shadow-lg"
            style={{ backgroundImage: 'radial-gradient(circle at center, #2a2620 0%, #1a1814 100%)' }}
            onClick={() => document.dispatchEvent(new CustomEvent('toggle-profile-drawer'))}
          >
            {initials}
          </button>
        )}
      </nav>
      
      {/* ProfileDrawer rendered OUTSIDE the nav to avoid z-index stacking context trap */}
      {initials && <ProfileDrawer />}
    </>
  );
}

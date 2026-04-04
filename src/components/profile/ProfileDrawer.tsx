'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getStoredGuest, clearStoredGuest, Guest } from '@/lib/auth';
import { Button } from '@/components/ui/Button';

export function ProfileDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const router = useRouter();

  useEffect(() => {
    const storedGuest = getStoredGuest();
    if (storedGuest) {
      setGuest(storedGuest);
      setFormData({
        firstName: storedGuest.first_name || '',
        lastName: storedGuest.last_name || '',
        email: storedGuest.email || '',
        phone: storedGuest.phone || ''
      });
    }

    // Listen for the custom event from the Header's avatar button
    const handler = () => setIsOpen(prev => !prev);
    document.addEventListener('toggle-profile-drawer', handler);
    return () => document.removeEventListener('toggle-profile-drawer', handler);
  }, []);

  if (!guest) return null;

  const initials = `${guest.first_name?.[0] || ''}${guest.last_name?.[0] || ''}`.toUpperCase();
  const memberSince = guest.created_at ? new Date(guest.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : '';

  const renderAvatar = () => {
    if (initials) return initials;
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
      </svg>
    );
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      if (typeof window !== 'undefined') {
        localStorage.setItem('anybe_guest', JSON.stringify(data.guest));
      }
      setGuest(data.guest);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err: unknown) {
      setMessage({ text: err instanceof Error ? err.message : 'Error', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    clearStoredGuest();
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 9998 }}
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#0c0b0a]/95 border-l border-[#2e2a24] overflow-y-auto [-webkit-overflow-scrolling:touch]"
            style={{ zIndex: 9999 }}
          >
            <div className="absolute inset-0 backdrop-blur-md pointer-events-none" style={{ zIndex: -1 }} />
            <div className="p-8 relative">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-[#6e6a61] hover:text-[#ece6d8] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="flex flex-col items-center mt-8 mb-10">
                <div 
                  className="w-24 h-24 rounded-full bg-[#1a1814] border border-[#b5a48a]/30 flex items-center justify-center text-[#b5a48a] font-display text-2xl tracking-widest mb-4 shadow-xl"
                  style={{ backgroundImage: 'radial-gradient(circle at center, #2a2620 0%, #1a1814 100%)' }}
                >
                  {renderAvatar()}
                </div>
                <div className="text-[#6e6a61] text-xs tracking-widest uppercase">
                  Member Since: {memberSince}
                </div>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-[#6e6a61] text-xs tracking-widest uppercase mb-2">First Name</label>
                  <input type="text" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full bg-transparent border-b border-[#2e2a24] text-[#ece6d8] py-2 focus:outline-none focus:border-[#b5a48a] transition-colors font-display text-base tracking-wide" />
                </div>
                <div>
                  <label className="block text-[#6e6a61] text-xs tracking-widest uppercase mb-2">Last Name</label>
                  <input type="text" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full bg-transparent border-b border-[#2e2a24] text-[#ece6d8] py-2 focus:outline-none focus:border-[#b5a48a] transition-colors font-display text-base tracking-wide" />
                </div>
                <div>
                  <label className="block text-[#6e6a61] text-xs tracking-widest uppercase mb-2">Email (Optional)</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent border-b border-[#2e2a24] text-[#ece6d8] py-2 focus:outline-none focus:border-[#b5a48a] transition-colors font-display text-base tracking-wide" />
                </div>
                <div>
                  <label className="block text-[#6e6a61] text-xs tracking-widest uppercase mb-2">Phone Number</label>
                  <input type="text" readOnly value={formData.phone} className="w-full bg-transparent border-b border-[#2e2a24]/50 text-[#6e6a61] py-2 cursor-not-allowed font-display text-base tracking-wide" />
                </div>

                {message.text && (
                  <div className={`text-sm text-center ${message.type === 'success' ? 'text-[#b5a48a]' : 'text-red-500'}`}>{message.text}</div>
                )}

                <div className="pt-6 space-y-4">
                  <Button type="submit" fullWidth isLoading={isLoading}>Update Profile</Button>
                  <Button type="button" variant="ghost" fullWidth onClick={handleLogout}>Log Out</Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

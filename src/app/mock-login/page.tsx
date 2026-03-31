'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MockLogin() {
  const router = useRouter();
  
  useEffect(() => {
    localStorage.setItem('anybe_guest', JSON.stringify({
      id: 'mock-123',
      first_name: 'Tim',
      last_name: 'Vance',
      phone: '+15555555555',
      dob: '1990-06-15',
      created_at: '2026-03-30T00:00:00Z'
    }));
    document.cookie = 'guest-verified=true; path=/; max-age=86400';
    setTimeout(() => router.push('/events'), 500);
  }, [router]);
  
  return <div className="text-white p-10 font-cinzel">Bypassing auth...</div>;
}

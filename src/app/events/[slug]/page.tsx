'use client';

import React, { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { getStoredGuest } from '@/lib/auth';
import { Button } from '@/components/ui/Button';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  date: string;
  location: string;
  capacity: number | null;
}

export default function EventPage({ params }: PageProps) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Check if guest exists in localStorage
    const guest = getStoredGuest();
    setIsAuthenticated(!!guest);

    async function loadEvent() {
      try {
        const { slug } = await params;
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error || !data) {
          notFound();
        } else {
          setEvent(data);
        }
      } catch (err) {
        console.error(err);
        notFound();
      } finally {
        setIsLoading(false);
      }
    }
    loadEvent();
  }, [params]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-bg-primary flex items-center justify-center">
        <div className="text-[28px] text-silver-dim opacity-50 animate-pulse">✦</div>
      </div>
    );
  }

  if (!event) return null;

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleRegister = async () => {
    setIsRegistering(true);
    setErrorMsg('');
    const guest = getStoredGuest();
    if (!guest) {
      router.push(`/auth?redirect=/events/${event.slug}`);
      return;
    }

    try {
      const res = await fetch(`/api/events/${event.slug}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId: guest.id, eventId: event.id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register');
      alert('Registration successful!');
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <>
      <main className="relative z-10 max-w-[600px] mx-auto px-6 pt-24 pb-16 min-h-[100dvh]">
      <div className="relative border border-border p-10 md:p-12 mb-12 bg-gradient-to-br from-[rgba(26,24,20,0.6)] to-[rgba(14,12,10,0.8)]">
        
        {/* Corner ornaments */}
        <div className="absolute top-2 left-2 w-7 h-7 opacity-40"><svg viewBox="0 0 40 40"><path d="M2 38 C2 18 18 2 38 2" stroke="currentColor" className="text-silver" strokeWidth="1" fill="none" opacity="0.4" /><circle cx="4" cy="36" r="2" fill="currentColor" className="text-silver" opacity="0.3" /><circle cx="36" cy="4" r="2" fill="currentColor" className="text-silver" opacity="0.3" /></svg></div>
        <div className="absolute top-2 right-2 w-7 h-7 opacity-40 scale-x-[-1]"><svg viewBox="0 0 40 40"><path d="M2 38 C2 18 18 2 38 2" stroke="currentColor" className="text-silver" strokeWidth="1" fill="none" opacity="0.4" /><circle cx="4" cy="36" r="2" fill="currentColor" className="text-silver" opacity="0.3" /><circle cx="36" cy="4" r="2" fill="currentColor" className="text-silver" opacity="0.3" /></svg></div>
        <div className="absolute bottom-2 left-2 w-7 h-7 opacity-40 scale-y-[-1]"><svg viewBox="0 0 40 40"><path d="M2 38 C2 18 18 2 38 2" stroke="currentColor" className="text-silver" strokeWidth="1" fill="none" opacity="0.4" /><circle cx="4" cy="36" r="2" fill="currentColor" className="text-silver" opacity="0.3" /><circle cx="36" cy="4" r="2" fill="currentColor" className="text-silver" opacity="0.3" /></svg></div>
        <div className="absolute bottom-2 right-2 w-7 h-7 opacity-40 scale-[-1]"><svg viewBox="0 0 40 40"><path d="M2 38 C2 18 18 2 38 2" stroke="currentColor" className="text-silver" strokeWidth="1" fill="none" opacity="0.4" /><circle cx="4" cy="36" r="2" fill="currentColor" className="text-silver" opacity="0.3" /><circle cx="36" cy="4" r="2" fill="currentColor" className="text-silver" opacity="0.3" /></svg></div>

        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-bg-deep px-3 text-[11px] tracking-[4px] text-silver-dim opacity-60">·  ✦  ·</div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-bg-deep px-3 text-[11px] tracking-[4px] text-silver-dim opacity-60">·  ✦  ·</div>

        <div className="font-display text-[10px] tracking-[5px] uppercase text-silver-dim text-center mb-6">Anybe Event</div>
        <h1 className="font-decorative text-[32px] md:text-[38px] font-normal text-cream text-center tracking-[2px] mb-4">{event.title}</h1>

        {event.description && (
          <p className="text-[17px] text-silver leading-relaxed text-center mb-6 max-w-[480px] mx-auto">{event.description}</p>
        )}

        <div className="grid grid-cols-2 gap-6 max-w-[400px] mx-auto mb-8">
          <div className="text-center">
            <div className="text-[9px] tracking-[3px] uppercase text-silver-dim mb-1.5">Date</div>
            <div className="font-display text-[15px] text-cream tracking-wide">{formattedDate}</div>
          </div>
          <div className="text-center">
            <div className="text-[9px] tracking-[3px] uppercase text-silver-dim mb-1.5">Location</div>
            <div className="font-display text-[15px] text-cream tracking-wide">{event.location}</div>
          </div>
          {event.capacity && (
            <div className="text-center col-span-2">
              <div className="text-[9px] tracking-[3px] uppercase text-silver-dim mb-1.5">Capacity</div>
              <div className="font-display text-[15px] text-cream tracking-wide">{event.capacity} Guests</div>
            </div>
          )}
        </div>

        {errorMsg && <div className="text-red-500 text-sm text-center mb-4">{errorMsg}</div>}

        <div className="text-center">
          {isAuthenticated ? (
            <Button onClick={handleRegister} isLoading={isRegistering}>
              Register Now
            </Button>
          ) : (
            <Button onClick={() => router.push(`/auth?redirect=/events/${event.slug}`)}>
              Sign In to Register
            </Button>
          )}
          <p className="text-[13px] text-silver-dim italic mt-3.5">
            <Link href="/" className="text-silver-dim hover:text-gold underline">Back to Home</Link>
          </p>
        </div>
      </div>
    </main>
    </>
  );
}
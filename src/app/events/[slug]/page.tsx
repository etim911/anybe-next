'use client';

import React, { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { getStoredGuest } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { formatEventDate, formatEventRelative } from '@/lib/dateUtils';
import { motion } from 'framer-motion';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface Role {
  id: string;
  name: string;
  description: string;
}

interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string | null;
  perks: string[] | null;
  quantity_available: number | null;
}

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  date: string;
  location: string;
  capacity: number | null;
  synopsis?: string;
  image_url?: string;
  roles?: Role[];
  ticket_tiers?: TicketTier[];
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
          .select('*, roles(*), ticket_tiers(*)')
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

  const formattedDate = formatEventDate(event.date);
  const relativeDate = formatEventRelative(event.date);

const totalRemaining = event.ticket_tiers && event.ticket_tiers.length > 0
    ? event.ticket_tiers.reduce((sum, tier) => sum + (tier.quantity_available || 0), 0)
    : event.capacity || 0;
  const isSoldOut = totalRemaining === 0;

  const totalCapacity = event.capacity || Math.max(totalRemaining, 1);
  const fillPercentage = Math.max(0, Math.min(100, ((totalCapacity - totalRemaining) / totalCapacity) * 100));


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
      {event.image_url && (
        <div className="absolute top-0 left-0 w-full h-[80dvh] z-0 pointer-events-none">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${event.image_url})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-[#0c0b0a]" />
        </div>
      )}
      <main className="relative z-10 max-w-[600px] mx-auto px-6 pt-24 pb-16 min-h-[100dvh]">
      <div className="relative backdrop-blur-md bg-black/40 border border-white/10 p-10 md:p-12 mb-12">
        
        {/* Corner ornaments */}
        <div className="absolute top-2 left-2 w-7 h-7 opacity-40"><svg viewBox="0 0 40 40"><path d="M2 38 C2 18 18 2 38 2" stroke="currentColor" className="text-silver" strokeWidth="1" fill="none" opacity="0.4" /><circle cx="4" cy="36" r="2" fill="currentColor" className="text-silver" opacity="0.3" /><circle cx="36" cy="4" r="2" fill="currentColor" className="text-silver" opacity="0.3" /></svg></div>
        <div className="absolute top-2 right-2 w-7 h-7 opacity-40 scale-x-[-1]"><svg viewBox="0 0 40 40"><path d="M2 38 C2 18 18 2 38 2" stroke="currentColor" className="text-silver" strokeWidth="1" fill="none" opacity="0.4" /><circle cx="4" cy="36" r="2" fill="currentColor" className="text-silver" opacity="0.3" /><circle cx="36" cy="4" r="2" fill="currentColor" className="text-silver" opacity="0.3" /></svg></div>
        <div className="absolute bottom-2 left-2 w-7 h-7 opacity-40 scale-y-[-1]"><svg viewBox="0 0 40 40"><path d="M2 38 C2 18 18 2 38 2" stroke="currentColor" className="text-silver" strokeWidth="1" fill="none" opacity="0.4" /><circle cx="4" cy="36" r="2" fill="currentColor" className="text-silver" opacity="0.3" /><circle cx="36" cy="4" r="2" fill="currentColor" className="text-silver" opacity="0.3" /></svg></div>
        <div className="absolute bottom-2 right-2 w-7 h-7 opacity-40 scale-[-1]"><svg viewBox="0 0 40 40"><path d="M2 38 C2 18 18 2 38 2" stroke="currentColor" className="text-silver" strokeWidth="1" fill="none" opacity="0.4" /><circle cx="4" cy="36" r="2" fill="currentColor" className="text-silver" opacity="0.3" /><circle cx="36" cy="4" r="2" fill="currentColor" className="text-silver" opacity="0.3" /></svg></div>

        <div className="absolute -top-2 left-1/2 -translate-x-1/2 backdrop-blur-sm bg-black/40 rounded-full border border-white/5 px-3 text-sm tracking-widest text-silver-dim opacity-60">·  ✦  ·</div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 backdrop-blur-sm bg-black/40 rounded-full border border-white/5 px-3 text-sm tracking-widest text-silver-dim opacity-60">·  ✦  ·</div>

        <div className="font-display text-xs tracking-widest uppercase text-silver-dim text-center mb-6">Anybe Event</div>
        <h1 className="font-decorative text-[32px] md:text-[38px] font-normal text-cream text-center tracking-widest mb-4">{event.title}</h1>

        {event.synopsis ? (
          <div className="mb-8 max-w-[480px] mx-auto">
            <h3 className="font-display text-sm text-gold mb-2 uppercase tracking-widest text-center">AI Synopsis</h3>
            <p className="text-[16px] text-silver leading-[1.8] text-center italic">{event.synopsis}</p>
          </div>
        ) : event.description ? (
          <p className="text-[17px] text-silver leading-[1.8] text-center mb-6 max-w-[480px] mx-auto">{event.description}</p>
        ) : null}

        <div className="grid grid-cols-2 gap-6 max-w-[400px] mx-auto mb-8">
          <div className="text-center">
            <div className="text-xs tracking-widest uppercase text-silver-dim mb-1.5 flex items-center justify-center gap-2">
              <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Date
            </div>
            <div className="font-display text-sm text-cream tracking-wide">
              {formattedDate}
              {relativeDate && (
                <div className="text-gold mt-1 text-xs">{relativeDate}</div>
              )}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs tracking-widest uppercase text-silver-dim mb-1.5 flex items-center justify-center gap-2">
              <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Location
            </div>
            <div className="font-display text-sm text-cream tracking-wide">{event.location}</div>
          </div>
          {event.capacity && (
            <div className="text-center col-span-2">
              <div className="text-xs tracking-widest uppercase text-silver-dim mb-1.5 flex items-center justify-center gap-2">
                <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
                Capacity
              </div>
              <div className="font-display text-sm text-cream tracking-wide">{event.capacity} Guests</div>
            </div>
          )}
        </div>

        {event.ticket_tiers && event.ticket_tiers.length > 0 && (
          <div className="mb-8 max-w-[480px] mx-auto">
            <h3 className="font-display text-sm text-gold mb-4 uppercase tracking-widest text-center">Ticket Tiers</h3>
            <div className="space-y-4">
              {event.ticket_tiers.map(tier => (
                <div key={tier.id} className="relative p-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                  <div className="relative z-10 flex justify-between items-start mb-3">
                    <div>
                      <div className="font-display text-lg text-cream tracking-wide">{tier.name}</div>
                      {tier.description && <div className="text-sm text-silver mt-1">{tier.description}</div>}
                    </div>
                    <div className="font-display text-xl text-gold">${tier.price}</div>
                  </div>
                  {tier.perks && tier.perks.length > 0 && (
                    <ul className="relative z-10 space-y-2 mt-4">
                      {tier.perks.map((perk, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-silver-dim">
                          <span className="text-gold mt-0.5">✦</span>
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {tier.quantity_available !== null && (
                    <div className="relative z-10 mt-4">
                      <div className="text-xs text-silver-dim uppercase tracking-widest mb-2">
                        Only {tier.quantity_available} spots left
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5 relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${fillPercentage}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold/50 to-gold rounded-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {event.roles && event.roles.length > 0 && (
          <div className="mb-8 max-w-[480px] mx-auto">
            <h3 className="font-display text-sm text-gold mb-4 uppercase tracking-widest text-center">Available Roles</h3>
            <div className="space-y-4">
              {event.roles.map(role => (
                <div key={role.id} className="p-4 border border-white/10 bg-white/5 rounded-sm">
                  <div className="font-display text-md text-cream mb-1">{role.name}</div>
                  <div className="text-sm text-silver-dim">{role.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {errorMsg && <div className="text-red-500 text-sm text-center mb-4">{errorMsg}</div>}

        <div className="text-center">
          {isSoldOut ? (
            <button disabled className="bg-silver-dim/20 text-silver-dim cursor-not-allowed px-8 py-4 font-display text-base tracking-[0.2em] uppercase rounded-sm inline-flex items-center justify-center transition-none w-auto max-w-full">
              SOLD OUT
            </button>
          ) : isAuthenticated ? (
            <Button onClick={handleRegister} isLoading={isRegistering} className="tracking-[0.08em]">SECURE MY SPOT</Button>
          ) : (
            <Button onClick={() => router.push(`/auth?redirect=/events/${event.slug}`)} className="tracking-[0.08em]">SIGN IN TO SECURE SPOT</Button>
          )}
          <p className="text-sm text-silver-dim italic mt-3.5">
            <Link href="/" className="text-silver-dim hover:text-gold underline">Back to Home</Link>
          </p>
        </div>
      </div>
    </main>
    </>
  );
}

import React from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const revalidate = 0; // Disable static rendering for authenticated pages

export default async function EventsDashboard() {
  // Fetch events from Supabase
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });

  // Temporary mock user profile
  const user = { phone: '+1 555 019 2838', name: 'Initiate' };
  
  // For demo, we just treat the first event as upcoming and rest as past
  const upcomingEvents = events?.slice(0, 1) || [];
  const pastEvents = events?.slice(1) || [];

  return (
    <main className="relative z-10 max-w-[600px] mx-auto px-6 pt-24 pb-16 min-h-screen">
      
      {/* ─── Profile ─── */}
      <div className="flex flex-col items-center mb-12 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-bg-tertiary to-bg-secondary border border-gold/30 flex items-center justify-center mb-4">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-gold/80" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <h1 className="font-display text-xl text-cream tracking-wider mb-1">{user.name}</h1>
        <p className="font-serif text-sm text-text-muted tracking-widest">{user.phone}</p>
        
        <form action="/auth/signout" method="post" className="mt-6">
          <button className="text-[10px] font-display uppercase tracking-[3px] text-text-muted hover:text-gold transition-colors pb-1 border-b border-text-muted/30 hover:border-gold/50">
            Sign Out
          </button>
        </form>
      </div>

      <div className="w-12 h-[1px] bg-gold/30 mx-auto mb-12"></div>

      {/* ─── Upcoming Events ─── */}
      <section className="mb-14 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h2 className="font-display text-[11px] tracking-[4px] uppercase text-text-muted text-center mb-6">My Upcoming Crossings</h2>
        
        {upcomingEvents.length > 0 ? (
          <div className="grid gap-6">
            {upcomingEvents.map((event) => (
              <Link href={`/events/${event.slug}`} key={event.id} className="block group">
                <div className="relative border border-bg-tertiary bg-gradient-to-br from-bg-tertiary/60 to-bg-secondary/80 p-6 transition-all duration-300 group-hover:border-gold/30 group-hover:-translate-y-1 group-hover:shadow-[0_4px_24px_rgba(181,164,138,0.05)]">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-display text-lg text-cream tracking-wider mb-1 group-hover:text-gold transition-colors">{event.title}</h3>
                      <p className="text-xs font-display tracking-widest text-text-muted uppercase">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                    <div className="px-3 py-1 border border-gold/30 text-[9px] font-display uppercase tracking-[2px] text-gold">
                      Registered
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-text-secondary">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2 opacity-60" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {event.location}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-bg-tertiary/50 bg-bg-secondary/30">
            <p className="text-sm italic text-text-muted">You have no upcoming crossings.</p>
            <Link href="/" className="inline-block mt-4 text-[10px] font-display uppercase tracking-[3px] text-gold hover:text-gold-light">
              View Next Event
            </Link>
          </div>
        )}
      </section>

      {/* ─── Past Events ─── */}
      <section className="mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <h2 className="font-display text-[11px] tracking-[4px] uppercase text-text-muted text-center mb-6">Past Crossings</h2>
        
        {pastEvents.length > 0 ? (
          <div className="grid gap-4">
            {pastEvents.map((event) => (
              <div key={event.id} className="relative border border-bg-tertiary/50 bg-bg-secondary/40 p-5 opacity-70 hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-display text-base text-cream tracking-wider mb-1">{event.title}</h3>
                    <p className="text-[10px] font-display tracking-widest text-text-muted uppercase">{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                  <Link href={`/events/${event.slug}`} className="text-[10px] font-display uppercase tracking-[2px] text-text-muted hover:text-gold transition-colors pb-0.5 border-b border-text-muted/30 hover:border-gold/50">
                    View Echoes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm italic text-text-muted">The past is silent.</p>
          </div>
        )}
      </section>

    </main>
  );
}
import React from 'react';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 60; // ISR cache every 60 seconds

export async function generateStaticParams() {
  const { data: events } = await supabase.from('events').select('slug');
  return events?.map((event) => ({
    slug: event.slug,
  })) || [];
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!event) {
    return { title: 'Event Not Found | Anybe Night' };
  }

  return {
    title: `${event.title} | Anybe Night`,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      type: 'website',
    },
  };
}

export default async function EventPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!event) {
    notFound();
  }

  return (
    <main className="relative z-10 max-w-[600px] mx-auto px-6 pt-24 pb-16 min-h-screen">
      
      {/* ─── TITLE & HERO ─── */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="font-decorative text-[32px] md:text-[40px] font-normal text-cream tracking-[2px] mb-4">
          {event.title}
        </h1>
        <div className="flex justify-center items-center gap-3 text-[10px] tracking-[4px] uppercase text-text-muted mb-8">
          <span>{new Date(event.date).toLocaleDateString()}</span>
          <span className="opacity-50">•</span>
          <span>{event.location}</span>
        </div>
      </div>

      {/* ─── EVENT DETAILS CARD ─── */}
      <div className="relative border border-bg-tertiary p-8 mb-12 bg-gradient-to-br from-bg-tertiary/60 to-bg-secondary/80 animate-fade-in delay-200">
        
        {/* Corner flourishes */}
        <div className="absolute w-7 h-7 opacity-40 top-2 left-2">
          <svg viewBox="0 0 40 40"><path d="M2 38 C2 18 18 2 38 2" stroke="#c4bfb3" strokeWidth="1" fill="none" opacity="0.4"/><circle cx="4" cy="36" r="2" fill="#c4bfb3" opacity="0.3"/><circle cx="36" cy="4" r="2" fill="#c4bfb3" opacity="0.3"/></svg>
        </div>
        <div className="absolute w-7 h-7 opacity-40 top-2 right-2 scale-x-[-1]">
          <svg viewBox="0 0 40 40"><path d="M2 38 C2 18 18 2 38 2" stroke="#c4bfb3" strokeWidth="1" fill="none" opacity="0.4"/><circle cx="4" cy="36" r="2" fill="#c4bfb3" opacity="0.3"/><circle cx="36" cy="4" r="2" fill="#c4bfb3" opacity="0.3"/></svg>
        </div>
        <div className="absolute w-7 h-7 opacity-40 bottom-2 left-2 scale-y-[-1]">
          <svg viewBox="0 0 40 40"><path d="M2 38 C2 18 18 2 38 2" stroke="#c4bfb3" strokeWidth="1" fill="none" opacity="0.4"/><circle cx="4" cy="36" r="2" fill="#c4bfb3" opacity="0.3"/><circle cx="36" cy="4" r="2" fill="#c4bfb3" opacity="0.3"/></svg>
        </div>
        <div className="absolute w-7 h-7 opacity-40 bottom-2 right-2 scale-[-1]">
          <svg viewBox="0 0 40 40"><path d="M2 38 C2 18 18 2 38 2" stroke="#c4bfb3" strokeWidth="1" fill="none" opacity="0.4"/><circle cx="4" cy="36" r="2" fill="#c4bfb3" opacity="0.3"/><circle cx="36" cy="4" r="2" fill="#c4bfb3" opacity="0.3"/></svg>
        </div>

        <div className="text-center font-display text-[13px] tracking-[4px] text-gold uppercase mb-8 pb-4 border-b border-gold/20">
          The Manifesto
        </div>
        
        <div className="text-lg italic text-text-secondary leading-relaxed text-center mb-10 whitespace-pre-wrap">
          {event.description || "The crossing is near. Only the initiated may proceed."}
        </div>

        <div className="grid grid-cols-2 gap-6 max-w-[320px] mx-auto mb-8 border-t border-bg-tertiary pt-6">
          <div className="text-center">
            <div className="text-[9px] tracking-[3px] uppercase text-[#6e6a61] mb-1.5">Capacity</div>
            <div className="font-display text-[15px] text-cream tracking-[0.5px]">{event.capacity || 100}</div>
          </div>
          <div className="text-center">
            <div className="text-[9px] tracking-[3px] uppercase text-[#6e6a61] mb-1.5">Price</div>
            <div className="font-display text-[15px] text-gold tracking-[0.5px]">${event.price || 'TBA'}</div>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link href="/auth" className="inline-block bg-transparent border border-gold text-gold font-display text-[12px] tracking-[4px] uppercase py-4 px-10 transition-all duration-400 hover:bg-gold/10 hover:-translate-y-[1px]">
            Join the Crossing
          </Link>
          <p className="text-[11px] text-[#6e6a61] italic mt-3">Authentication Required</p>
        </div>
      </div>
      
    </main>
  );
}
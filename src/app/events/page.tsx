'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { EventCard } from '@/components/events/EventCard';

interface Event {
  id: string;
  title: string;
  slug: string;
  date: string;
  location: string;
  created_at: string;
}

export default function EventsDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });

        setEvents(data || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-bg-primary flex items-center justify-center">
        <div className="text-[28px] text-silver-dim opacity-50 animate-pulse">✦</div>
      </div>
    );
  }

  return (
    <main className="relative z-10 max-w-[600px] mx-auto px-6 pt-24 pb-16 min-h-[100dvh]">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="font-display text-xs tracking-widest uppercase text-silver-dim mb-2">Your Crossings</div>
        <div className="font-decorative text-[28px] font-normal text-cream tracking-widest drop-shadow-sm">Events</div>
        <div className="text-center text-silver-dim text-sm mt-3 tracking-widest opacity-60">- ✦ -</div>
      </motion.div>

      <h2 className="font-display text-xl text-gold mb-4">Future Crossings</h2>
      <div className="space-y-8">
        {events.map((event) => (
          <EventCard 
            key={event.id}
            slug={event.slug}
            title={event.title}
            date={event.date}
            location={event.location}
            status="upcoming"
          />
        ))}
        {events.length === 0 && (
          <div className="text-center text-text-muted italic">No upcoming events.</div>
        )}
      </div>

      <h2 className="font-display text-xl text-gold mt-12 mb-4">Past Crossings</h2>
      <div className="space-y-8">
        <EventCard 
          key="mock-past-1"
          slug="the-library"
          title="The Library"
          date="2024-05-18T20:00:00Z"
          location="Secret Location"
          status="past"
        />
      </div>
    </main>
  );
}

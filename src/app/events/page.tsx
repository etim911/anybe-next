'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { EventCard, EventCardSkeleton } from '@/components/events/EventCard';

interface Role {
  id: string;
  name: string;
  description: string;
}

interface Event {
  id: string;
  title: string;
  slug: string;
  date: string;
  location: string;
  created_at: string;
  synopsis?: string;
  image_url?: string;
  roles?: Role[];
}

export default function EventsDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await supabase
          .from('events')
          .select('*, roles(*)')
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

  return (
    <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <EventCardSkeleton key={`skeleton-${i}`} />
          ))
        ) : events.length > 0 ? (
          events.map((event) => (
            <EventCard
              key={event.id}
              slug={event.slug}
              title={event.title}
              date={event.date}
              location={event.location}
              status="upcoming"
              imageUrl={event.image_url}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-text-muted italic">No upcoming events.</div>
        )}
      </div>

      <h2 className="font-display text-xl text-gold mt-12 mb-4">Past Crossings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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

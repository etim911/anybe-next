import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';

export interface EventCardProps {
  slug: string;
  title: string;
  date: string;
  location: string;
  capacity?: number;
  price?: string;
  status: 'upcoming' | 'sold-out' | 'past';
  imageUrl?: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  slug,
  title,
  date,
  location,
  capacity,
  price,
  status,
  imageUrl,
}) => {
  const statusColors = {
    'upcoming': 'text-gold border-gold/50 bg-gold/10',
    'sold-out': 'text-red-400 border-red-500/30 bg-red-900/20',
    'past': 'text-cream/50 border-cream/20 bg-cream/5',
  };

  const statusLabels = {
    'upcoming': 'Available',
    'sold-out': 'Sold Out',
    'past': 'Concluded',
  };

  return (
    <Link href={`/events/${slug}`} className="block">
      <Card variant="event" className="h-full flex flex-col relative overflow-hidden group">
        
        {/* Optional Event Image / Background Header */}
        {imageUrl && (
          <div className="h-48 w-full bg-[#1c1a18] relative overflow-hidden border-b border-gold/10">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141210] to-transparent pointer-events-none" />
          </div>
        )}

        <div className={`p-6 flex-grow flex flex-col ${!imageUrl ? 'pt-8' : ''}`}>
          <div className="flex justify-between items-start mb-4">
            <span className={`text-[10px] font-display uppercase tracking-widest px-2 py-1 border ${statusColors[status]}`}>
              {statusLabels[status]}
            </span>
            {price && status === 'upcoming' && (
              <span className="font-display text-sm text-gold tracking-wider">{price}</span>
            )}
          </div>
          
          <h3 className="font-display text-xl md:text-2xl text-cream mb-2 group-hover:text-gold transition-colors duration-300">
            {title}
          </h3>
          
          <div className="font-cormorant text-cream/70 space-y-1 mb-6 flex-grow">
            <p className="flex items-center">
              <span className="text-gold/50 mr-2">✦</span> {new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
            <p className="flex items-center">
              <span className="text-gold/50 mr-2">✦</span> {location}
            </p>
            {capacity && (
              <p className="flex items-center">
                <span className="text-gold/50 mr-2">✦</span> {capacity} spots
              </p>
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-gold/10 flex justify-between items-center group-hover:border-gold/30 transition-colors">
            <span className="font-display text-xs text-gold tracking-widest uppercase">
              {status === 'upcoming' ? 'Request Invite' : 'View Details'}
            </span>
            <span className="text-gold transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300">
              →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

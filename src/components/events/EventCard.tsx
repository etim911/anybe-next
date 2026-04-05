import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { formatEventDate, formatEventRelative } from '../../lib/dateUtils';

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
    'upcoming': 'text-brand-gold border-brand-gold/50 bg-brand-gold/10',
    'sold-out': 'text-status-error border-status-error/30 bg-status-error/20',
    'past': 'text-brand-cream/50 border-brand-cream/20 bg-brand-cream/5',
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
          <div className="w-full aspect-video bg-bg-tertiary relative overflow-hidden border-b border-brand-gold/10">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary to-transparent pointer-events-none" />
          </div>
        )}

        <div className={`p-4 sm:p-6 flex-grow flex flex-col ${!imageUrl ? 'pt-4 sm:pt-8' : ''}`}>
          <div className="flex justify-between items-start mb-4">
            <span className={`text-xs font-display uppercase tracking-widest px-2 py-1 border ${statusColors[status]}`}>
              {statusLabels[status]}
            </span>
            {price && status === 'upcoming' && (
              <span className="font-display text-sm text-brand-gold tracking-wider">{price}</span>
            )}
          </div>
          
          <h3 className="font-display text-lg sm:text-xl md:text-2xl text-brand-cream mb-2 group-hover:text-brand-gold transition-colors duration-300 line-clamp-2 break-words">
            {title}
          </h3>
          
          <div className="font-serif text-brand-cream/70 space-y-1 mb-4 sm:mb-6 flex-grow">
            <p className="flex items-center">
              <span className="text-brand-gold/50 mr-2">✦</span> 
              <span>
                {formatEventDate(date)}
                {formatEventRelative(date) && (
                  <span className="ml-2 text-brand-gold/70 text-sm italic border-l border-brand-gold/30 pl-2">
                    {formatEventRelative(date)}
                  </span>
                )}
              </span>
            </p>
            <p className="flex items-center">
              <span className="text-brand-gold/50 mr-2">✦</span> {location}
            </p>
            {capacity && capacity > 0 && (
              <div className="inline-flex items-center mt-2">
                <span className="bg-brand-gold/20 px-3 py-1 rounded-full font-display uppercase text-brand-gold text-xs tracking-widest border border-brand-gold/30">
                  Only {capacity} spots left
                </span>
              </div>
            )}
          </div>

          <div className="mt-auto py-3 sm:py-4 border-t border-brand-gold/10 flex justify-between items-center group-hover:border-brand-gold/30 transition-colors">
            <span className="font-display text-xs text-brand-gold tracking-widest uppercase">
              {status === 'upcoming' ? 'Request Invite' : 'View Details'}
            </span>
            <span className="text-brand-gold transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300">
              →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export const EventCardSkeleton = () => (
  <Card variant="event" className="h-full flex flex-col relative overflow-hidden animate-pulse">
    <div className="p-4 sm:p-6 flex-grow flex flex-col pt-4 sm:pt-8">
      <div className="flex justify-between items-start mb-4">
        <div className="w-20 h-6 bg-brand-gold/10 border border-brand-gold/20" />
      </div>
      <div className="w-3/4 h-8 bg-brand-cream/10 mb-2" />
      <div className="space-y-2 mb-4 sm:mb-6 flex-grow">
        <div className="w-1/2 h-5 bg-brand-cream/5" />
        <div className="w-2/3 h-5 bg-brand-cream/5" />
      </div>
      <div className="mt-auto py-3 sm:py-4 border-t border-brand-gold/10">
        <div className="w-24 h-4 bg-brand-gold/10" />
      </div>
    </div>
  </Card>
);

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, MapPin, Gift, Trophy } from 'lucide-react';
import { MOCK_LIVE_CLAIMS } from '../data';
import { LiveClaim } from '../types';

export default function LiveFeed() {
  const [claims, setClaims] = useState<LiveClaim[]>(MOCK_LIVE_CLAIMS);

  useEffect(() => {
    // Periodically add new mock claims from different US locations to keep the feed dynamic
    const firstNames = ['John', 'Emily', 'Robert', 'Megan', 'Daniel', 'Olivia', 'William', 'Sophia', 'James', 'Ava', 'Ethan', 'Isabella'];
    const lastInitials = ['D.', 'S.', 'W.', 'H.', 'M.', 'B.', 'G.', 'K.', 'R.', 'P.'];
    const usCities = [
      'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Dallas, TX', 'Houston, TX',
      'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Orlando, FL',
      'Seattle, WA', 'Denver, CO', 'Boston, MA', 'Detroit, MI', 'Nashville, TN'
    ];
    const offers = [
      '$750 PayPal Gift Card',
      'iPhone 16 Pro Sweepstakes',
      'Retro Arcade Mobile Access',
      'SmartSecure VPN & Guard',
      '$500 Cash App Transfer',
      '$1,000 Walmart Shopping Spree'
    ];

    const interval = setInterval(() => {
      const randomClaim: LiveClaim = {
        id: `claim-${Date.now()}`,
        name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastInitials[Math.floor(Math.random() * lastInitials.length)]}`,
        location: usCities[Math.floor(Math.random() * usCities.length)],
        offerTitle: offers[Math.floor(Math.random() * offers.length)],
        timeAgo: 'Just now',
        avatarSeed: Math.random().toString(),
      };

      setClaims((prevClaims) => {
        // Keep only last 5 claims, add new one to the front
        const formattedPrev = prevClaims.map((c) => {
          if (c.timeAgo === 'Just now') return { ...c, timeAgo: '1 min ago' };
          if (c.timeAgo === '1 min ago') return { ...c, timeAgo: '3 mins ago' };
          if (c.timeAgo === '3 mins ago') return { ...c, timeAgo: '5 mins ago' };
          return { ...c, timeAgo: '10 mins ago' };
        });
        return [randomClaim, ...formattedPrev.slice(0, 4)];
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white text-slate-800 rounded-2xl p-5 shadow-md border border-slate-200 relative overflow-hidden" id="live-feed-widget">
      {/* Decorative ambient light */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Live Claim Feed</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
          <span className="font-bold">High Demand</span>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3 relative min-h-[220px]" id="live-feed-items">
        <AnimatePresence initial={false}>
          {claims.map((claim, idx) => (
            <motion.div
              key={claim.id}
              initial={{ opacity: 0, x: -10, y: -5 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className={`flex items-start gap-3 p-2.5 rounded-xl transition-all border ${
                idx === 0
                  ? 'bg-blue-50/50 border-blue-200 shadow-sm'
                  : 'bg-slate-50/40 border-transparent hover:bg-slate-50'
              }`}
            >
              {/* Avatar Icon */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                idx === 0 ? 'bg-blue-100 border-blue-200 text-blue-600' : 'bg-slate-100 border-slate-200 text-slate-500'
              }`}>
                {claim.offerTitle.includes('Gift Card') || claim.offerTitle.includes('Walmart') || claim.offerTitle.includes('Cash App') ? (
                  <Gift className="w-5 h-5 text-yellow-600 fill-yellow-100" />
                ) : (
                  <Trophy className="w-5 h-5 text-blue-500" />
                )}
              </div>

              {/* Text Context */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-1">
                  <span className="text-xs font-bold text-slate-800 truncate">{claim.name}</span>
                  <span className="text-[10px] font-bold text-slate-400 shrink-0">{claim.timeAgo}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-red-500" />
                  <span className="text-[10px] font-bold text-slate-500 truncate">{claim.location}</span>
                </div>
                <p className="text-xs font-semibold text-slate-700 mt-1 truncate" id={`live-claim-item-offer-${claim.id}`}>
                  Claimed <span className="text-blue-600 font-bold">{claim.offerTitle}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Mini CTA footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 text-center">
        <p className="text-[10px] text-slate-400 font-bold">
          Average reward transfer time: <span className="text-blue-600">~12 minutes</span>
        </p>
      </div>
    </div>
  );
}

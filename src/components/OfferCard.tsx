import React from 'react';
import { motion } from 'motion/react';
import { Wallet, Mail, Smartphone, Download, Gift, Star, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { Offer } from '../types';

interface OfferCardProps {
  key?: string;
  offer: Offer;
  onSelect: () => void;
  isCompleted: boolean;
}

export default function OfferCard({ offer, onSelect, isCompleted }: OfferCardProps) {
  // Map icons
  const iconMap: Record<string, React.ComponentType<any>> = {
    Wallet: Wallet,
    Mail: Mail,
    Smartphone: Smartphone,
    Download: Download,
    Gift: Gift,
  };

  const IconComponent = iconMap[offer.icon] || Gift;

  // Class modifiers based on offer type for branding matching
  const cardBorderColor = offer.featured ? 'border-blue-300 bg-blue-50/10' : 'border-slate-200 bg-white';
  
  const badgeColor = {
    'Gift Card': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Email Submit': 'bg-blue-100 text-blue-600 border-blue-200',
    'Pin Submit': 'bg-red-100 text-red-600 border-red-200',
    'App Install': 'bg-green-100 text-green-600 border-green-200',
  }[offer.category] || 'bg-slate-100 text-slate-600 border-slate-200';

  // Button styles corresponding to the design specification
  const buttonStyle = {
    'Gift Card': 'bg-yellow-400 hover:bg-yellow-300 text-blue-900 shadow-md shadow-yellow-400/10',
    'Email Submit': 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/10',
    'Pin Submit': 'bg-slate-900 hover:bg-slate-800 text-white shadow-md',
    'App Install': 'border-2 border-slate-900 text-slate-900 hover:bg-slate-50 bg-transparent',
  }[offer.category] || 'bg-slate-900 text-white hover:bg-slate-800';

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 24px -10px rgba(15, 23, 42, 0.08)' }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl border p-6 transition-all flex flex-col justify-between relative overflow-hidden ${cardBorderColor}`}
      id={`offer-card-${offer.id}`}
    >
      {/* Sparkle decorative effect for featured */}
      {offer.featured && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-bl-full flex items-center justify-center">
          <Star className="w-3.5 h-3.5 text-blue-600 fill-blue-600 absolute top-3.5 right-3.5 animate-pulse" />
        </div>
      )}

      <div>
        {/* Category Badge & Difficulty */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-bold border ${badgeColor} uppercase tracking-widest`}>
            {offer.category}
          </span>
          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-md">
            Difficulty: <strong className="text-slate-600 font-bold">{offer.difficulty}</strong>
          </span>
        </div>

        {/* Title & Icon Header */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
            offer.category === 'Gift Card' ? 'bg-yellow-50 border-yellow-100 text-yellow-600' :
            offer.category === 'Email Submit' ? 'bg-blue-50 border-blue-100 text-blue-600' :
            offer.category === 'Pin Submit' ? 'bg-red-50 border-red-100 text-red-600' :
            'bg-green-50 border-green-100 text-green-600'
          }`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors text-lg tracking-tight">
              {offer.title}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(offer.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-slate-500">{offer.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-500 leading-relaxed font-medium mb-5 min-h-[48px]">
          {offer.description}
        </p>
      </div>

      <div>
        {/* Expected Time & Reward Details */}
        <div className="flex items-center justify-between border-t border-dashed border-slate-100 pt-4 mb-4">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Est: {offer.estTime}</span>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Rewards Value</p>
            <p className="text-sm font-extrabold text-slate-700">{offer.rewardValue || 'Claimable'}</p>
          </div>
        </div>

        {/* Action Button */}
        {isCompleted ? (
          <div className="w-full py-3.5 px-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center gap-2 text-xs font-bold shadow-inner">
            <CheckCircle className="w-4 h-4 fill-emerald-100 text-emerald-600" />
            Offer Completed
          </div>
        ) : (
          <button
            id={`claim-btn-${offer.id}`}
            onClick={onSelect}
            className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-98 cursor-pointer ${buttonStyle}`}
          >
            <span>Claim Offer</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

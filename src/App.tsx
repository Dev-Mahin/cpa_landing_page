import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flag, Compass, HelpCircle, Star, Award, ShieldCheck, CheckCircle2, Zap, RefreshCw, AlertCircle, Heart, Users } from 'lucide-react';
import { USA_OFFERS } from './data';
import { Offer, OfferCategory } from './types';
import QuizStep from './components/QuizStep';
import OfferCard from './components/OfferCard';
import LiveFeed from './components/LiveFeed';
import Reviews from './components/Reviews';
import OfferModal from './components/OfferModal';

export default function App() {
  const [isQualified, setIsQualified] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<OfferCategory | 'All'>('All');
  const [completedOfferIds, setCompletedOfferIds] = useState<string[]>([]);
  const [activeModalOffer, setActiveModalOffer] = useState<Offer | null>(null);
  const [slotsLeft, setSlotsLeft] = useState(14);
  const [activeParticipants, setActiveParticipants] = useState(452);

  // Decaying slot effect for scarcity trigger
  useEffect(() => {
    const slotTimer = setInterval(() => {
      setSlotsLeft((prev) => {
        if (prev > 3) {
          return prev - 1;
        }
        return prev;
      });
    }, 45000);

    const participantTimer = setInterval(() => {
      setActiveParticipants((prev) => prev + Math.floor(Math.random() * 7) - 3);
    }, 8000);

    return () => {
      clearInterval(slotTimer);
      clearInterval(participantTimer);
    };
  }, []);

  const handleQuizComplete = (answers: Record<string, string>) => {
    // Save state, mark as qualified, unlock Offers Hub
    setIsQualified(true);
  };

  const handleOfferComplete = (offerId: string) => {
    if (!completedOfferIds.includes(offerId)) {
      setCompletedOfferIds((prev) => [...prev, offerId]);
    }
  };

  const filteredOffers = selectedCategory === 'All'
    ? USA_OFFERS
    : USA_OFFERS.filter((off) => off.category === selectedCategory);

  const totalPointsEarned = completedOfferIds.reduce((acc, currentId) => {
    const match = USA_OFFERS.find((off) => off.id === currentId);
    return acc + (match?.payoutPoints || 0);
  }, 0);

  const resetAllProgress = () => {
    setCompletedOfferIds([]);
    setIsQualified(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900" id="main-landing-app">
      {/* Top Notification Urgency Ticker */}
      <div className="bg-gradient-to-r from-red-600 via-blue-600 to-indigo-700 text-white text-center py-2 px-4 text-xs font-bold flex items-center justify-center gap-2 tracking-wide" id="ticker-banner">
        <Flag className="w-3.5 h-3.5 animate-pulse" />
        <span>USA NATIONAL CONSUMER CAMPAIGN 2026: FREE PREMIUM OFFERS AVAILABLE IN YOUR ZIP CODE</span>
        <span className="hidden md:inline-block px-1.5 py-0.5 rounded bg-white text-blue-800 text-[9px] font-black uppercase">Active</span>
      </div>

      {/* Navigation Navbar from Sleek Interface */}
      <header className="flex items-center justify-between px-6 md:px-10 py-5 bg-white border-b border-slate-200 shrink-0 shadow-sm" id="sleek-nav-header">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <span className="text-xl font-extrabold text-slate-800 tracking-tight">REWARD<span className="text-blue-600">PORTAL</span> USA</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <a href="#offers-grid" className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Browse Offers</a>
          <a href="#live-feed-widget" className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Live Activity</a>
          <a href="#reviews-section" className="text-sm font-bold text-blue-600">How it Works</a>
        </nav>
        <div className="flex items-center gap-4">
          <div className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full border border-emerald-200 uppercase tracking-wide">
            {activeParticipants} Active Online
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Header Branding section */}
        <header className="flex flex-col items-center text-center mb-8 md:mb-12" id="portal-header">
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 flex items-center gap-1">
              <Star className="w-3 h-3 fill-blue-600 text-blue-600" />
              US Consumer Board Verified
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl">
            Claim Your Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600">Gift Cards & Digital Rewards</span>
          </h1>

          <p className="text-sm md:text-base text-slate-500 max-w-xl mt-3 font-bold leading-relaxed">
            Take part in official USA consumer testing surveys, mobile verification plans, and fast-track app trials to receive instant reward credits.
          </p>

          {/* Social validation badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>CCPA Compliant</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>{activeParticipants} users active online</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-red-600 font-black bg-red-50 border border-red-200 px-3.5 py-2 rounded-xl shadow-sm uppercase tracking-wide">
              <AlertCircle className="w-4 h-4" />
              <span>Only {slotsLeft} slots left today</span>
            </div>
          </div>
        </header>

        {/* Dynamic Section Handler: Pre-qualification Quiz OR Main Hub */}
        <AnimatePresence mode="wait">
          {!isQualified ? (
            /* ================= STAGE 1: PRE-QUALIFICATION SURVEY ================= */
            <motion.section
              key="qualification-quiz"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="py-6"
              id="qualification-survey-stage"
            >
              <QuizStep onComplete={handleQuizComplete} />
            </motion.section>
          ) : (
            /* ================= STAGE 2: OFFERS PORTAL HUB ================= */
            <motion.section
              key="offers-hub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              id="offers-portal-stage"
            >
              {/* Left Column: Offers Panel & General sections */}
              <div className="lg:col-span-8 space-y-8" id="left-portal-layout">
                {/* Progress Stats Bar */}
                <div className="bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 rounded-2xl p-6 md:p-8 shadow-xl text-white relative overflow-hidden border border-slate-800">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                    <div>
                      <h3 className="text-lg font-black flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-400" />
                        USA Rewards Progress Meter
                      </h3>
                      <p className="text-xs text-blue-100 font-medium mt-1">
                        Complete any <strong className="text-yellow-400">2 offers</strong> from the catalog to activate grand prize payout priority.
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-blue-300 font-extrabold uppercase tracking-wider block">Estimated Payout</span>
                      <span className="text-2xl font-black text-yellow-400">+{totalPointsEarned} pts locked</span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-blue-100">
                      <span>Status: {completedOfferIds.length === 0 ? 'Getting Started' : completedOfferIds.length === 1 ? '50% Qualified' : '100% Fully Eligible!'}</span>
                      <span>{completedOfferIds.length} / 2 Offers Done</span>
                    </div>
                    <div className="w-full bg-slate-950/80 h-3.5 rounded-full overflow-hidden border border-slate-800">
                      <motion.div
                        className="bg-gradient-to-r from-yellow-400 to-emerald-400 h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((completedOfferIds.length / 2) * 100, 100)}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Completion milestone congrats */}
                  {completedOfferIds.length >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-5 p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center gap-2.5 text-xs text-emerald-200 font-bold"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Congratulations! You completed the qualification. Our team will verify and transfer your codes!</span>
                    </motion.div>
                  )}
                </div>

                {/* Offer Category Tabs Filter */}
                <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-slate-200 flex flex-wrap gap-1.5" id="category-tabs">
                  {(['All', 'Gift Card', 'Email Submit', 'Pin Submit', 'App Install'] as const).map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        id={`cat-tab-${cat.replace(/\s+/g, '-')}`}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {cat}s
                      </button>
                    );
                  })}
                </div>

                {/* Offers Listing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="offers-grid">
                  {filteredOffers.map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      isCompleted={completedOfferIds.includes(offer.id)}
                      onSelect={() => setActiveModalOffer(offer)}
                    />
                  ))}
                </div>

                {/* FAQ section for conversion boost */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg mt-8" id="faq-section">
                  <h3 className="text-lg font-black text-slate-950 mb-6 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                    Frequently Asked Questions
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">1. Is this rewards program secure?</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-bold">
                        Yes, absolutely. We use bank-level encryption standards. No credit card is required, and your personal survey responses are CCPA-compliant.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">2. How are the gift cards delivered?</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-bold">
                        Gift cards like PayPal and Cash App are sent directly via verified digital code email, with options for wire deposit depending on the offer type.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">3. Can I complete multiple offers?</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-bold">
                        Yes, completing multiple offers increases your payout rating. We recommend completing at least two offers for maximum validation.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">4. How long does verification take?</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-bold">
                        Verification runs instantly after completion. Once confirmed, digital voucher assets are issued to your primary email address within 2-12 hours.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Verified Testimonials */}
                <Reviews />
              </div>

              {/* Right Column: Sidebar Tickers / Security Seals */}
              <div className="lg:col-span-4 space-y-6" id="right-portal-layout">
                {/* Rolling Claims Feed */}
                <LiveFeed />

                {/* Verification Check list Widget */}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200" id="checklist-widget">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center justify-between">
                    <span>Status Checklist</span>
                    <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded font-black uppercase tracking-wider">Online</span>
                  </h4>

                  <div className="space-y-3.5">
                    <div className="flex items-center gap-3 text-xs">
                      <div className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                        ✓
                      </div>
                      <span className="font-bold text-slate-700">USA Location Verified</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                        ✓
                      </div>
                      <span className="font-bold text-slate-700">Pre-qualification Quiz Completed</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 text-xs border ${
                        completedOfferIds.length >= 1 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-blue-100 text-blue-700 border-blue-200 font-bold'
                      }`}>
                        {completedOfferIds.length >= 1 ? '✓' : '3'}
                      </div>
                      <span className={`font-bold ${completedOfferIds.length >= 1 ? 'text-slate-700' : 'text-slate-500'}`}>
                        Complete 1st Offer: {completedOfferIds.length >= 1 ? 'Completed' : 'Pending'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 text-xs border ${
                        completedOfferIds.length >= 2 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200 font-bold'
                      }`}>
                        {completedOfferIds.length >= 2 ? '✓' : '4'}
                      </div>
                      <span className={`font-bold ${completedOfferIds.length >= 2 ? 'text-slate-700' : 'text-slate-400'}`}>
                        Complete 2nd Offer: {completedOfferIds.length >= 2 ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Disclaimer / Trust Seal Info */}
                <div className="bg-slate-900 text-slate-400 rounded-2xl p-6 space-y-4 border border-slate-800 text-[10px]" id="trust-seal-widget">
                  <div className="flex items-center gap-2 text-white font-black uppercase tracking-wider border-b border-slate-800 pb-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Secure Consumer Seals</span>
                  </div>

                  <p className="leading-relaxed font-bold">
                    This website is an independent rewards community directory. Any third-party trademarks, service marks, logos, or brand names listed here are the property of their respective owners.
                  </p>

                  <p className="leading-relaxed font-bold">
                    We do not charge any fees to users. In order to keep our services free and reward our users, we partner with verified CPA network sponsors.
                  </p>

                  <div className="flex justify-between items-center text-[9px] text-slate-500 pt-1 border-t border-slate-800">
                    <span className="font-bold">© 2026 US Reward Portal</span>
                    <button
                      id="reset-progress-btn"
                      onClick={resetAllProgress}
                      className="text-red-400 hover:text-red-300 font-bold transition-colors uppercase tracking-widest cursor-pointer"
                    >
                      Reset App
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Offer Interactive Simulator Modal popup */}
      <AnimatePresence>
        {activeModalOffer && (
          <OfferModal
            offer={activeModalOffer}
            onClose={() => setActiveModalOffer(null)}
            onComplete={() => handleOfferComplete(activeModalOffer.id)}
          />
        )}
      </AnimatePresence>

      {/* Humble Footer with subtle credits */}
      <footer className="border-t border-slate-200 mt-16 bg-white py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>Dedicated to high consumer satisfaction across all 50 states.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400">
            <a href="#privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

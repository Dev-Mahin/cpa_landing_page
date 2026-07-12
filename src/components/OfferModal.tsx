import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Smartphone, Download, Wallet, Gift, Loader2, CheckCircle2, ShieldCheck, ArrowRight, SmartphoneIcon, AlertCircle, Copy } from 'lucide-react';
import { Offer } from '../types';

interface OfferModalProps {
  offer: Offer | null;
  onClose: () => void;
  onComplete: () => void;
}

export default function OfferModal({ offer, onClose, onComplete }: OfferModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // States for different offer interactive fields
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, string>>({});
  const [copiedCode, setCopiedCode] = useState(false);

  // App Install specific simulation
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Reset states when offer changes
  useEffect(() => {
    if (offer) {
      setStep(1);
      setLoading(false);
      setSuccess(false);
      setEmail('');
      setPhone('');
      setPin('');
      setPinError('');
      setSurveyAnswers({});
      setCopiedCode(false);
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  }, [offer]);

  if (!offer) return null;

  const handleGiftCardSurvey = (question: string, answer: string) => {
    setSurveyAnswers(prev => ({ ...prev, [question]: answer }));
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      // Go to Email submission step for the gift card
      setStep(4);
    }
  };

  const handleGiftCardEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  const handleSweepstakesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1800);
  };

  const handlePinSubmitPhone = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2); // Go to PIN entering step
    }, 1500);
  };

  const handlePinSubmitCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      setPinError('Please enter a valid 4-digit code.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1600);
  };

  const startAppDownloadSimulation = () => {
    setIsDownloading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setDownloadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsDownloading(false);
          setStep(2); // Go to step 2: Run & Verify status
        }, 600);
      }
    }, 250);
  };

  const verifyAppInstall = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  const finishOffer = () => {
    onComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="offer-modal-overlay">
      {/* Dark blur backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden relative z-10"
        id={`modal-${offer.id}`}
      >
        {/* Modal Header */}
        <div className="bg-slate-50/50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex px-2.5 py-1 rounded-lg text-[9px] font-black bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-widest">
              {offer.category} Verification
            </span>
          </div>
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Main Content Container */}
        <div className="p-6 md:p-8" id="modal-body-container">
          {success ? (
            /* =================== SUCCESS SCREEN =================== */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 flex flex-col items-center"
              id="success-screen"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-6 shadow-sm">
                <CheckCircle2 className="w-10 h-10 fill-emerald-50" />
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-2">Offer Completed Successfully!</h3>
              <p className="text-xs text-slate-500 max-w-sm mb-8">
                Your verification token was generated and dispatched. Your payouts and entry credentials have been locked to your profile.
              </p>

              {/* Verified Badge Details */}
              <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-8 text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Session ID:</span>
                  <span className="font-mono text-slate-700 font-semibold">USA-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Reward Allocated:</span>
                  <span className="text-emerald-600 font-bold">{offer.rewardValue}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Payout Score:</span>
                  <span className="text-blue-600 font-bold">+{offer.payoutPoints} Points</span>
                </div>
              </div>

              <button
                id="finish-offer-btn"
                onClick={finishOffer}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/10 transition-all active:scale-98 cursor-pointer"
              >
                Confirm and Return to Hub
              </button>
            </motion.div>
          ) : loading ? (
            /* =================== LOADING SCREEN =================== */
            <div className="text-center py-16 flex flex-col items-center" id="loading-screen">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <h4 className="text-base font-bold text-slate-800 mb-2">Securing Connection</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Encrypting data payload and verifying requirements status with official US reward channels...
              </p>
            </div>
          ) : (
            /* =================== INTERACTIVE SIMULATION FLOWS =================== */
            <div id="interactive-flow-content">
              {offer.category === 'Gift Card' && (
                /* ============= GIFT CARD INTERACTIVE SURVEY ============= */
                <div id="gift-card-flow">
                  {step === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">USA Brand Feedback Program</h3>
                      <p className="text-xs text-slate-400 mb-6">
                        Answering these short survey questions qualifies you for the {offer.rewardValue} deposit.
                      </p>

                      <div className="space-y-4">
                        <p className="text-sm font-bold text-slate-700">Question 1: Which online marketplace do you use most frequently?</p>
                        <div className="grid grid-cols-1 gap-2">
                          {['Amazon.com', 'Walmart.com', 'eBay', 'Direct Brand Sites'].map((ans) => (
                            <button
                              key={ans}
                              onClick={() => handleGiftCardSurvey('retailer', ans)}
                              className="w-full text-left p-3.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:border-blue-500 hover:bg-blue-50/20 transition-all cursor-pointer"
                            >
                              {ans}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h3 className="text-lg font-bold text-slate-800 mb-4">Payout Frequency Preference</h3>
                      <div className="space-y-4">
                        <p className="text-sm font-bold text-slate-700">Question 2: How quickly would you like to receive your gift card funds?</p>
                        <div className="grid grid-cols-1 gap-2">
                          {['Direct Instant Deposit (Within 2 Hours)', 'Standard Verification Delivery (24 Hours)', 'Physical Mail Card (3-5 Days)'].map((ans) => (
                            <button
                              key={ans}
                              onClick={() => handleGiftCardSurvey('frequency', ans)}
                              className="w-full text-left p-3.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:border-blue-500 hover:bg-blue-50/20 transition-all cursor-pointer"
                            >
                              {ans}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h3 className="text-lg font-bold text-slate-800 mb-4">Demographics Check</h3>
                      <div className="space-y-4">
                        <p className="text-sm font-bold text-slate-700">Question 3: How often do you participate in consumer reward programs?</p>
                        <div className="grid grid-cols-1 gap-2">
                          {['This is my first time', 'Occassionally (1-2 times a month)', 'Regularly'].map((ans) => (
                            <button
                              key={ans}
                              onClick={() => handleGiftCardSurvey('experience', ans)}
                              className="w-full text-left p-3.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:border-blue-500 hover:bg-blue-50/20 transition-all cursor-pointer"
                            >
                              {ans}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-2xl flex items-start gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-emerald-800">Survey Phase Complete!</p>
                          <p className="text-[11px] text-emerald-600">Your profile answers are high-value. Complete final email lock below.</p>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-slate-800">Submit Verification Email</h3>
                      <p className="text-xs text-slate-400">
                        Enter the email address where you would like us to send the {offer.rewardValue} claim voucher link.
                      </p>

                      <form onSubmit={handleGiftCardEmailSubmit} className="space-y-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Your Primary Email</label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="email"
                              required
                              placeholder="e.g. name@domain.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Secure Voucher Slot</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </motion.div>
                  )}
                </div>
              )}

              {offer.category === 'Email Submit' && (
                /* ============= SWEEPSTAKES EMAIL SUBMIT ============= */
                <div id="email-submit-flow" className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800">Sweepstakes Entry Form</h3>
                  <p className="text-xs text-slate-400">
                    Submit your email address to enter our official USA-only raffle. Instant email verification required.
                  </p>

                  <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wide">Prize Package Details:</h4>
                    <ul className="text-[11px] text-blue-800 space-y-1.5 list-disc pl-4 font-semibold">
                      <li>Allocated Retail Value: {offer.rewardValue}</li>
                      <li>US National Sweepstakes License ID: #NY-92818</li>
                      <li>Winner will be drawn and notified instantly via submitted email</li>
                    </ul>
                  </div>

                  <form onSubmit={handleSweepstakesSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Enter Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="e.g. john@domain.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Submit Official Entry</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}

              {offer.category === 'Pin Submit' && (
                /* ============= PIN SUBMIT / MOBILE CONTENT ============= */
                <div id="pin-submit-flow">
                  {step === 1 ? (
                    <form onSubmit={handlePinSubmitPhone} className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-800">Mobile SMS Content Access</h3>
                      <p className="text-xs text-slate-400">
                        Enter your US mobile number to dispatch a secure, instant activation PIN code.
                      </p>

                      <div className="border border-slate-100 rounded-2xl p-4 bg-purple-50/20 text-purple-950 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold">Standard Carrier Rates May Apply</p>
                          <p className="text-[10px] text-purple-700 mt-0.5">Compatible with Verizon, AT&T, T-Mobile, MetroPCS, and Sprint carriers. Safe, non-spam verification.</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">US Mobile Number</label>
                        <div className="relative">
                          <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            placeholder="(555) 000-0000"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Send Activation PIN</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handlePinSubmitCode} className="space-y-4">
                      <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-xs text-emerald-700 font-semibold">PIN dispatched to {phone}. Check your SMS!</span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-800">Enter Activation PIN</h3>
                      <p className="text-xs text-slate-400">
                        Input the 4-digit code sent via text to finalize premium server access.
                      </p>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">4-Digit PIN Code</label>
                        <input
                          type="text"
                          maxLength={4}
                          required
                          placeholder="e.g. 1234"
                          value={pin}
                          onChange={(e) => {
                            setPin(e.target.value.replace(/\D/g, ''));
                            setPinError('');
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center tracking-widest text-lg font-bold focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        />
                        {pinError && <p className="text-red-500 text-[10px] mt-1 font-bold">{pinError}</p>}
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Verify & Unlock Content</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  )}
                </div>
              )}

              {offer.category === 'App Install' && (
                /* ============= APP INSTALL OFFER FLOW ============= */
                <div id="app-install-flow">
                  {step === 1 ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-800">Download Mobile Application</h3>
                      <p className="text-xs text-slate-400">
                        Verify your device signature by downloading the official app. This will unlock the bonus points.
                      </p>

                      {/* Mock App Store Widget */}
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md font-bold text-lg">
                          SS
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">SmartSecure VPN & Guard Pro</h4>
                          <p className="text-[10px] text-slate-400 font-medium">Utility Tools • 4.8★ (321k ratings)</p>
                          <div className="inline-flex mt-1 text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
                            FREE FOR 1 WEEK
                          </div>
                        </div>
                      </div>

                      {isDownloading ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold text-slate-600">
                            <span>Downloading secure verification payload...</span>
                            <span>{downloadProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <motion.div
                              className="bg-blue-600 h-full rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${downloadProgress}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <button
                          id="app-download-btn"
                          onClick={startAppDownloadSimulation}
                          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer animate-bounce"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download and Install Now</span>
                        </button>
                      )}

                      <div className="text-center">
                        <p className="text-[10px] text-slate-400 font-medium">
                          You will be redirected to the secure Google Play/App Store context.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-xl flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span className="text-xs text-blue-700 font-semibold">App successfully downloaded in browser sandboxed sandbox.</span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-800">Final Verification Run</h3>
                      <p className="text-xs text-slate-400">
                        Launch the application and keep it running for 30 seconds. Click "Check Verification Status" below once done.
                      </p>

                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-600 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-semibold">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Checking system device logs...</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          We will detect active app background running logs to award your score. Keep the app open on your screen.
                        </p>
                      </div>

                      <button
                        id="app-verify-btn"
                        onClick={verifyAppInstall}
                        className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Check Verification Status</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with safety credentials */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-center gap-1.5 text-[10px] font-medium text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>CCPA Secured, Spam-Free Policy • USA National Consumer Rewards</span>
        </div>
      </motion.div>
    </div>
  );
}

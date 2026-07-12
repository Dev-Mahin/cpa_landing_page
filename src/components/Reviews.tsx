import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, CheckCircle2, ThumbsUp, Send } from 'lucide-react';
import { MOCK_REVIEWS } from '../data';
import { UserReview } from '../types';

export default function Reviews() {
  const [reviews, setReviews] = useState<UserReview[]>(MOCK_REVIEWS);
  const [name, setName] = useState('');
  const [state, setState] = useState('TX');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({});
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({});

  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const handleHelpful = (reviewId: string) => {
    if (hasVoted[reviewId]) return;
    setHelpfulCounts((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
    setHasVoted((prev) => ({
      ...prev,
      [reviewId]: true,
    }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newReview: UserReview = {
      id: `rev-${Date.now()}`,
      name: name,
      location: `${name.split(' ')[0]} from ${state}`,
      rating: rating,
      comment: comment,
      date: 'Today',
      avatarSeed: name.toLowerCase().replace(/\s+/g, ''),
      verified: true,
    };

    setReviews([newReview, ...reviews]);
    setName('');
    setComment('');
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-lg mt-12" id="reviews-section">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-6">
        <div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            Verified Consumer Feedback
          </h3>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Read transparent reviews from community members who successfully completed US consumer offers.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Average Rating Stats */}
          <div className="flex items-center gap-1.5 bg-blue-50/55 border border-blue-200 px-3.5 py-2 rounded-xl">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span className="text-sm font-black text-slate-800">4.8 / 5.0</span>
            <span className="text-xs text-slate-400 font-bold">(2.4k reviews)</span>
          </div>

          <button
            id="toggle-review-form-btn"
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            {showForm ? 'Cancel' : 'Write Review'}
          </button>
        </div>
      </div>

      {/* Review Input Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleSubmitReview}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-50 border border-slate-150 rounded-2xl p-5 mb-6 overflow-hidden"
            id="review-form"
          >
            <h4 className="text-sm font-bold text-slate-800 mb-4">Share Your Experience</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Parker"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">US State</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {usStates.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Rating</label>
                <div className="flex items-center gap-1 h-9">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Your Review Comment</label>
              <textarea
                required
                rows={3}
                placeholder="Share how simple it was to claim your offer, the steps you completed, etc."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Publish Verified Review
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Review List */}
      <div className="space-y-4" id="reviews-list">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="p-5 rounded-xl bg-slate-50/50 border border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 transition-all duration-200 flex flex-col md:flex-row md:items-start gap-4"
          >
            {/* Left side: user profile avatar/initial */}
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 border border-blue-200 text-sm">
              {review.name.charAt(0).toUpperCase()}
            </div>

            {/* Right side: content */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">{review.name}</span>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Verified Claim
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{review.date}</span>
              </div>

              {/* Stars & Location */}
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-slate-400">•</span>
                <span className="text-[10px] font-medium text-slate-400">{review.location}</span>
              </div>

              {/* Comment text */}
              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-medium">
                {review.comment}
              </p>

              {/* Action helpful buttons */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  id={`review-helpful-btn-${review.id}`}
                  onClick={() => handleHelpful(review.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                    hasVoted[review.id]
                      ? 'bg-blue-50 text-blue-600 border border-blue-100'
                      : 'bg-white hover:bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>
                    Helpful ({ (helpfulCounts[review.id] || 0) + (review.rating === 5 ? 12 : 3) })
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

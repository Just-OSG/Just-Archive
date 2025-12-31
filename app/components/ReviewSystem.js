// app/components/ReviewSystem.js
"use client";

import { useState, useEffect, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { useTranslation } from "react-i18next";

// Star Rating Component
function StarRating({ rating, onRatingChange, interactive = false, size = "md" }) {
  const { isDark } = useApp();
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRatingChange?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`${interactive ? "cursor-pointer" : "cursor-default"} transition-colors`}
        >
          <svg
            className={`${sizeClasses[size]} ${
              (hoverRating || rating) >= star
                ? "text-yellow-400 fill-yellow-400"
                : isDark
                ? "text-slate-600"
                : "text-slate-300"
            }`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

// Individual Review Card
function ReviewCard({ review, onHelpful, hasVoted }) {
  const { isDark, lang } = useApp();
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(lang === "ar" ? "ar-JO" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div
      className={`${
        isDark ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
      } rounded-lg border p-4`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <StarRating rating={review.rating} size="sm" />
            <span className={`${isDark ? "text-slate-400" : "text-slate-500"} text-xs`}>
              {formatDate(review.createdAt)}
            </span>
          </div>
          <p className={`${isDark ? "text-slate-200" : "text-slate-700"} text-sm mt-2`}>
            {review.comment}
          </p>
          {review.username && (
            <p className={`${isDark ? "text-slate-500" : "text-slate-400"} text-xs mt-2`}>
              — {review.username}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-700/30">
        <button
          onClick={() => !hasVoted && onHelpful(review.id)}
          disabled={hasVoted}
          className={`${
            hasVoted
              ? isDark
                ? "text-slate-500 cursor-not-allowed"
                : "text-slate-400 cursor-not-allowed"
              : isDark
              ? "text-slate-400 hover:text-[#7DB4E5]"
              : "text-slate-500 hover:text-[#145C9E]"
          } text-xs flex items-center gap-1 transition-colors`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          {t("helpful")} ({review.helpfulCount || 0})
        </button>
      </div>
    </div>
  );
}

// Review Form Component
function ReviewForm({ onSubmit, existingReview }) {
  const { isDark, lang } = useApp();
  const { t } = useTranslation();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [username, setUsername] = useState(existingReview?.username || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError(t("pleaseSelectRating"));
      return;
    }

    if (comment.trim().length < 10) {
      setError(t("reviewTooShort"));
      return;
    }

    setIsSubmitting(true);

    const review = {
      id: existingReview?.id || Date.now().toString(),
      rating,
      comment: comment.trim(),
      username: username.trim() || t("anonymous"),
      createdAt: existingReview?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      helpfulCount: existingReview?.helpfulCount || 0,
    };

    onSubmit(review);
    setIsSubmitting(false);

    if (!existingReview) {
      setRating(0);
      setComment("");
      setUsername("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          className={`${isDark ? "text-slate-300" : "text-slate-700"} text-sm font-medium block mb-2`}
        >
          {t("yourRating")} *
        </label>
        <StarRating rating={rating} onRatingChange={setRating} interactive size="lg" />
      </div>

      <div>
        <label
          className={`${isDark ? "text-slate-300" : "text-slate-700"} text-sm font-medium block mb-2`}
        >
          {t("yourReview")} *
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t("reviewPlaceholder")}
          rows={4}
          className={`${
            isDark
              ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500"
              : "bg-white border-slate-200 text-slate-800 placeholder-slate-400"
          } w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
            isDark ? "focus:ring-[#7DB4E5]/50" : "focus:ring-[#145C9E]/50"
          }`}
        />
      </div>

      <div>
        <label
          className={`${isDark ? "text-slate-300" : "text-slate-700"} text-sm font-medium block mb-2`}
        >
          {t("yourName")} ({t("optional")})
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={t("namePlaceholder")}
          className={`${
            isDark
              ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500"
              : "bg-white border-slate-200 text-slate-800 placeholder-slate-400"
          } w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
            isDark ? "focus:ring-[#7DB4E5]/50" : "focus:ring-[#145C9E]/50"
          }`}
        />
      </div>

      {error && (
        <p className="text-red-500 text-xs">{error}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`${
          isDark
            ? "bg-[#7DB4E5] text-slate-950 hover:bg-[#9CC5E9]"
            : "bg-[#145C9E] text-white hover:bg-[#1f3d78]"
        } rounded-md px-4 py-2 text-sm font-medium transition disabled:opacity-50`}
      >
        {isSubmitting ? t("submitting") : existingReview ? t("updateReview") : t("submitReview")}
      </button>
    </form>
  );
}

// Main Review System Component
export default function ReviewSystem({ courseCode }) {
  const { isDark, lang } = useApp();
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [votedReviews, setVotedReviews] = useState(new Set());
  const [sortBy, setSortBy] = useState("recent"); // "recent", "helpful", "highest", "lowest"

  // Load reviews from localStorage
  useEffect(() => {
    const storageKey = `courseReviews_${courseCode}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setReviews(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse reviews from localStorage", e);
      }
    }

    // Load voted reviews
    const votedKey = `votedReviews_${courseCode}`;
    const votedStored = localStorage.getItem(votedKey);
    if (votedStored) {
      try {
        setVotedReviews(new Set(JSON.parse(votedStored)));
      } catch (e) {
        console.error("Failed to parse voted reviews from localStorage", e);
      }
    }
  }, [courseCode]);

  // Save reviews to localStorage
  const saveReviews = (newReviews) => {
    const storageKey = `courseReviews_${courseCode}`;
    localStorage.setItem(storageKey, JSON.stringify(newReviews));
    setReviews(newReviews);
  };

  // Calculate average rating
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  // Rating distribution
  const ratingDistribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      dist[review.rating]++;
    });
    return dist;
  }, [reviews]);

  // Sorted reviews
  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    switch (sortBy) {
      case "helpful":
        return sorted.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
      case "highest":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return sorted.sort((a, b) => a.rating - b.rating);
      case "recent":
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [reviews, sortBy]);

  // Handle review submission
  const handleSubmitReview = (review) => {
    const existingIndex = reviews.findIndex((r) => r.id === review.id);
    let newReviews;
    
    if (existingIndex >= 0) {
      newReviews = [...reviews];
      newReviews[existingIndex] = review;
    } else {
      newReviews = [review, ...reviews];
    }
    
    saveReviews(newReviews);
    setShowForm(false);
  };

  // Handle helpful vote
  const handleHelpful = (reviewId) => {
    if (votedReviews.has(reviewId)) return;

    const newReviews = reviews.map((review) =>
      review.id === reviewId
        ? { ...review, helpfulCount: (review.helpfulCount || 0) + 1 }
        : review
    );
    saveReviews(newReviews);

    const newVoted = new Set(votedReviews);
    newVoted.add(reviewId);
    setVotedReviews(newVoted);
    
    const votedKey = `votedReviews_${courseCode}`;
    localStorage.setItem(votedKey, JSON.stringify([...newVoted]));
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div
        className={`${
          isDark ? "bg-slate-900/40 border-slate-700" : "bg-white border-slate-200"
        } rounded-lg border p-4 sm:p-6`}
      >
        <h3
          className={`${isDark ? "text-slate-100" : "text-slate-800"} text-lg font-semibold mb-4`}
        >
          {t("courseRating")}
        </h3>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Average Rating */}
          <div className="text-center sm:text-left">
            <div className={`${isDark ? "text-slate-100" : "text-slate-800"} text-4xl font-bold`}>
              {averageRating}
            </div>
            <StarRating rating={Math.round(parseFloat(averageRating))} size="md" />
            <p className={`${isDark ? "text-slate-400" : "text-slate-500"} text-xs mt-1`}>
              {reviews.length} {reviews.length === 1 ? t("review") : t("reviews")}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDistribution[star];
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className={`${isDark ? "text-slate-400" : "text-slate-600"} text-xs w-3`}>
                    {star}
                  </span>
                  <svg className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                  <div className={`${isDark ? "bg-slate-700" : "bg-slate-200"} flex-1 h-2 rounded-full overflow-hidden`}>
                    <div
                      className="bg-yellow-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className={`${isDark ? "text-slate-500" : "text-slate-400"} text-xs w-6 text-right`}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Write Review Button */}
        <div className="mt-4 pt-4 border-t border-slate-700/30">
          <button
            onClick={() => setShowForm(!showForm)}
            className={`${
              isDark
                ? "border-[#7DB4E5] text-[#7DB4E5] hover:bg-[#7DB4E5]/10"
                : "border-[#145C9E] text-[#145C9E] hover:bg-[#145C9E]/10"
            } rounded-md border px-4 py-2 text-sm font-medium transition flex items-center gap-2`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            {showForm ? t("cancelReview") : t("writeReview")}
          </button>
        </div>

        {/* Review Form */}
        {showForm && (
          <div className={`${isDark ? "bg-slate-800/30" : "bg-slate-50"} rounded-lg p-4 mt-4`}>
            <ReviewForm onSubmit={handleSubmitReview} />
          </div>
        )}
      </div>

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className={`${isDark ? "text-slate-200" : "text-slate-700"} text-sm font-medium`}>
              {t("allReviews")}
            </h4>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`${
                isDark
                  ? "bg-slate-800 border-slate-700 text-slate-300"
                  : "bg-white border-slate-200 text-slate-700"
              } rounded-md border px-2 py-1 text-xs focus:outline-none`}
            >
              <option value="recent">{t("sortRecent")}</option>
              <option value="helpful">{t("sortHelpful")}</option>
              <option value="highest">{t("sortHighest")}</option>
              <option value="lowest">{t("sortLowest")}</option>
            </select>
          </div>

          <div className="space-y-3">
            {sortedReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onHelpful={handleHelpful}
                hasVoted={votedReviews.has(review.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Reviews Yet */}
      {reviews.length === 0 && !showForm && (
        <div
          className={`${
            isDark ? "bg-slate-900/40 border-slate-700" : "bg-white border-slate-200"
          } rounded-lg border p-6 text-center`}
        >
          <div className="text-4xl mb-2">📝</div>
          <p className={`${isDark ? "text-slate-400" : "text-slate-500"} text-sm`}>
            {t("noReviewsYet")}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className={`${
              isDark
                ? "text-[#7DB4E5] hover:text-[#9CC5E9]"
                : "text-[#145C9E] hover:text-[#1f3d78]"
            } text-sm font-medium mt-2 transition`}
          >
            {t("beFirstToReview")}
          </button>
        </div>
      )}
    </div>
  );
}

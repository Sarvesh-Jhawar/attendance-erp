"use client";

import Link from "next/link";
import { useState } from "react";

export default function FeedbackPage() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div
        className="flex items-center px-4 py-4 sm:px-8"
        style={{
          background: "linear-gradient(90deg, #18132a 0%, #3a206b 100%)",
          borderBottom: "1.5px solid #6441a5",
        }}
      >
        <Link
          href="/dashboard"
          className="flex items-center font-medium text-white text-base sm:text-lg"
          style={{ textDecoration: "none" }}
        >
          <span className="flex items-center mr-2">
            {/* Left arrow icon */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              style={{ marginRight: "0.2rem" }}
            >
              <path
                d="M15 19l-7-7 7-7"
                stroke="#8ab4f8"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </span>
        </Link>
        <span
          className="ml-4 text-xl sm:text-3xl font-bold"
          style={{
            letterSpacing: "1px",
            background: "linear-gradient(90deg, #5ea2ef 0%, #b57aff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Feedback
        </span>
      </div>
      {/* Feedback Form */}
      <div className="flex flex-col items-center justify-center px-4 py-10 min-h-[600px]">
        {loading && (
          <div className="flex flex-col items-center justify-center absolute z-10 bg-opacity-80 bg-slate-900 w-full h-full min-h-[600px]">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="text-white text-lg">Loading form...</span>
          </div>
        )}
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSeJpZjU8Wpv6xRGWjMZ18e5DrZmephSbjuqWMFJS2lhGWo3uA/viewform?embedded=true"
          width="100%"
          height="600"
          className="max-w-xl w-full rounded-xl border border-purple-400 bg-white relative"
          style={{ minHeight: 400 }}
          title="Feedback Form"
          onLoad={() => setLoading(false)}
        >
          Loading…
        </iframe>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";

export default function FeedFormPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate form loading (replace with your actual loading logic)
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex flex-col items-center">
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-white text-lg">Loading form...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ...existing form code... */}
    </div>
  );
}
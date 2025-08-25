"use client";

import Link from "next/link";

export default function AboutPage() {
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
          About Us
        </span>
      </div>

      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          CBIT Attendance Analyzer
        </h1>
        <p className="text-white/80 mb-6 text-lg">
          Tired of clunky college ERP systems and endless manual calculations?<br />
          We were too — that’s why we built <span className="font-semibold text-purple-300">CBIT Attendance Analyzer</span>, a modern, intuitive, and student-friendly dashboard designed exclusively for CBIT students.
        </p>
        <h2 className="text-xl font-bold text-purple-300 mb-2">Our Mission</h2>
        <p className="mb-6">
          Make attendance tracking effortless, accurate, and insightful.
        </p>
        <h2 className="text-xl font-bold text-purple-300 mb-2">With our platform, you can:</h2>
        <ul className="list-disc list-inside mb-6 space-y-2 text-white/90">
          <li>📊 Get detailed analytics for each subject</li>
          <li>✨ Predict attendance impact with our smart attendance calculator</li>
          <li>📅 View attendance date-wise for better clarity</li>
          <li>🗓 Plan your day with our “Plan Your Today” tool</li>
          <li>📈 Track trends with beautiful visual graphs and charts</li>
          <li>🎉 Stay updated on upcoming club events</li>
          <li>📝 Explore recruitment forms for clubs</li>
        </ul>
        <p className="mb-8 text-white/80">
          We’ve even made it fun—because attendance doesn’t have to be boring!
        </p>
        <h2 className="text-xl font-bold text-purple-300 mb-4">Meet the Team</h2>
        <div className="mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
            <span className="font-semibold text-white">Frontend Developer:</span>
            <span className="font-semibold text-purple-300 sm:ml-2">K.H. Harsh</span>
            <Link href="https://www.linkedin.com/in/khharsh/" target="_blank" rel="noopener noreferrer" className="mt-2 sm:mt-0 sm:ml-2">
              <svg
                className="inline-block align-middle"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ color: "#0A66C2" }}
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 10.268h-3v-4.604c0-1.102-.021-2.521-1.537-2.521-1.539 0-1.775 1.202-1.775 2.441v4.684h-3v-9h2.881v1.233h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.597 2.001 3.597 4.601v4.729z"/>
              </svg>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
            <span className="font-semibold text-white">Backend Developer & Team Lead:</span>
            <span className="font-semibold text-purple-300 sm:ml-2">Sarvesh Jhawar</span>
            <Link href="https://www.linkedin.com/in/sarvesh-jhawar-515bb42b2/" target="_blank" rel="noopener noreferrer" className="mt-2 sm:mt-0 sm:ml-2">
              <svg
                className="inline-block align-middle"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ color: "#0A66C2" }}
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 10.268h-3v-4.604c0-1.102-.021-2.521-1.537-2.521-1.539 0-1.775 1.202-1.775 2.441v4.684h-3v-9h2.881v1.233h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.597 2.001 3.597 4.601v4.729z"/>
              </svg>
            </Link>
          </div>
        </div>
        <h2 className="text-xl font-bold text-purple-300 mb-2">Why CBIT Attendance Analyzer?</h2>
        <p className="mb-6 text-white/80">
          Whether you want to keep your attendance safe, plan your classes strategically, or just check today’s timetable, the CBIT Attendance Analyzer is your one-stop solution.
        </p>
      </div>
    </div>
  );
}
import React from "react";
import Link from "next/link";

export default function Sidebar({ open, setOpen }: { open: boolean, setOpen: (v: boolean) => void }) {
  return (
    <>
      {/* Sidebar overlay (shows on any screen when open) */}
      <aside
        className={`w-56 p-6 flex flex-col gap-4 shadow-lg z-50
          fixed top-0 left-0 h-full transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} overflow-y-auto`}
        style={{
          background: "linear-gradient(135deg, #18132a 0%, #3a206b 100%)",
          borderRight: "1.5px solid #6441a5",
        }}
      >
        <button
          className="mb-6 self-end text-white text-2xl"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-6 text-purple-200">Menu</h2>
        <nav className="flex flex-col gap-3">
          <Link href="/holidays" className="text-purple-100 hover:text-white transition font-medium">
            Holidays
          </Link>
          <hr className="border-dotted border-t-2 border-purple-700 my-1" />
          <div className="flex items-center">
            <Link href="/mark-your-attendance" className="text-purple-100 hover:text-white transition font-medium">
              Mark Your Attendance
            </Link>
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow animate-pulse">
              NEW
            </span>
          </div>
          <hr className="border-dotted border-t-2 border-purple-700 my-1" />
          <div className="flex items-center">
            <Link href="/recruitment-forms" className="text-purple-100 hover:text-white transition font-medium">
              Recruitment Forms
            </Link>
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow animate-pulse">
              NEW
            </span>
          </div>
          <hr className="border-dotted border-t-2 border-purple-700 my-1" />
          <Link href="/clubs" className="text-purple-100 hover:text-white transition font-medium">Clubs</Link>
          <hr className="border-dotted border-t-2 border-purple-700 my-1" />
          <Link href="/about" className="text-purple-100 hover:text-white transition font-medium">About Us</Link>
          <hr className="border-dotted border-t-2 border-purple-700 my-1" />
          <Link href="/faq" className="text-purple-100 hover:text-white transition font-medium">FAQ</Link>
          <hr className="border-dotted border-t-2 border-purple-700 my-1" />
          <Link href="/feedback" className="text-purple-100 hover:text-white transition font-medium">Feedback</Link>
          <hr className="border-dotted border-t-2 border-purple-700 my-1" />
          <Link
            href="/"
            className="text-purple-100 hover:text-white transition font-medium"
          >
            Logout
          </Link>
        </nav>
      </aside>
      {/* Overlay for when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
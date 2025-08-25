"use client";

import Link from "next/link";
import { useState } from "react";

// Future events can be added here
const events = [
	 {
	 	club: "Chaitanya Spandana",
		poster: "/images/Ganeshotsav.JPG",
	 	name: "Ganeshotsav 2025",
	 },
	 {
	 	club: "Praheti Racing SAE CBIT",
		poster: "/images/praheti.png",
	 	name: "Eight-Day International Workshop",
	 },
];

type Event = {
  club: string;
  poster: string;
  name: string;
  // add other fields if needed
};

export default function EventsPage() {
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [search, setSearch] = useState("");
	const filteredEvents = events.filter(
		(event) =>
			event.name.toLowerCase().includes(search.toLowerCase()) ||
			event.club.toLowerCase().includes(search.toLowerCase())
		);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
			{/* Header */}
			<div
				className="flex flex-col sm:flex-row sm:items-center px-4 py-4 sm:px-8 gap-3 sm:gap-0"
				style={{
					background: "linear-gradient(90deg, #18132a 0%, #3a206b 100%)",
					borderBottom: "1.5px solid #6441a5",
				}}
			>
				<div className="flex items-center">
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
						Club Events
					</span>
				</div>
				<div className="mt-3 sm:mt-0 sm:ml-auto flex items-center">
					<Link
						href="/recruitment-forms"
						className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 bg-[#2d2047] text-white font-semibold hover:bg-[#3a206b] transition relative"
					>
						Recruitment Forms
						<span className="absolute -top-2 -right-6 sm:static sm:ml-2 bg-orange-400 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
							NEW
						</span>
						<style jsx>{`
							@keyframes blinker {
								50% { opacity: 0.4; }
							}
						`}</style>
					</Link>
				</div>
			</div>
			{/* Search and Info Bar */}
			<div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-5xl mx-auto mt-8 px-2 sm:px-0">
				{/* Search Bar */}
				<input
					type="text"
					placeholder="Search events..."
					value={search}
					onChange={e => setSearch(e.target.value)}
					className="w-full sm:w-80 px-4 py-2 rounded-lg border border-[#6441a5] bg-[#2d2047] text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
				/>
				{/* Info Button with Tooltip */}
				<div className="relative group">
					<button
						className="flex items-center justify-center w-9 h-9 rounded-full bg-[#2d2047] border border-[#6441a5] text-purple-200 hover:bg-[#3a206b] transition"
						tabIndex={0}
						aria-label="Info"
					>
						<svg width="22" height="22" fill="none" viewBox="0 0 24 24">
							<circle cx="12" cy="12" r="10" stroke="#b57aff" strokeWidth="2" />
							<rect x="11" y="10" width="2" height="6" rx="1" fill="#b57aff" />
							<rect x="11" y="7" width="2" height="2" rx="1" fill="#b57aff" />
						</svg>
					</button>
					{/* Tooltip */}
					<div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-black/90 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 pointer-events-none transition z-10">
						Click on the event poster for full view!
					</div>
				</div>
			</div>
			{/* Events Grid */}
			<div className="max-w-5xl mx-auto py-10 px-2 sm:px-4">
				{filteredEvents.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20">
						{/* Optional: Add an illustration or icon here */}
						<svg width="64" height="64" fill="none" className="mb-6">
							<circle
								cx="32"
								cy="32"
								r="32"
								fill="#6441a5"
								opacity="0.2"
							/>
							<path
								d="M20 40h24M32 24v16"
								stroke="#b57aff"
								strokeWidth="2.5"
								strokeLinecap="round"
							/>
						</svg>
						<h2 className="text-xl sm:text-2xl font-bold text-purple-300 mb-2">
							No Upcoming Events
						</h2>
						<p className="text-white/80 text-center">
							There are currently no events scheduled. Please check back later!
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
						{filteredEvents.map((event, idx) => (
							<div
								key={idx}
								className="bg-[#2d2047] rounded-xl shadow-lg border border-[#6441a5] flex flex-col items-center p-4 cursor-pointer transition hover:scale-105"
								onClick={() => setSelectedEvent(event)}
							>
								<img
									src={event.poster}
									alt={event.name}
									className="w-full h-64 object-contain bg-white rounded-lg mb-4"
								/>
								<h2 className="text-lg font-bold text-purple-300 mb-2 text-center">
									{event.club}
								</h2>
								<p className="text-white text-center">{event.name}</p>
							</div>
						))}
					</div>
				)}
			</div>
			{/* Fullscreen Poster Modal */}
			{selectedEvent && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
					<button
						className="absolute top-6 right-8 text-white text-4xl font-bold bg-black/40 rounded-full px-3 py-1 hover:bg-black/70 transition"
						onClick={() => setSelectedEvent(null)}
						aria-label="Close"
					>
						&times;
					</button>
					<div className="max-w-full max-h-full flex flex-col items-center justify-center px-2">
						<img
							src={selectedEvent.poster}
							alt={selectedEvent.name}
							className="max-w-[90vw] max-h-[80vh] rounded-xl shadow-2xl object-contain bg-white"
						/>
						<h2 className="mt-6 text-2xl font-bold text-purple-300 text-center">
							{selectedEvent.club}
						</h2>
						<p className="text-white text-center">{selectedEvent.name}</p>
					</div>
				</div>
			)}
		</div>
	);
}
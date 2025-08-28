"use client";

import Link from "next/link";
import { parse } from "date-fns";
import { useState } from "react";

// Future events can be added here
// Format: dd-mm-yyyy or "n/a"
const events = [
	 {
	 	club: "CHAITANYA ASTRA",
		poster: "/images/cosmocon.jpg",
		name: "COSMOCON-2025",
		date: "09-10-2025", 
		

	 },
	 {
	 	club: "Praheti Racing SAE CBIT",
		poster: "/images/praheti.png",
		name: "Eight-Day International Workshop",
		date: "31-08-2025",
	 },
	 {
        club: "VMEDHA",
		poster: "/images/VmedhaEvent.jpg",
		name: "Guest Lecture on Vision LLMs and real world use cases",
		date: "28-08-2025",
	 },
];

type Event = {
  club: string;
  poster: string;
  name: string;
  date: string;
  // add other fields if needed
};

export default function EventsPage() {
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [search, setSearch] = useState("");
	const [showAddEventInfo, setShowAddEventInfo] = useState(false);

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const filteredEvents = events
		.filter((event) => {
			if (event.date.toLowerCase() === "n/a") {
				return true;
			}
			const eventDate = parse(event.date, "dd-MM-yyyy", new Date());
			// parse returns Invalid Date on failure, and (Invalid Date >= today) is false.
			return eventDate >= today;
		})
		.filter(
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
				<div className="mt-3 sm:mt-0 sm:ml-auto flex items-center gap-4">
					<button
						onClick={() => setShowAddEventInfo(true)}
						className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 bg-[#2d2047] text-white font-semibold hover:bg-[#3a206b] transition"
					>
						Add Event
					</button>
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
								{/* Blurred background behind poster */}
								<div className="relative w-full h-64 mb-4 flex items-center justify-center">
									<div
										className="absolute inset-0 rounded-lg"
										style={{
											background: `url(${event.poster}) center/cover no-repeat`,
											filter: "blur(12px) brightness(0.7)",
											zIndex: 1,
										}}
									/>
									<img
										src={event.poster}
										alt={event.name}
										className="relative w-full h-64 object-contain rounded-lg z-10"
										style={{ background: "rgba(44, 33, 71, 0.7)" }}
									/>
								</div>
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
							className="max-w-[90vw] max-h-[80vh] rounded-xl shadow-2xl object-contain bg-slate-800"
						/>
						<h2 className="mt-6 text-2xl font-bold text-purple-300 text-center">
							{selectedEvent.club}
						</h2>
						<p className="text-white text-center">{selectedEvent.name}</p>
					</div>
				</div>
			)}
			{/* Add Event Info Modal */}
			{showAddEventInfo && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
					<div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-black border border-purple-500 rounded-xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 text-white">
						<button
							className="absolute top-4 right-4 text-white/70 text-3xl font-bold hover:text-white transition"
							onClick={() => setShowAddEventInfo(false)}
							aria-label="Close"
						>
							&times;
						</button>
						<h2 className="text-2xl sm:text-3xl font-bold text-purple-300 mb-6 text-center">
							Requirements to Add Your Event
						</h2>
						<div className="space-y-4 text-white/90">
							<ol className="list-decimal list-inside space-y-3 text-base">
								<li>Event Name must be clearly mentioned.</li>
								<li>Club Name should be provided.</li>
								<li>
									Poster should be in JPG/PNG format with A4 resolution
									(2480×3508 px).
								</li>
								<li>
									Event details (date, venue, timings, etc.) should be
									included inside the poster.
								</li>
								<li>
									Only genuine events will be accepted (no misleading or wrong
									motives).
								</li>
							</ol>
							<div className="border-t border-purple-500/50 mt-6 pt-6">
								<h3 className="text-xl font-bold text-purple-300 text-center mb-3">
									Contact Us to Add Event
								</h3>
								<div className="mt-4 flex justify-center items-center gap-x-8 gap-y-4 flex-wrap">
									
									<a
										href={`https://wa.me/919474254875?text=${encodeURIComponent(
											"Hello! I would like to add an event to the website. \nHere are the details:\n\nEvent Name: \nClub Name: \nEvent Date:\n\n(Please attach the poster)"
										)}`}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 text-white hover:text-purple-300 transition font-semibold"
									>
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.911.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.891 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807l-1.151.304 1.414-5.177c-.9-.614-1.565-1.41-2.013-2.309-.459-.92-.694-1.934-.693-2.979.002-4.396 3.595-7.993 7.998-7.993 2.185.001 4.23 1.082 5.67 2.524 1.44 1.443 2.521 3.488 2.522 5.671-.002 4.396-3.598 7.993-7.999 7.993-1.013.001-2.011-.239-2.908-.713zm-1.114-1.645l-.063-.135c-.393-.86-.873-1.967-.916-2.057.058-.089.386-.197.879-.386.51-.199.985-.386 1.46-.562.51-.199.829-.266 1.125.266.001.001.789 1.292.958 1.551.169.259.289.297.538.214.51-.199 2.026-.792 2.434-1.013.393-.214.262-.335-.125-.525-.266-.135-.604-.214-.853-.266-.25-.053-.17-.125-.125-.214.393-.86 1.125-2.625 1.125-2.979 0-.266-.25-.386-.5-.386h-.001c-.25 0-.669.09-.998.386-.33.297-1.169 1.169-1.169 2.864 0 1.709 1.196 3.335 1.364 3.594.169.259.338.266.563.214.51-.199 1.687-.659 2.081-.829.393-.17.652-.214.872-.142.22.071.669.32.76.45.09.135.09.789-.304 1.584-.393.795-1.875 1.792-2.625 2.116-.75.324-1.516.484-2.309.484-1.709-.001-4.01-.705-4.383-.973z" /></svg>
										WhatsApp
									</a>
									<a
										href={`mailto:projectfeedback86@gmail.com?subject=${encodeURIComponent(
											"Event Submission for Website"
										)}&body=${encodeURIComponent(
											"Hello,\n\nI would like to submit an event for the website.\n\nEvent Name:\nClub Name:\nEvent Date:\n\nPoster is attached.\n\nThank you."
										)}`}
										className="flex items-center gap-2 text-white hover:text-purple-300 transition font-semibold"
									>
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.724v14.437h24v-14.437l-12 9.724z"/></svg>
										Email
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
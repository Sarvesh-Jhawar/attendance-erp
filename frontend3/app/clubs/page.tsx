"use client";

import Link from "next/link";
import { useState } from "react";

// Updated club data with correct logo paths
const clubs = [
	{
		name: "Chaitanya Samskruthi",
		logo: "/logo/samskruthi.jpg",
		instagram: "https://www.instagram.com/chaitanya_samskruthi/",
	},
	{
		name: "Chaitanya Kreeda",
		logo: "/logo/krreda.jpg",
		instagram: "https://www.instagram.com/chaitanyakreeda/?hl=en",
	},
	{
		name: "Chaitanya Geethi",
		logo: "/logo/geethi.jpg",
		instagram: "https://www.instagram.com/chaitanya_geethi/?hl=en",
	},
	{
		name: "Chaitanya Vaadya",
		logo: "/logo/vaadya.jpg",
		instagram: "https://www.instagram.com/chaitanya_vaadya/?hl=en",
	},
	{
		name: "Chaitanya Spandana",
		logo: "/logo/spandana.jpg",
		instagram: "https://www.instagram.com/chaitanya.spandana/?hl=en",
	},
	{
		name: "CBIT NSS",
		logo: "/logo/nss.jpg",
		instagram: "https://www.instagram.com/cbitnss/?hl=en",
	},
	{
		name: "CBIT Photography Club",
		logo: "/logo/phtoclub.jpg",
		instagram: "https://www.instagram.com/cbitphotoclub/?hl=en",
	},
	{
		name: "Chaitanya Srujana",
		logo: "/logo/srujna.jpg",
		instagram: "https://www.instagram.com/chaitanya_srujana_cbit/?hl=en",
	},
	{
		name: "PRAHETI RACING CLUB",
		logo: "/logo/praheti.jpg",
		instagram: "https://www.instagram.com/prahetiracing/",
	},
	{
		name: "CBIT Open Source Community",
		logo: "/logo/cosc.jpg",
		instagram: "https://www.instagram.com/cbitosc/?hl=en",
	},
	{
		name: "CBIT Developer Student Club",
		logo: "/logo/cdsc.jpg",
		instagram: "https://www.instagram.com/cbitdsc/",
	},
	{
		name: "CBIT Model United Nations",
		logo: "/logo/mun.jpg",
		instagram: "https://www.instagram.com/cbitmunhyd/?hl=en",
	},
	{
		name: "Communicando",
		logo: "/logo/commindcando.jpg",
		instagram: "https://www.instagram.com/communicando/?hl=en",
	},
	{
		name: "Toastmasters CBIT",
		logo: "/logo/toastmaster.jpg",
		instagram: "https://www.instagram.com/tmcbit/?hl=en",
	},
	{
		name: "WRITERS AND POETS CLUB",
		logo: "/logo/wpc.jpg",
		instagram: "https://www.instagram.com/wpc_cbit/n",
	},
	{
		name: "CBIT E-sports Club",
		logo: "/logo/esports.jpg",
		instagram: "https://www.instagram.com/cbitesports/?hl=en",
	},
	{
		name: "EWB-CBIT",
		logo: "/logo/ewb.jpg",
		instagram: "https://www.instagram.com/ewbcbit/?hl=en",
	},
	{
		name: "RAMANUJAN MATHS CLUB",
		logo: "/logo/maths.jpg",
		instagram: "https://www.instagram.com/rmc.cbit/?hl=en",
	},
	{
		name: "IEEE-CBIT",
		logo: "/logo/ieee.jpg",
		instagram: "https://www.instagram.com/ieee_cbit/?hl=en",
	},
	{
		name: "ASME CBIT",
		logo: "/logo/asme.jpg",
		instagram: "https://www.instagram.com/asme.cbit/",
	},
	{
		name: "VMEDHA",
		logo: "/logo/vmedha.jpg",
		instagram: "https://www.instagram.com/cbit.vmedha/?hl=en",
	},
	{
		name: "Chaitanya Suraksha",
		logo: "/logo/suraksha.jpg",
		instagram: "https://www.instagram.com/chaitanya_suraksha/",
	},
	{
		name: "Chaitanya Svaasthya",
		logo: "/logo/swasthaya.jpg",
		instagram: "https://www.instagram.com/chaitanya_suraksha/",
	},

	// Add more clubs here if needed
];

export default function ClubsPage() {
	const [search, setSearch] = useState("");

	const filteredClubs = clubs.filter(club =>
		club.name.toLowerCase().includes(search.toLowerCase())
	);

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
					CBIT Clubs
				</span>
			</div>
			{/* Search Bar */}
			<div className="max-w-5xl mx-auto px-2 sm:px-4 mt-8 mb-6">
				<input
					type="text"
					placeholder="Search clubs..."
					value={search}
					onChange={e => setSearch(e.target.value)}
					className="w-full sm:w-1/2 mx-auto block rounded-lg px-4 py-2 bg-[#2d2047] border border-[#6441a5] text-white placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
				/>
			</div>
			{/* Clubs Grid */}
			<div className="max-w-5xl mx-auto pb-10 px-2 sm:px-4">
				{filteredClubs.length === 0 ? (
					<div className="text-center text-purple-300 py-10 text-lg font-semibold">
						No clubs found.
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
						{filteredClubs.map((club, idx) => (
							<div
								key={idx}
								className="bg-[#2d2047] rounded-xl shadow-lg border border-[#6441a5] flex flex-col items-center p-6"
							>
								<img
									src={club.logo}
									alt={club.name + " logo"}
									className="w-24 h-24 object-contain rounded-full mb-4 bg-white"
								/>
								<h2 className="text-lg font-bold text-purple-300 mb-2 text-center">
									{club.name}
								</h2>
								<Link
									href={club.instagram}
									target="_blank"
									rel="noopener noreferrer"
									className="mt-2 text-pink-400 font-semibold underline hover:text-pink-300"
									aria-label={`Instagram page of ${club.name}`}
								>
									Instagram
								</Link>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
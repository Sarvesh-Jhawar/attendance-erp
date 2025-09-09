"use client";

import Link from "next/link";
import {
	Baby,
	Bot,
	Camera,
	Car,
	Code2,
	Club as ClubIcon,
	Gamepad2,
	GraduationCap,
	HandHeart,
	HeartHandshake,
	HeartPulse,
	Leaf,
	Landmark,
	Mic,
	Music,
	Palette,
	PenSquare,
	PersonStanding,
	Rocket,
	Shield,
	Theater,
	TrendingUp,
	Trophy,
	Wrench,
} from "lucide-react";
import { useState } from 'react';

// Add a style tag for the custom animation
const CustomStyles = () => (
	<style jsx global>{`
		@keyframes spin-slow {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}
		@keyframes float {
			0%,
			100% {
				transform: translateY(0);
			}
			50% {
				transform: translateY(-5px);
			}
		}
	`}</style>
);

// Icon mapping based on category
const iconMap = {
	Cultural: Theater,
	Sports: Trophy,
	Music: Music,
	Service: HeartHandshake,
	Photography: Camera,
	Creative: Palette,
	Automotive: Car,
	Coding: Code2,
	Debate: Landmark,
	Literary: PenSquare,
	Gaming: Gamepad2,
	Finance: TrendingUp,
	Academic: GraduationCap,
	Aerospace: Rocket,
	Robotics: Bot,
	Mechanical: Wrench,
	Safety: Baby,
	"Womens Safety": HandHeart,
	"Film and Theater": Theater,
	Cybersecurity: Shield,
	Environmental: Leaf,
	Podcast: Mic,
	Healthcare: HeartPulse,
	Dance: PersonStanding,
	Default: ClubIcon,
};

// Define a type for the category based on the keys of iconMap
type ClubCategory = keyof typeof iconMap;

// Define the type for a single club
interface Club {
	name: string;
	logo: string;
	instagram: string;
	category: ClubCategory;
}

// Updated club data with correct logo paths
const clubs: Club[] = [
	{
		name: "Chaitanya Samskruthi",
		logo: "/logo/samskruthi.jpg",
		instagram: "https://www.instagram.com/chaitanya_samskruthi/",
		category: "Cultural",
	},
	{
		name: "Chaitanya Kreeda",
		logo: "/logo/krreda.jpg",
		instagram: "https://www.instagram.com/chaitanyakreeda/?hl=en",
		category: "Sports",
	},
	{
		name: "Chaitanya Geethi",
		logo: "/logo/geethi.jpg",
		instagram: "https://www.instagram.com/chaitanya_geethi/?hl=en",
		category: "Music",
	},
	{
		name: "Chaitanya Vaadya",
		logo: "/logo/vaadya.jpg",
		instagram: "https://www.instagram.com/chaitanya_vaadya/?hl=en",
		category: "Music",
	},
	{
		name: "Chaitanya Spandana",
		logo: "/logo/spandana.jpg",
		instagram: "https://www.instagram.com/chaitanya.spandana/?hl=en",
		category: "Service",
	},
	{
		name: "CBIT NSS",
		logo: "/logo/nss.jpg",
		instagram: "https://www.instagram.com/cbitnss/?hl=en",
		category: "Service",
	},
	{
		name: "Chaaya - The Film Club",
		logo: "/logo/chaya.jpg",
		instagram: "https://www.instagram.com/chaaya.cbit/",
		category: "Film and Theater",
	},
	{
		name: "CBIT Photography Club",
		logo: "/logo/phtoclub.jpg",
		instagram: "https://www.instagram.com/cbitphotoclub/?hl=en",
		category: "Photography",
	},
	{
		name: "Chaitanya Srujana",
		logo: "/logo/srujna.jpg",
		instagram: "https://www.instagram.com/chaitanya_srujana_cbit/?hl=en",
		category: "Creative",
	},
	{
		name: "Praheti Racing (SAE CBIT)",
		logo: "/logo/praheti.jpg",
		instagram: "https://www.instagram.com/prahetiracing/",
		category: "Automotive",
	},
	{
		name: "CBIT Open Source Community",
		logo: "/logo/cosc.jpg",
		instagram: "https://www.instagram.com/cbitosc/?hl=en",
		category: "Coding",
	},
	{
		name: "CBIT Developer Student Club",
		logo: "/logo/cdsc.jpg",
		instagram: "https://www.instagram.com/cbitdsc/",
		category: "Coding",
	},
	{
		name: "HICON",
		logo: "/logo/hickon.jpg",
		instagram: "https://www.instagram.com/hicon_cbit/",
		category: "Coding",
	},
	{
		name: "Computer Society of India-CBIT",
		logo: "/logo/csoi.jpg",
		instagram: "https://www.instagram.com/csi_cbit_/",
		category: "Coding",
	},
	{
		name: "Neural Nexus CBIT",
		logo: "/logo/nexus.jpg",
		instagram: "https://www.instagram.com/neuralnexuscbit/",
		category: "Coding",
	},
	{
		name: "VMEDHA",
		logo: "/logo/vmedha.jpg",
		instagram: "https://www.instagram.com/cbit.vmedha/?hl=en",
		category: "Coding",
	},
	{
		name: "IEEE-CBIT",
		logo: "/logo/ieee.jpg",
		instagram: "https://www.instagram.com/ieee_cbit/?hl=en",
		category: "Coding",
	},
	{
		name: "Digital Defense Club",
		logo: "/logo/ddc.jpg",
		instagram: "https://www.instagram.com/ddc_cbit/",
		category: "Cybersecurity",
	},
	{
		name: "CBIT Model United Nations",
		logo: "/logo/mun.jpg",
		instagram: "https://www.instagram.com/cbitmunhyd/?hl=en",
		category: "Debate",
	},
	{
		name: "Communicando",
		logo: "/logo/commindcando.jpg",
		instagram: "https://www.instagram.com/communicando/?hl=en",
		category: "Literary",
	},
	{
		name: "Toastmasters CBIT",
		logo: "/logo/toastmaster.jpg",
		instagram: "https://www.instagram.com/tmcbit/?hl=en",
		category: "Literary",
	},
	{
		name: "Transcendent",
		logo: "/logo/transcendent.jpg",
		instagram: "https://www.instagram.com/transcendent.cbit/",
		category: "Literary",
	},
	{
		name: "Writers and Poets Club",
		logo: "/logo/wpc.jpg",
		instagram: "https://www.instagram.com/wpc_cbit/n",
		category: "Literary",
	},
	{
		name: "CBIT E-sports Club",
		logo: "/logo/esports.jpg",
		instagram: "https://www.instagram.com/cbitesports/?hl=en",
		category: "Gaming",
	},
	{
		name: "EWB-CBIT",
		logo: "/logo/ewb.jpg",
		instagram: "https://www.instagram.com/ewbcbit/?hl=en",
		category: "Service",
	},
	{
		name: "CBIT FinFoundry",
		logo: "/logo/finFoundry.jpg",
		instagram: "https://www.instagram.com/cbit_finfoundry/",
		category: "Finance",
	},
	{
		name: "Ramanujan Maths Club",
		logo: "/logo/maths.jpg",
		instagram: "https://www.instagram.com/rmc.cbit/?hl=en",
		category: "Academic",
	},
	{
		name: "Chaitanya ASTRA",
		logo: "/logo/astra.jpg",
		instagram: "https://www.instagram.com/chaitanyaastra/",
		category: "Aerospace",
	},
	{
		name: "Robotics & Innovation Club CBIT",
		logo: "/logo/robotics.jpg",
		instagram: "https://www.instagram.com/robotics_cbit/",
		category: "Robotics",
	},
	{
		name: "ASME CBIT",
		logo: "/logo/asme.jpg",
		instagram: "https://www.instagram.com/asme.cbit/",
		category: "Mechanical",
	},
	{
		name: "Chaitanya Suraksha",
		logo: "/logo/suraksha.jpg",
		instagram: "https://www.instagram.com/chaitanya_suraksha/",
		category: "Womens Safety",
	},
	{
		name: "Chaitanya Svaasthya",
		logo: "/logo/swasthaya.jpg",
		instagram: "https://www.instagram.com/chaitanya_suraksha/",
		category: "Healthcare",
	},
	{
		name: "Chaitanya Parivrita",
		logo: "/logo/parivartan.jpg",
		instagram: "https://www.instagram.com/chaitanya_parivrita_/",
		category: "Environmental",
	},
	{
		name: "CBITALKS - The Podcast Club",
		logo: "/logo/cbittalks.jpg",
		instagram: "https://www.instagram.com/cbitalks_/",
		category: "Podcast",
	},
	{
		name: "United Dance Crew",
		logo: "/logo/udd.jpg",
		instagram: "https://www.instagram.com/uniteddancecrew/",
		category: "Dance",
	},
	{
		name: "Chaitanya Laasya",
		logo: "/logo/chaitanyalassya.jpg",
		instagram: "https://www.instagram.com/chaitanya_laasya/",
		category: "Dance",
	},
    {
		name: "CBIT Football Club",
		logo: "/logo/cbitFC.jpg",
		instagram: "https://www.instagram.com/cbit.fc/",
		category: "Sports",
	},
	// Add more clubs here if needed
];

export default function ClubsPage() {
	const [search, setSearch] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<ClubCategory | 'All'>('All');

	const categories: (ClubCategory | 'All')[] = [
		'All',
		...Array.from(new Set(clubs.map(club => club.category).filter(Boolean))).sort(),
	];

	const filteredClubs = clubs.filter(club => {
		const matchesCategory =
			selectedCategory === 'All' || club.category === selectedCategory;
		const matchesSearch = club.name
			.toLowerCase()
			.includes(search.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
			<CustomStyles />
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
			<div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-4 px-2 sm:px-4 mt-8 mb-6">
				<input
					type="text"
					placeholder="Search clubs..."
					value={search}
					onChange={e => setSearch(e.target.value)}
					className="w-full sm:w-1/2 rounded-lg px-4 py-2 bg-[#2d2047] border border-[#6441a5] text-white placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
				/>
				<div className="relative w-full sm:w-auto">
					<select
						value={selectedCategory}
						onChange={e =>
							setSelectedCategory(e.target.value as ClubCategory | 'All')
						}
						className="w-full sm:w-48 appearance-none rounded-lg px-4 py-2 bg-[#2d2047] border border-[#6441a5] text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition cursor-pointer"
					>
						{categories.map(category => (
							<option key={category} value={category} className="bg-[#3a206b] text-white">
								{category}
							</option>
						))}
					</select>
					<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-300">
						<svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
					</div>
				</div>
			</div>
			{/* Clubs Grid */}
			<div className="max-w-5xl mx-auto pb-10 px-2 sm:px-4">
				{filteredClubs.length === 0 ? (
					<div className="text-center text-purple-300 py-10 text-lg font-semibold">
						No clubs found.
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">						
						{filteredClubs.map((club, idx) => {
							const IconComponent = iconMap[club.category] || iconMap.Default;
							return (
								<div
									key={idx}
									className="relative bg-[#2d2047] rounded-xl shadow-lg border border-[#6441a5] overflow-hidden transition-transform duration-300 hover:scale-105"
								>
									<div
										className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-lg opacity-20 brightness-125"
										style={{ backgroundImage: `url(${club.logo})` }}
									/>
									<div
										className="absolute top-3 right-3 text-purple-300/80"
										style={{ animation: "float 3s ease-in-out infinite" }}
									>
										<IconComponent className="w-8 h-8" />
									</div>
									<div className="relative flex flex-col items-center p-6 z-10">
										<div className="relative w-28 h-28 mb-4">
											<div
												className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
												style={{ animation: "spin-slow 8s linear infinite" }}
											></div>
											<div className="absolute inset-1.5 flex items-center justify-center rounded-full bg-white">
												<img
													src={club.logo}
													alt={club.name + " logo"}
													className="w-full h-full object-contain rounded-full"
												/>
											</div>
										</div>
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
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
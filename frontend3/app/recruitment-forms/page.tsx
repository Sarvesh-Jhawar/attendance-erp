"use client";

import { useState } from "react";
import Link from "next/link";

const forms = [
	
	
	{
		club: "VMedha ",
		link: "https://docs.google.com/forms/d/e/1FAIpQLSegPmHUj_XA_aN5ECk5d5cLN3bF4QpzrZswLMLcSxOyPKGJGA/viewform",
		lastDate: "N/A",
		eligibility: "2 year",
	},
	{
		club: "CBIT FC",
		link: "https://docs.google.com/forms/d/e/1FAIpQLSf868IQMbg6u8FQ5HmVnRj4f6UgBPoC8l03C5XYNNeJG321VQ/viewform?usp=header",
		lastDate: "N/A",
		eligibility: "1 & 2 year",
	},
	// {
	// 	club: "Chaitanya Spandana",
	// 	link: "https://forms.gle/example2",
	// 	lastDate: "05-09-2025",
	// 	eligibility: "Anyone",
	// },
	// {
	// 	club: "Chaitanya Geethi",
	// 	link: "https://forms.gle/example3",
	// 	lastDate: "10-09-2025",
	// 	eligibility: "Anyone",
	// },
];

export default function RecruitmentFormsPage() {
	const [showAddFormInfo, setShowAddFormInfo] = useState(false);
	const today = new Date();
	today.setHours(0, 0, 0, 0); // Normalize today's date to the start of the day

	const activeForms = forms.filter((form) => {
		if (form.lastDate.toLowerCase() === "n/a") {
			return true; // Always show forms with "N/A" as the last date
		}
		const dateParts = form.lastDate.split("-");
		if (dateParts.length !== 3) {
			return false; // Invalid date format, don't show
		}
		const [day, month, year] = dateParts.map(Number);
		// Note: JavaScript months are 0-indexed (0 for January)
		const lastDate = new Date(year, month - 1, day);

		// To make the last date inclusive, we can compare if it's greater than or equal to today
		return lastDate >= today;
	});

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
			{/* Header */}
			<div
				className="flex items-center justify-between px-4 py-4 sm:px-8"
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
							background:
								"linear-gradient(90deg, #5ea2ef 0%, #b57aff 100%)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
						}}
					>
						Recruitment Forms
					</span>
				</div>
				<button
					onClick={() => setShowAddFormInfo(true)}
					className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 bg-[#2d2047] text-white font-semibold hover:bg-[#3a206b] transition"
				>
					Add a Form
				</button>
			</div>
			{/* Table or No Recruitment Message */}
			<div className="max-w-5xl mx-auto py-10 px-2 sm:px-4">
				{activeForms.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20">
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
							No Recruitment Forms Available
						</h2>
						<p className="text-white/80 text-center">
							There are currently no active recruitment forms. Please check
							back later!
						</p>
					</div>
				) : (
					<div className="bg-[#2d2047] rounded-xl p-0 shadow-lg border border-[#6441a5] overflow-x-auto">
						<table className="w-full text-left min-w-[750px]">
							<thead>
								<tr className="bg-[#6c4bb6] text-white text-base sm:text-lg">
									<th className="py-3 px-4 rounded-tl-xl border-r border-[#6441a5] whitespace-nowrap">
										Club Name
									</th>
									<th className="py-3 px-4 border-r border-[#6441a5] whitespace-nowrap">
										Form Link
									</th>
									<th className="py-3 px-4 border-r border-[#6441a5] whitespace-nowrap">
										Eligibility
									</th>
									<th className="py-3 px-4 rounded-tr-xl whitespace-nowrap">
										Last Date to Apply
									</th>
								</tr>
							</thead>
							<tbody>
								{activeForms.map((form, idx) => (
									<tr key={idx} className="border-t border-[#6441a5]">
										<td className="py-3 px-4 text-white border-r border-[#6441a5] whitespace-nowrap">
											{form.club}
										</td>
										<td className="py-3 px-4 border-r border-[#6441a5] whitespace-nowrap">
											<a
												href={form.link}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-400 underline hover:text-blue-300"
											>
												Apply Here
											</a>
										</td>
										<td className="py-3 px-4 text-white border-r border-[#6441a5] whitespace-nowrap">
											{form.eligibility}
										</td>
										<td className="py-3 px-4 text-white whitespace-nowrap">
											{form.lastDate}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
			{/* Add Form Info Modal */}
			{showAddFormInfo && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
					<div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-black border border-purple-500 rounded-xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 text-white">
						<button
							className="absolute top-4 right-4 text-white/70 text-3xl font-bold hover:text-white transition"
							onClick={() => setShowAddFormInfo(false)}
							aria-label="Close"
						>
							&times;
						</button>
						<h2 className="text-2xl sm:text-3xl font-bold text-purple-300 mb-6 text-center">
							Add a Recruitment Form
						</h2>
						<div className="space-y-4 text-white/90">
							<h3 className="text-lg font-semibold text-purple-200">
								Requirements to add a recruitment form on CBIT ATTENDANCE
								ANALYZER:
							</h3>
							<div className="bg-black/30 p-4 rounded-lg border border-purple-500/30 space-y-1">
								<p className="font-mono">Club Name: [Insert Club Name]</p>
								<p className="font-mono">Eligibility: [Who can apply]</p>
								<p className="font-mono">Form Link: [Insert Link]</p>
								<p className="font-mono">Last Date: [DD-MM-YYYY]</p>
							</div>
							<p className="text-sm text-amber-300/80">
								<span className="font-bold">⚠ Note:</span> The form itself must
								contain a proper description. Forms with unclear or wrong
								motives will not be accepted.
							</p>
							<div className="border-t border-purple-500/50 mt-6 pt-6">
								<h3 className="text-xl font-bold text-purple-300 text-center mb-3">
									Contact Us to Add Form
								</h3>
								<div className="mt-4 flex justify-center items-center gap-x-8 gap-y-4 flex-wrap">
									<a
										href={`https://wa.me/919474254875?text=${encodeURIComponent(
											"Hello! I would like to add a recruitment form to the website.\nHere are the details:\n\nClub Name: \nEligibility: \nForm Link: \nLast Date (DD-MM-YYYY): \n\nThank you."
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
											"Recruitment Form Submission for Website"
										)}&body=${encodeURIComponent(
											"Hello,\n\nI would like to submit a recruitment form for the website.\n\nClub Name:\nEligibility:\nForm Link:\nLast Date (DD-MM-YYYY):\n\nThank you."
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
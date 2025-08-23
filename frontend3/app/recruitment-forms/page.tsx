"use client";

import Link from "next/link";

const forms = [
	{
		club: "Chaitanya Kreeda",
		link: "https://docs.google.com/forms/d/e/1FAIpQLScqwCbSMANFLqbBhT_XFWrUAZxLCzXewwGlIm_kkCW2Mk8T3Q/viewform",
		lastDate: "24-08-2025",
		eligibility: "Anyone",
	},
	{
		club: "ASME CBIT",
		link: "https://forms.gle/C4MxMhg2cNyVUB2V6",
		lastDate: "N/A",
		eligibility: "2 & 3 year",
	},
	{
		club: "CBIT Developer Student Club",
		link: "https://docs.google.com/forms/d/e/1FAIpQLSckb7r8h07usWQHHhq8L9LopY-4h0fLNN925gUkMrLvkhUc4g/viewform",
		lastDate: "27-08-2025",
		eligibility: "2 & 3 year",
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
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
						background:
							"linear-gradient(90deg, #5ea2ef 0%, #b57aff 100%)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
					}}
				>
					Recruitment Forms
				</span>
			</div>
			{/* Table or No Recruitment Message */}
			<div className="max-w-5xl mx-auto py-10 px-2 sm:px-4">
				{forms.length === 0 ? (
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
								{forms.map((form, idx) => (
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
		</div>
	);
}
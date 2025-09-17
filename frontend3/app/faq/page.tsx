"use client";

import Link from "next/link";

const faqs = [
	// {
	// 	q: "How do I check my attendance?",
	// 	a: "After logging in, your dashboard will display your attendance in real time based on ERP data.",
	// },
	// {
	// 	q: "How do the calculator feature works?",
	// 	 a: "The calculator estimates your attendance based only on the classes for which data is currently available. It does not consider the total number of classes scheduled for the entire semester, but rather works with the present attendance records shown in the ERP.",
	// },
	// {
	// 	q: "How often is the attendance updated?",
	// 	a: "Attendance is updated daily based on records from the official ERP portal.",
	// },
	{
		q: "Can I access the website from my phone?",
		a: "Yes, the website is fully responsive and works on mobile, tablet, or desktop.",
	},
	{
		q: "Who can use this platform?",
		a: "The platform is mainly designed for CBIT students, but faculty and staff can also explore its features.",
	},
	// {
	// 	q: "What should I do if I find incorrect data?",
	// 	a: "Contact the admin at projectfeedback86@gmail.com for verification and correction.",
	// },
	{
		q: "How can I feature an upcoming event on the website?",
		a: (
			<>
				Send your event details to projectfeedback86@gmail.com or connect with us on LinkedIn:&nbsp;
				<a
					href="https://www.linkedin.com/in/khharsh/"
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-400 underline"
				>
					K.H.Harsh
				</a>
				&nbsp;or&nbsp;
				<a
					href="https://www.linkedin.com/in/sarvesh-jhawar-515bb42b2/"
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-400 underline"
				>
					Sarvesh Jhawar
				</a>
				.
			</>
		),
	},
	{
		q: "Who can submit events or recruitment forms?",
		a: "Only verified CBIT student clubs, faculty coordinators, or official representatives of organizations can submit through the above contact points.",
	},
	{
		q: "How long will event or recruitment form stay live on the website?",
		a: "Events remain visible until the event date has passed, while recruitment forms stay live until the last application deadline.",
	},
	{
		q: "Is this website searchable on Google or other browsers?",
		a: "Yes. Just search “CBIT Attendance Analyzer” in any browser.",
	},
	{
		q: "Can I suggest new features?",
		a: "Absolutely! You can email your suggestions to projectfeedback86@gmail.com, and we’ll review them for future updates.",
	},
];

export default function FAQPage() {
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
					FAQ
				</span>
			</div>
			<div className="max-w-3xl mx-auto py-10 px-4">
				<h1 className="text-3xl sm:text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
					Frequently Asked Questions (FAQ)
				</h1>
				<div className="space-y-6">
					{faqs.map((faq, idx) => (
						<div
							key={idx}
							className="bg-[#2d2047] rounded-xl border border-[#6441a5] p-5 shadow-md"
						>
							<h2 className="text-lg sm:text-xl font-semibold text-purple-300">
								{faq.q}
							</h2>
							<div className="mt-2 text-sm sm:text-base text-white">
								{faq.a}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
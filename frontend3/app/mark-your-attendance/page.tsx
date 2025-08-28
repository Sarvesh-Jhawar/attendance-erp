"use client";

import React, { useState, useEffect, useMemo } from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

// TypeScript interface for datewise attendance
interface DatewiseAttendanceEntry {
	date: string;
	periods: string[];
}

interface PeriodChange {
	index: number;
	from: string;
	to: string;
}

interface ChangeDetail {
	date: string;
	periodChanges: PeriodChange[];
}

interface AttendanceCounts {
	present: number;
	total: number;
}

const calculateOverall = (data: DatewiseAttendanceEntry[]): AttendanceCounts => {
	let total = 0;
	let present = 0;
	data.forEach((day) => {
		day.periods.forEach((p) => {
			if (p === "P") {
				present++;
				total++;
			} else if (p === "A") {
				total++;
			}
		});
	});
	return { present, total };
};

export default function DatewiseAttendancePage() {
	const [datewiseAttendance, setDatewiseAttendance] = useState<
		DatewiseAttendanceEntry[]
	>([]);
	const [tempAttendance, setTempAttendance] = useState<
		DatewiseAttendanceEntry[]
	>([]);
	const [projectedAttendance, setProjectedAttendance] =
		useState<AttendanceCounts | null>(null);
	const [changes, setChanges] = useState<ChangeDetail[]>([]);
	const [datewiseFilter, setDatewiseFilter] = useState("last5");
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
		const storedDatewiseAttendance = localStorage.getItem("datewiseAttendance");
		if (storedDatewiseAttendance) {
			try {
				const parsedDatewiseAttendance = JSON.parse(storedDatewiseAttendance);
				if (Array.isArray(parsedDatewiseAttendance)) {
					setDatewiseAttendance(parsedDatewiseAttendance);
				} else {
					setDatewiseAttendance([]);
				}
			} catch {
				setDatewiseAttendance([]);
			}
		}
	}, []);

	const filteredData = useMemo(() => {
		if (!datewiseAttendance || datewiseAttendance.length === 0) {
			return [];
		}

		const sortedAttendance = [...datewiseAttendance].sort((a, b) => {
			const dateA = new Date(a.date.split("(")[0].trim());
			const dateB = new Date(b.date.split("(")[0].trim());
			return dateB.getTime() - dateA.getTime();
		});

		switch (datewiseFilter) {
			case "last5":
				return sortedAttendance.slice(0, 5);
			case "last10":
				return sortedAttendance.slice(0, 10);
			case "last20":
				return sortedAttendance.slice(0, 20);
			case "all":
			default:
				return sortedAttendance;
		}
	}, [datewiseAttendance, datewiseFilter]);

	useEffect(() => {
		setTempAttendance(JSON.parse(JSON.stringify(filteredData)));
		setProjectedAttendance(null);
		setChanges([]);
	}, [filteredData]);

	const handleTempAttendanceChange = (
		dateIndex: number,
		periodIndex: number,
		value: string
	) => {
		setProjectedAttendance(null);
		setChanges([]);
		setTempAttendance((currentTempAttendance) => {
			const newTempAttendance = [...currentTempAttendance];
			const newPeriods = [...newTempAttendance[dateIndex].periods];
			newPeriods[periodIndex] = value;
			newTempAttendance[dateIndex] = {
				...newTempAttendance[dateIndex],
				periods: newPeriods,
			};
			return newTempAttendance;
		});
	};

	const originalOverall = useMemo(
		() => calculateOverall(datewiseAttendance),
		[datewiseAttendance]
	);

	const modifiedCells = useMemo(() => {
		const map = new Map<string, Map<number, string>>();
		if (changes) {
			changes.forEach((change) => {
				const periodMap = new Map<number, string>();
				change.periodChanges.forEach((pChange) => {
					// pChange.index is 1-based, so convert to 0-based for array index
					periodMap.set(pChange.index - 1, pChange.to);
				});
				map.set(change.date, periodMap);
			});
		}
		return map;
	}, [changes]);

	const handleCalculate = () => {
		const newChanges: ChangeDetail[] = [];
		tempAttendance.forEach((tempItem, index) => {
			const originalItem = filteredData[index];
			if (originalItem) {
				const periodChanges: PeriodChange[] = [];
				tempItem.periods.forEach((newPeriod, periodIndex) => {
					const originalPeriod = originalItem.periods[periodIndex];
					if (newPeriod !== originalPeriod) {
						periodChanges.push({
							index: periodIndex + 1,
							from: originalPeriod,
							to: newPeriod,
						});
					}
				});
				if (periodChanges.length > 0) {
					newChanges.push({ date: tempItem.date, periodChanges });
				}
			}
		});
		setChanges(newChanges);

		const baseFilteredStats = calculateOverall(filteredData);
		const projectedFilteredStats = calculateOverall(tempAttendance);

		const deltaPresent =
			projectedFilteredStats.present - baseFilteredStats.present;
		const deltaTotal = projectedFilteredStats.total - baseFilteredStats.total;

		setProjectedAttendance({
			present: originalOverall.present + deltaPresent,
			total: originalOverall.total + deltaTotal,
		});
	};

	if (!isClient) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
				<div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
				<span className="text-white text-lg ml-3">Loading...</span>
			</div>
		);
	}

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
				<a
					href="/dashboard"
					className="flex items-center font-medium text-white text-base sm:text-lg"
					style={{ textDecoration: "none" }}
				>
					<span className="flex items-center mr-2">
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
				</a>
				<span
					className="ml-4 text-xl sm:text-3xl font-bold"
					style={{
						letterSpacing: "1px",
						background: "linear-gradient(90deg, #5ea2ef 0%, #b57aff 100%)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
					}}
				>
					Mark your Attendance
				</span>
			</div>
			<div className="bg-yellow-900/30 border-b border-yellow-400/20 text-center p-2 text-sm text-yellow-300/90">
				Note: This feature is still under testing.
			</div>
			<div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
				<Card className="bg-black/40 backdrop-blur-xl border-white/20">
					<CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
						<div>
							<div className="flex items-center gap-3">
								<CardTitle className="text-white text-lg sm:text-xl">
									Date Wise Attendance
								</CardTitle>
							</div>
							<CardDescription className="text-white/70 text-sm mt-1">
								Track your daily attendance across all periods
							</CardDescription>
						</div>
						<div className="flex items-center space-x-2">
							<Dialog>
								<DialogTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="glowing-info-button rounded-full text-white h-9 w-9"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<circle cx="12" cy="12" r="10"></circle>
											<path d="M12 16v-4"></path>
											<path d="M12 8h.01"></path>
										</svg>
										<span className="sr-only">How it works</span>
									</Button>
								</DialogTrigger>
								<DialogContent className="bg-slate-900/80 backdrop-blur-lg border-purple-500/50 text-white">
									<DialogHeader>
										<DialogTitle>How It Works</DialogTitle>
										<DialogDescription className="text-white/70 pt-1">
											This tool helps you project your future attendance
											percentage.
										</DialogDescription>
									</DialogHeader>
									<div className="space-y-3 text-sm text-white/90">
										<p>
											1. The table shows your recent attendance. Days with
											past classes (marked with '-') are editable.
										</p>
										<p>
											2. Use the dropdowns to mark yourself as 'Present' (P)
											or 'Absent' (A) for upcoming classes.
										</p>
										<p>
											3. After making your changes, click the{" "}
											<strong>Calculate</strong> button.
										</p>
										<p>
											4. The summary table will update to show your
											'Projected' attendance percentage and the change from
											your 'Original' percentage.
										</p>
										<div className="p-3 mt-4 bg-yellow-500/10 border-l-4 border-yellow-400 text-yellow-300 rounded-r-md">
											<p className="font-semibold">Important Note:</p>
											<p className="mt-1">
												Please check your personal timetable. This tool does
												not know your free periods. Avoid manually marking
												attendance for periods where you don't have a class.
											</p>
										</div>
									</div>
								</DialogContent>
							</Dialog>
							<Label
								htmlFor="datewise-filter"
								className="text-white/90 text-sm"
							>
								Filter:
							</Label>
							<Select value={datewiseFilter} onValueChange={setDatewiseFilter}>
								<SelectTrigger className="w-32 sm:w-40 bg-white/10 border-white/20 text-white">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
									<SelectItem value="last5" className="text-white">
										Last 5 Days
									</SelectItem>
									<SelectItem value="last10" className="text-white">
										Last 10 Days
									</SelectItem>
									<SelectItem value="last20" className="text-white">
										Last 20 Days
									</SelectItem>
									<SelectItem value="all" className="text-white">
										All
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardHeader>
					<CardContent className="px-2 sm:px-6">
						<div className="flex flex-col sm:flex-row items-center justify-between mb-4 p-4 bg-white/5 rounded-lg">
							<div className="flex-grow w-full">
								{projectedAttendance === null ? (
									<p className="text-white/80 text-sm">
										Original Overall Attendance:{" "}
										<span className="font-bold text-white">
											{`${(
												originalOverall.total > 0
													? (originalOverall.present /
															originalOverall.total) *
													  100
													: 0
											).toFixed(2)}%`}
										</span>
									</p>
								) : (
									(() => {
										const originalPercent =
											originalOverall.total > 0
												? (originalOverall.present /
														originalOverall.total) *
												  100
												: 0;
										const projectedPercent =
											projectedAttendance.total > 0
												? (projectedAttendance.present /
														projectedAttendance.total) *
												  100
												: 0;
										const change = projectedPercent - originalPercent;

										let changeColor = "text-white/70";
										if (change > 0.005) {
											changeColor = "text-green-400";
										} else if (change < -0.005) {
											changeColor = "text-red-400";
										}

										return (
											<Table className="w-full text-sm">
												<TableHeader>
													<TableRow className="border-b-0 hover:bg-transparent">
														<TableHead className="text-white/70 h-auto p-1 pl-0">
															Metric
														</TableHead>
														<TableHead className="text-white/70 h-auto p-1 text-center">
															Original
														</TableHead>
														<TableHead className="text-white/70 h-auto p-1 text-center">
															Projected
														</TableHead>
														<TableHead className="text-white/70 h-auto p-1 text-center">
															Change
														</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													<TableRow className="border-b-0 hover:bg-transparent">
														<TableCell className="font-medium text-white/90 py-1 pl-0">
															Attendance %
														</TableCell>
														<TableCell className="text-center py-1 font-medium text-white/90">
															{originalPercent.toFixed(2)}%
														</TableCell>
														<TableCell className={`text-center py-1 font-medium ${changeColor}`}>
															{projectedPercent.toFixed(2)}%
														</TableCell>
														<TableCell
															className={`text-center font-semibold py-1 ${changeColor}`}
														>
															{change > 0.005 ? "+" : ""}
															{change.toFixed(2)}%
														</TableCell>
													</TableRow>
												</TableBody>
											</Table>
										);
									})()
								)}
							</div>
							<Button
								onClick={handleCalculate}
								className="mt-4 sm:mt-0 sm:ml-4 bg-blue-600 hover:bg-blue-700 text-white"
							>
								Calculate
							</Button>
						</div>
						{tempAttendance.length > 0 ? (
							<div className="overflow-x-auto">
								<Table className="min-w-full border border-white/20 rounded-lg overflow-hidden">
									<TableHeader>
										<TableRow className="border-white/20 bg-white/5">
											<TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4 border-r border-white/20 text-center">
												Date
											</TableHead>
											{["P1", "P2", "P3", "P4", "P5", "P6"].map((p, i) => (
												<TableHead
													key={i}
													className="text-white/90 text-xs sm:text-sm px-2 sm:px-4 border-r border-white/20 text-center"
												>
													{p}
												</TableHead>
											))}
										</TableRow>
									</TableHeader>
									<TableBody>
										{tempAttendance.map((item, index) => (
											<TableRow
												key={index}
												className="border-white/10 hover:bg-white/5"
											>
												<TableCell className="text-white font-medium text-xs sm:text-sm px-2 sm:px-4 border-r border-white/20 text-center">
													{item.date}
												</TableCell>
												{item.periods.map((period, periodIndex) => {
													const isModified = modifiedCells
														.get(item.date)
														?.has(periodIndex);
													const modifiedValue = isModified
														? modifiedCells.get(item.date)?.get(periodIndex)
														: undefined;

													let cellClassName =
														"text-center px-2 sm:px-4 border-r border-white/20 last:border-r-0 transition-colors duration-300";
													if (isModified) {
														if (modifiedValue === "P") {
															cellClassName += " bg-green-500/30";
														} else if (modifiedValue === "A") {
															cellClassName += " bg-red-500/30";
														}
													}

													return (
														<TableCell
															key={periodIndex}
															className={cellClassName}
														>
															{filteredData[index]?.periods[
																periodIndex
															] === "-" ? (
																<Select
																	value={period}
																	onValueChange={(value) =>
																		handleTempAttendanceChange(
																			index,
																			periodIndex,
																			value
																		)
																	}
																>
																	<SelectTrigger className="w-16 h-8 bg-black/50 border-white/20 text-white text-xs mx-auto focus:ring-blue-500">
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
																		<SelectItem
																			value="-"
																			className="text-white"
																		>
																			-
																		</SelectItem>
																		<SelectItem
																			value="P"
																			className="text-green-400"
																		>
																			P
																		</SelectItem>
																		<SelectItem
																			value="A"
																			className="text-red-400"
																		>
																			A
																		</SelectItem>
																	</SelectContent>
																</Select>
															) : (
																<Badge
																	className={`text-xs font-semibold w-6 h-6 flex items-center justify-center ${
																		period === "P"
																			? "bg-green-500/20 text-green-400 border-green-500/30"
																			: period === "A"
																			? "bg-red-500/20 text-red-400 border-red-500/30"
																			: "bg-gray-500/20 text-gray-400 border-gray-500/30"
																	}`}
																>
																	{period}
																</Badge>
															)}
														</TableCell>
													);
												})}
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						) : datewiseAttendance.length > 0 ? (
							<div className="text-center py-8">
								<div className="text-white/60 text-sm mb-2">📅</div>
								<div className="text-white/80 text-base font-medium">
									No data for selected filter
								</div>
								<div className="text-white/60 text-sm mt-1">
									Try selecting a different time period
								</div>
							</div>
						) : (
							<div className="text-center py-8">
								<div className="text-white/60 text-sm mb-2">📅</div>
								<div className="text-white/80 text-base font-medium">
									No datewise attendance data available
								</div>
								<div className="text-white/60 text-sm mt-1">
									This data will be available when you log in
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
			<style jsx>{`
				.glowing-info-button {
					border: none;
					color: white;
					background: linear-gradient(145deg, #5ea2ef, #b57aff);
					animation: button-glow 4s ease-in-out infinite;
					transition: transform 0.2s ease-in-out;
				}

				.glowing-info-button:hover {
					transform: scale(1.05);
				}

				@keyframes button-glow {
					0% {
						box-shadow: 0 0 5px #5ea2ef, 0 0 10px #b57aff;
					}
					50% {
						box-shadow: 0 0 10px #b57aff, 0 0 20px #5ea2ef;
					}
					100% {
						box-shadow: 0 0 5px #5ea2ef, 0 0 10px #b57aff;
					}
				}
			`}</style>
		</div>
	);
}

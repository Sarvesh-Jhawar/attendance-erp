"use client"

import { Label } from "@/components/ui/label"
import React, { useState } from "react";

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut, BarChart3, Info, TrendingUp, TrendingDown, Calendar, BookOpen, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import Sidebar from "@/components/sidebar";

interface AttendanceData {
  sn: number
  subject: string
  faculty: string
  held: number
  attended: number
  percentage: number
  // Additional fields from backend
  maxBunksAllowed?: number
  bunk90?: number
  bunk85?: number
  bunk80?: number
  bunk75?: number
  bunk70?: number
  bunk65?: number
  attend90?: number
  attend85?: number
  attend80?: number
  attend75?: number
  attend70?: number
  attend65?: number
}

export default function Dashboard() {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([])
  const [selectedSubject, setSelectedSubject] = useState("overall")
  const [showCriteria, setShowCriteria] = useState(false)
  const [username, setUsername] = useState("")
  const router = useRouter()
  const { toast } = useToast();
  // Remove showCalculatorDialog state
  // const [showCalculatorDialog, setShowCalculatorDialog] = useState(false)

  const [todayTimetable, setTodayTimetable] = useState<{ period: string; subject: string }[]>([]);
  const [showPlanTodayNote, setShowPlanTodayNote] = useState(false);
  const [datewiseAttendance, setDatewiseAttendance] = useState<DatewiseAttendanceEntry[]>([]);
  const [datewiseFilter, setDatewiseFilter] = useState("last5");
  const [showFeedback, setShowFeedback] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCalcInfo, setShowCalcInfo] = useState(false);

  // TypeScript interface for datewise attendance
  interface DatewiseAttendanceEntry {
    date: string;
    periods: string[];
  }

  useEffect(() => {
    const storedData = localStorage.getItem("attendanceData")
    const storedUsername = localStorage.getItem("bunk_username")
    const storedTimetable = localStorage.getItem("todayTimetable");
    const storedDatewiseAttendance = localStorage.getItem("datewiseAttendance");
    
    // Safely parse timetable data
    if (storedTimetable) {
      try {
        const parsedTimetable = JSON.parse(storedTimetable);
        if (Array.isArray(parsedTimetable)) {
          setTodayTimetable(parsedTimetable);
        } else {
          setTodayTimetable([]);
        }
      } catch {
        setTodayTimetable([]);
      }
    }

    // Safely parse datewise attendance data
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

    if (storedData) {
      setAttendanceData(JSON.parse(storedData))
    }
    if (storedUsername) {
      setUsername(storedUsername)
    }

    // Only one debug: login successful (REMOVE console.log)
    // const loginSuccess = localStorage.getItem("loginSuccess");
    // if (loginSuccess === "true") {
    //   console.log("Login Successful");
    //   setTimeout(() => {
    //     localStorage.removeItem("loginSuccess");
    //   }, 3000);
    // }
    // Instead, just clean up the flag if needed:
    const loginSuccess = localStorage.getItem("loginSuccess");
    if (loginSuccess === "true") {
      setTimeout(() => {
        localStorage.removeItem("loginSuccess");
      }, 3000);
    }
  }, [])

  useEffect(() => {
    setShowPlanTodayNote(true);
    const timer = setTimeout(() => setShowPlanTodayNote(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  const getMarks = (percentage: number) => {
    if (percentage >= 85) return 5
    if (percentage >= 80) return 4
    if (percentage >= 75) return 3
    if (percentage >= 70) return 2
    if (percentage >= 65) return 1
    return 0
  }

  const getStatusColor = (percentage: number) => {
    if (percentage >= 75) return "text-green-400"
    if (percentage >= 65) return "text-yellow-400"
    return "text-red-400"
  }

  const getStatusBadge = (percentage: number) => {
    if (percentage >= 75) return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Safe</Badge>
    if (percentage >= 65)
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Likely to be condonated</Badge>
    return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Likely to be detained</Badge>
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return "bg-green-500"
    if (percentage >= 65) return "bg-yellow-500"
    return "bg-red-500"
  }

  const calculateOverallAttendance = () => {
    // Exclude the total row if present
    const filtered = attendanceData.filter(item => item.subject && item.subject.toLowerCase() !== "total");
    const totalHeld = filtered.reduce((sum, item) => sum + item.held, 0);
    const totalAttended = filtered.reduce((sum, item) => sum + item.attended, 0);
    return totalHeld === 0 ? 0 : (totalAttended / totalHeld) * 100;
  }

  const calculateBunkableClasses = (attended: number, held: number, targetPercent: number, item?: AttendanceData) => {
    // Use pre-calculated values from backend if available
    if (item) {
      switch (targetPercent) {
        case 90: return item.bunk90 || 0
        case 85: return item.bunk85 || 0
        case 80: return item.bunk80 || 0
        case 75: return item.bunk75 || 0
        case 70: return item.bunk70 || 0
        case 65: return item.bunk65 || 0
      }
    }
    
    // Fallback to frontend calculation
    if (held === 0) return 0
    const n = Math.floor((attended * 100) / targetPercent - held)
    return n < 0 ? 0 : n
  }

  const calculateClassesToAttend = (attended: number, held: number, targetPercent: number, item?: AttendanceData) => {
    // Use pre-calculated values from backend if available
    if (item) {
      switch (targetPercent) {
        case 90: return item.attend90 || 0
        case 85: return item.attend85 || 0
        case 80: return item.attend80 || 0
        case 75: return item.attend75 || 0
        case 70: return item.attend70 || 0
        case 65: return item.attend65 || 0
      }
    }
    
    // Fallback to frontend calculation
    if (held === 0) return 0
    const required = (held * (targetPercent / 100) - attended) / (1 - targetPercent / 100)
    const x = Math.ceil(required)
    return x > 0 ? x : 0
  }

  const getSelectedData = () => {
    if (selectedSubject === "overall") {
      const totalRow = attendanceData[attendanceData.length - 1];
      return { attended: totalRow?.attended || 0, held: totalRow?.held || 0 };
    }
    const index = Number.parseInt(selectedSubject)
    return attendanceData[index] || { attended: 0, held: 0 }
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push("/")
  }

  // Function to filter datewise attendance based on selected filter
  const getFilteredDatewiseAttendance = () => {
    if (!datewiseAttendance || datewiseAttendance.length === 0) return [];
    
    // Sort attendance data by date (most recent first)
    const sortedAttendance = [...datewiseAttendance].sort((a, b) => {
      const dateA = new Date(a.date.split('(')[0].trim());
      const dateB = new Date(b.date.split('(')[0].trim());
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
  };

  const overallPercentage = calculateOverallAttendance()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Hamburger Icon beside Dashboard text */}
              <button
                className="flex flex-col justify-center items-center w-10 h-10 bg-slate-900 rounded-md shadow-lg mr-2 relative"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <span className="block w-6 h-0.5 bg-white mb-1"></span>
                <span className="block w-6 h-0.5 bg-white mb-1"></span>
                <span className="block w-6 h-0.5 bg-white"></span>
                {/* Blinking dot */}
                <span
                  className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-orange-400 shadow-lg animate-pulse"
                  style={{ animation: "blinker 1.2s linear infinite" }}
                ></span>
                <style jsx>{`
                  @keyframes blinker {
                    50% { opacity: 0.4; }
                  }
                `}</style>
              </button>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
              {/* Events Button with Animated Text Gradient */}
              <button
                onClick={() => router.push("/events")}
                className="relative border border-white/30 rounded-lg px-2 py-1 text-sm sm:px-4 sm:py-2 sm:text-base text-white bg-transparent hover:bg-white/10 font-semibold flex items-center transition whitespace-nowrap group overflow-hidden"
              >
                {/* Animated Calendar Icon */}
                <svg
                  className="w-4 h-4 mr-1 sm:mr-2 animate-bounce-slow group-hover:animate-bounce-fast"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  style={{ willChange: "transform" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3M16 7V3M4 11h16M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="relative font-bold bg-gradient-to-r from-pink-400 via-yellow-400 to-blue-400 bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-move">
                  Events
                </span>
                <style jsx>{`
                  @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0);}
                    50% { transform: translateY(-6px);}
                  }
                  @keyframes bounce-fast {
                    0%, 100% { transform: translateY(0);}
                    50% { transform: translateY(-12px);}
                  }
                  .animate-bounce-slow {
                    animation: bounce-slow 1.6s infinite;
                  }
                  .group:hover .animate-bounce-slow {
                    animation: bounce-fast 0.7s infinite;
                  }
                  @keyframes gradient-move {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                  }
                  .animate-gradient-move {
                    animation: gradient-move 2.5s ease-in-out infinite;
                  }
                `}</style>
              </button>
              {/* Analytics Button with Animated Text Gradient */}
              <button
                onClick={() => router.push("/analytics")}
                className="border border-white/30 rounded-lg px-2 py-1 text-sm sm:px-4 sm:py-2 sm:text-base text-white bg-transparent hover:bg-white/10 font-semibold flex items-center transition whitespace-nowrap group overflow-hidden"
              >
                <svg className="w-4 h-4 mr-1 sm:mr-2 animate-bounce-slow group-hover:animate-bounce-fast" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ willChange: "transform" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V9m4 8V5m4 12v-4" />
                </svg>
                <span className="relative font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-move-analytics">
                  Analytics
                </span>
                <style jsx>{`
                  @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0);}
                    50% { transform: translateY(-6px);}
                  }
                  @keyframes bounce-fast {
                    0%, 100% { transform: translateY(0);}
                    50% { transform: translateY(-12px);}
                  }
                  .animate-bounce-slow {
                    animation: bounce-slow 1.6s infinite;
                  }
                  .group:hover .animate-bounce-slow {
                    animation: bounce-fast 0.7s infinite;
                  }
                  @keyframes gradient-move-analytics {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                  }
                  .animate-gradient-move-analytics {
                    animation: gradient-move-analytics 2.5s ease-in-out infinite;
                  }
                `}</style>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar overlay */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Themed ERP data note */}
        {/* 
        <div className="mb-2">
          <div className="bg-gradient-to-r from-blue-700/80 via-purple-700/80 to-slate-800/80 text-white text-xs sm:text-sm rounded-xl px-4 py-2 font-semibold shadow-md border border-white/10 inline-block text-left">
            Note: All calculations are based on the latest data of your ERP portal.
          </div>
        </div>
        */}
        {/* Hint block with bulb icon, left aligned and compact */}
        <div className="mb-4">
          <div className="bg-gradient-to-r from-blue-900/70 to-purple-700/70 rounded-xl px-4 py-2 text-white text-left font-semibold text-sm shadow border border-white/20 inline-block">
            <span className="mr-2">💡</span>
            <span className="text-[#5eead4] font-bold">Tip:</span>
            <span className="ml-1 text-white">Always login to get the updated data.</span>
          </div>
        </div>
        {/* Welcome Message */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome back, {username && (username.endsWith('P') || username.endsWith('p')) ? username.slice(0, -1) : username}</h2>
          <p className="text-white/70 text-sm sm:text-base">Here's your attendance overview</p>
        </div>

        {/* Today's Timetable - simple two-row table */}
        {todayTimetable && todayTimetable.length > 0 ? (
          <div className="mb-8">
            <Card className="bg-black/40 backdrop-blur-xl border-white/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <div className="flex flex-row items-center gap-2 relative">
                    <CardTitle className="text-white text-lg sm:text-xl inline-block">Today's Timetable</CardTitle>
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/plan-today")}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-400 hover:from-blue-600 hover:to-purple-700 text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-8 ml-2"
                      >
                        Plan Your Day →
                      </Button>
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg animate-pulse">
                        Click Here
                      </span>
                    </div>
                  </div>
                  <CardDescription className="text-white/70 text-sm">Your schedule for today</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto whitespace-nowrap py-2">
                  <div className="flex flex-row gap-4 min-w-max">
                    {todayTimetable.map((item, idx) => {
                      // If subject is 'Free' or similar, show 'P{number}' and 'Free Period'
                      const isFree = item.subject.trim().toLowerCase() === 'free';
                      let periodLabel = item.period;
                      let subjectLabel = '';
                      if (isFree) {
                        periodLabel = `P${idx + 1}`;
                        subjectLabel = 'Free Period';
                      } else {
                        // Try to find the full subject name from attendanceData
                        subjectLabel = item.subject;
                        if (attendanceData && attendanceData.length > 0) {
                          const code = item.subject.split('(')[0].split(':')[0].trim().toLowerCase();
                          const attMatch = attendanceData.find(a => a.subject.split(':')[0].trim().toLowerCase() === code);
                          if (attMatch) {
                            subjectLabel = attMatch.subject;
                          }
                        }
                      }
                      return (
                        <div
                          key={idx}
                          className="inline-block min-w-[160px] max-w-[240px] bg-white/10 rounded-xl shadow hover:bg-white/20 transition p-4 mx-0 flex flex-col items-center justify-center"
                        >
                          <div className="font-bold text-blue-300 text-xs sm:text-sm mb-1 text-center">{periodLabel}</div>
                          <div className="text-white text-sm sm:text-base text-center font-medium break-words whitespace-pre-line w-full">{subjectLabel}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="mb-8">
            <Card className="bg-black/40 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg sm:text-xl">Today's Timetable</CardTitle>
                <CardDescription className="text-white/70 text-sm">Your schedule for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-white/60 text-sm mb-2">📅</div>
                  <div className="text-white/80 text-base font-medium">No classes scheduled for today</div>
                  <div className="text-white/60 text-sm mt-1">It might be a weekend or holiday</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Overall Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-white/90">Overall Attendance</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="text-xl sm:text-2xl font-bold text-white mb-2">{overallPercentage.toFixed(1)}%</div>
              <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary mb-2">
                <div 
                  className={`h-full flex-1 transition-all ${getProgressColor(overallPercentage)}`}
                  style={{ width: `${overallPercentage}%` }}
                />
              </div>
              {getStatusBadge(overallPercentage)}
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-white/90">Total Classes</CardTitle>
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              {/* Use the last row (Total) for total and attended classes */}
              {(() => {
                const totalRow = attendanceData[attendanceData.length - 1];
                return (
                  <>
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      {totalRow ? totalRow.held : 0}
                    </div>
                    <p className="text-xs text-white/70">
                      {totalRow ? totalRow.attended : 0} attended
                    </p>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="subjects" className="space-y-4 sm:space-y-6">
          {/* Make tab navigation horizontally scrollable on mobile */}
          <div className="w-full overflow-x-auto whitespace-nowrap py-1">
            <TabsList className="bg-black/40 backdrop-blur-xl border-white/20 inline-flex w-max relative px-2">
              <TabsTrigger
                value="subjects"
                className="data-[state=active]:bg-white/20 text-white flex-1 sm:flex-none text-sm sm:text-base"
              >
                Subjects
              </TabsTrigger>
              {/* Divider line */}
              <div className="w-1 h-7 bg-white/80 mx-3 rounded-full inline-block"></div>
                          <div className="relative">
              <TabsTrigger
                value="datewise"
                className="data-[state=active]:bg-white/20 text-white flex-1 sm:flex-none text-sm sm:text-base relative"
              >
                Date Wise
              </TabsTrigger>
              

            </div>
              {/* Divider line */}
              <div className="w-1 h-7 bg-white/80 mx-3 rounded-full inline-block"></div>
              <div className="relative flex-1 sm:flex-none inline-block">
                          <TabsTrigger
                value="calculator"
                className="data-[state=active]:bg-white/20 text-white flex-1 sm:flex-none text-sm sm:text-base"
              >
                Calculator
              </TabsTrigger>

              </div>
            </TabsList>
          </div>

          <TabsContent value="subjects">
            <Card className="bg-black/40 backdrop-blur-xl border-white/20">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 px-4 sm:px-6">
                <div>
                  <CardTitle className="text-white text-lg sm:text-xl">Subject Wise Attendance</CardTitle>
                  <CardDescription className="text-white/70 text-sm">
                    Track your attendance across all subjects
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCriteria(!showCriteria)}
                  className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm"
                >
                  <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Marks Criteria
                </Button>
              </CardHeader>
              <CardContent className="px-2 sm:px-6">
                {showCriteria && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg mx-2 sm:mx-0">
                    <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">Marks Criteria:</h4>
                    <div className="text-xs sm:text-sm text-white/80 space-y-1">
                      <div>≥85% = 5 marks</div>
                      <div>80-84% = 4 marks</div>
                      <div>75-79% = 3 marks</div>
                      <div>70-74% = 2 marks</div>
                      <div>65-69% = 1 mark</div>
                      <div>&lt;65% = 0 marks</div>
                    </div>
                  </div>
                )}

                {/* Mobile-optimized table */}
                <div className="overflow-x-auto">
                  <Table className="min-w-full border border-white/20 rounded-lg overflow-hidden">
                    <TableHeader>
                      <TableRow className="border-white/20">
                        <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4">S/N</TableHead>
                        <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4">Subject</TableHead>
                        <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4 hidden sm:table-cell">
                          Faculty
                        </TableHead>
                        <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4">Held</TableHead>
                        <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4">Att.</TableHead>
                        <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4">%</TableHead>
                        <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4 hidden sm:table-cell">
                          Marks
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceData.map((item, index) => (
                        <TableRow key={item.sn} className="border-white/10">
                          <TableCell className="text-white text-xs sm:text-sm px-2 sm:px-4">
                            {index === attendanceData.length - 1 ? "" : item.sn}
                          </TableCell>
                          <TableCell className="text-white font-medium text-xs sm:text-sm px-2 sm:px-4">
                            <div>
                              <div>{index === attendanceData.length - 1 ? "Total" : item.subject}</div>
                              <div className="text-white/60 text-xs sm:hidden">{index === attendanceData.length - 1 ? "" : item.faculty}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-white/80 text-xs sm:text-sm px-2 sm:px-4 hidden sm:table-cell">
                            {index === attendanceData.length - 1 ? "" : item.faculty}
                          </TableCell>
                          <TableCell className="text-white text-xs sm:text-sm px-2 sm:px-4">{item.held}</TableCell>
                          <TableCell className="text-white text-xs sm:text-sm px-2 sm:px-4">{item.attended}</TableCell>
                          <TableCell
                            className={`font-semibold text-xs sm:text-sm px-2 sm:px-4 ${item.held === 0 && item.attended === 0 ? 'text-white/60' : getStatusColor(item.percentage)}`}
                          >
                            <div>
                              {item.held === 0 && item.attended === 0 ? "0%" : `${item.percentage.toFixed(1)}%`}
                              <div className="text-white/60 text-xs sm:hidden">
                                {index === attendanceData.length - 1
                                  ? ""
                                  : item.held === 0 && item.attended === 0
                                    ? "0 marks"
                                    : (getMarks(item.percentage) > 0 ? `${getMarks(item.percentage)} marks` : "0 marks")}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-white text-xs sm:text-sm px-2 sm:px-4 hidden sm:table-cell">
                            {index === attendanceData.length - 1
                              ? ""
                              : item.held === 0 && item.attended === 0
                                ? "-"
                                : (getMarks(item.percentage) > 0 ? getMarks(item.percentage) : "-")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="datewise">
            <Card className="bg-black/40 backdrop-blur-xl border-white/20">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <div>
                  <CardTitle className="text-white text-lg sm:text-xl">Date Wise Attendance</CardTitle>
                  <CardDescription className="text-white/70 text-sm">
                    Track your daily attendance across all periods
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="relative">
                    <Button
                      onClick={() => router.push("/mark-your-attendance")}
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-400 hover:from-blue-600 hover:to-purple-700 text-sm px-3 h-7"
                    >
                      Mark Your Attendance →
                    </Button>
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-0.5 rounded-full shadow-lg animate-pulse">
                      New
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="datewise-filter" className="text-white/90 text-sm">
                      Filter:
                    </Label>
                    <Select value={datewiseFilter} onValueChange={setDatewiseFilter}>
                      <SelectTrigger className="w-32 sm:w-40 bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                       <SelectItem value="last5" className="text-white">Last 5 Days</SelectItem>
                       <SelectItem value="last10" className="text-white">Last 10 Days</SelectItem>
                       <SelectItem value="last20" className="text-white">Last 20 Days</SelectItem>
                       <SelectItem value="all" className="text-white">All</SelectItem>
                     </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-2 sm:px-6">
                {(() => {
                  const filteredData = getFilteredDatewiseAttendance();
                  return filteredData.length > 0 ? (
                    <div className="overflow-x-auto">
                                         <Table className="min-w-full border border-white/20 rounded-lg overflow-hidden">
                       <TableHeader>
                         <TableRow className="border-white/20 bg-white/5">
                           <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4 border-r border-white/20 text-center">Date</TableHead>
                           <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4 border-r border-white/20 text-center">P1</TableHead>
                           <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4 border-r border-white/20 text-center">P2</TableHead>
                           <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4 border-r border-white/20 text-center">P3</TableHead>
                           <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4 border-r border-white/20 text-center">P4</TableHead>
                           <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4 border-r border-white/20 text-center">P5</TableHead>
                           <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4 text-center">P6</TableHead>
                         </TableRow>
                       </TableHeader>
                       <TableBody>
                         {filteredData.map((item, index) => (
                           <TableRow key={index} className="border-white/10 hover:bg-white/5">
                             <TableCell className="text-white font-medium text-xs sm:text-sm px-2 sm:px-4 border-r border-white/20 text-center">
                               {item.date}
                             </TableCell>
                             {item.periods.map((period, periodIndex) => (
                               <TableCell key={periodIndex} className="text-center px-2 sm:px-4 border-r border-white/20 last:border-r-0">
                                 <Badge 
                                   className={`text-xs font-semibold w-6 h-6 flex items-center justify-center ${
                                     period === 'P' 
                                       ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                       : period === 'A' 
                                         ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                         : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                   }`}
                                 >
                                   {period}
                                 </Badge>
                               </TableCell>
                             ))}
                           </TableRow>
                         ))}
                       </TableBody>
                     </Table>
                  </div>
                                 ) : datewiseAttendance.length > 0 ? (
                   <div className="text-center py-8">
                     <div className="text-white/60 text-sm mb-2">📅</div>
                     <div className="text-white/80 text-base font-medium">No data for selected filter</div>
                     <div className="text-white/60 text-sm mt-1">Try selecting a different time period</div>
                   </div>
                 ) : (
                   <div className="text-center py-8">
                     <div className="text-white/60 text-sm mb-2">📅</div>
                     <div className="text-white/80 text-base font-medium">No datewise attendance data available</div>
                     <div className="text-white/60 text-sm mt-1">This data will be available when you log in</div>
                   </div>
                 );
               })()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculator">
            <div className="space-y-6">
              <Card className="bg-black/40 backdrop-blur-xl border-white/20">
                <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
                  <CardTitle className="text-white">Attendance Calculator</CardTitle>
                  <button
                    className="flex items-center gap-2 border border-red-400 bg-transparent text-red-400 px-2 py-0.5 rounded-md text-sm font-semibold hover:bg-red-400/10 transition h-7 min-h-0"
                    onClick={() => setShowCalcInfo(true)}
                    type="button"
                  >
                    {/* Disclaimer Icon: Red triangle with exclamation */}
                    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24">
                      <polygon points="12,3 22,20 2,20" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <rect x="11" y="10" width="2" height="5" rx="1" fill="currentColor"/>
                      <rect x="11" y="17" width="2" height="2" rx="1" fill="currentColor"/>
                    </svg>
                    <span className="font-semibold text-red-400">Disclaimer</span>
                  </button>
                </CardHeader>
                <Dialog open={showCalcInfo} onOpenChange={setShowCalcInfo}>
  <DialogContent className="max-w-md bg-black text-white">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2 text-red-400 text-lg">
        {/* Disclaimer Icon: Red triangle with exclamation */}
        <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24">
          <polygon points="12,3 22,20 2,20" stroke="currentColor" strokeWidth="2" fill="none"/>
          <rect x="11" y="10" width="2" height="5" rx="1" fill="currentColor"/>
          <rect x="11" y="17" width="2" height="2" rx="1" fill="currentColor"/>
        </svg>
        Disclaimer
      </DialogTitle>
    </DialogHeader>
    <div className="text-xs text-white mt-2 leading-relaxed">
      <b>How the calculator works:</b><br />
      This calculator <span className="text-red-400 font-semibold">does NOT use the total number of classes for the semester</span>.<br />
      It only uses the classes that have already happened and are shown in your ERP right now.<br /><br />
      <span className="text-white/80">
        Because of this, the 'Must Attend' number might sometimes seem impossibly high. This is because the calculation is based only on past data and doesn't know how many classes are remaining in the semester.
      </span>
    </div>
    <DialogFooter>
      <Button onClick={() => setShowCalcInfo(false)} className="mt-4 w-full bg-white text-black hover:bg-gray-200">
        Close
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
                <CardContent>
                  <div className="w-full sm:flex-1">
                    {/* Glowing label above the dropdown */}
                    <div className="mb-2 flex items-center">
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg animate-pulse select-none" style={{ boxShadow: '0 0 8px 2px #a21caf55' }}>
                        Select Subject / Overall
                      </span>
                    </div>
                    <Label htmlFor="subject-select" className="text-white/90 mb-2 block sr-only">
                      Select Subject / Overall
                    </Label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger className="bg-white/10 border-2 border-blue-400 focus:border-purple-500 shadow-lg text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                        <SelectItem value="overall" className="text-white">
                          Overall
                        </SelectItem>
                        {attendanceData.filter(item => item.subject && item.subject.trim() !== "" && item.subject.trim() !== "-").map((item, index) => (
                          <SelectItem key={index} value={index.toString()} className="text-white">
                            {item.subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* --- Summary Table for Selected Subject/Overall --- */}
                  <div className="my-4">
      <div className="overflow-x-auto">
        <Table className="min-w-[340px] border border-white/70 overflow-hidden">
          <TableHeader>
            <TableRow className="bg-white/10 border-b border-white/70">
              <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4 border-r border-white/70 whitespace-nowrap w-[80px]">Selected</TableHead>
              <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4 border-r border-white/70 whitespace-nowrap text-center w-[90px]">Attendance %</TableHead>
              <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4 border-r border-white/70 whitespace-nowrap text-center w-[70px]">Held</TableHead>
              <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap text-center w-[90px]">Attended</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(() => {
              const data = getSelectedData();
              const selectedItem = selectedSubject === "overall"
                ? { subject: "Overall", percentage: overallPercentage, held: data.held, attended: data.attended }
                : attendanceData[Number.parseInt(selectedSubject)];
              return (
                <TableRow className="border-b border-white/70">
                  <TableCell className="text-white font-medium text-xs sm:text-sm px-2 sm:px-4 border-r border-white/70 whitespace-nowrap w-[80px]">
                    {selectedSubject === "overall"
                      ? "Overall"
                      : selectedItem?.subject?.split(":")[0] ?? ""}
                  </TableCell>
                  <TableCell className={`font-semibold text-xs sm:text-sm px-2 sm:px-4 border-r border-white/70 whitespace-nowrap text-center w-[90px] ${selectedItem?.held === 0 && selectedItem?.attended === 0 ? 'text-white/60' : getStatusColor(selectedItem?.percentage ?? 0)}`}>
                    {selectedItem?.held === 0 && selectedItem?.attended === 0 ? "0%" : `${(selectedItem?.percentage ?? overallPercentage).toFixed(1)}%`}
                  </TableCell>
                  <TableCell className="text-white text-xs sm:text-sm px-2 sm:px-4 border-r border-white/70 whitespace-nowrap text-center w-[70px]">{selectedItem?.held ?? 0}</TableCell>
                  <TableCell className="text-white text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap text-center w-[90px]">{selectedItem?.attended ?? 0}</TableCell>
                </TableRow>
              );
            })()}
          </TableBody>
        </Table>
      </div>
    </div>
                  {/* --- End Summary Table --- */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-green-500/10 border-green-500/20">
                      <CardHeader>
                        <CardTitle className="text-green-400 flex items-center gap-2">
                          <TrendingDown className="w-5 h-5 mr-2" />
                          Classes You Can Skip
                          <Popover>
                            <PopoverTrigger asChild>
                              <span className="ml-1 cursor-pointer">
                                <Info className="w-4 h-4 text-white" />
                              </span>
                            </PopoverTrigger>
                            <PopoverContent className="w-72 text-sm">
                              This is how many classes you can miss and still keep your attendance above the target.
                            </PopoverContent>
                          </Popover>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow className="border-green-500/20">
                              <TableHead className="text-green-300">Target %</TableHead>
                              <TableHead className="text-green-300">Can Skip</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[90, 85, 80, 75, 70, 65].map((target) => {
                              const data = getSelectedData()
                              const selectedItem = selectedSubject === "overall" ? undefined : attendanceData[Number.parseInt(selectedSubject)]
                              const canSkip = calculateBunkableClasses(data.attended, data.held, target, selectedItem)
                              return (
                                <TableRow key={target} className="border-green-500/10">
                                  <TableCell className="text-white">≥{target}%</TableCell>
                                  <TableCell className="text-green-400 font-semibold">{canSkip}</TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    <Card className="bg-red-500/10 border-red-500/20">
                      <CardHeader>
                        <CardTitle className="text-red-400 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 mr-2" />
                          Classes You Must Attend
                          <Popover>
                            <PopoverTrigger asChild>
                              <span className="ml-1 cursor-pointer">
                                <Info className="w-4 h-4 text-white" />
                              </span>
                            </PopoverTrigger>
                            <PopoverContent className="w-72 text-sm">
                              This is how many classes you must attend in a row to reach your target attendance percentage.
                            </PopoverContent>
                          </Popover>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow className="border-red-500/20">
                              <TableHead className="text-red-300">Target %</TableHead>
                              <TableHead className="text-red-300">Must Attend</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[90, 85, 80, 75, 70, 65].map((target) => {
                              const data = getSelectedData()
                              const selectedItem = selectedSubject === "overall" ? undefined : attendanceData[Number.parseInt(selectedSubject)]
                              const mustAttend = calculateClassesToAttend(data.attended, data.held, target, selectedItem)
                              return (
                                <TableRow key={target} className="border-red-500/10">
                                  <TableCell className="text-white">≥{target}%</TableCell>
                                  <TableCell className="text-red-400 font-semibold">{mustAttend}</TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            * This data is calculated based on your ERP data. For official records, always refer to your ERP portal.
          </p>
        </div>
      </main>
    </div>
  );
}

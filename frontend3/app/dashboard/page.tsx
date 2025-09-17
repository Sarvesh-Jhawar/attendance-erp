"use client"

import { Label } from "@/components/ui/label"
import React, { useState, Suspense } from "react";

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
import { useRouter, useSearchParams } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import Sidebar from "@/components/sidebar";
import AdvertisementPopup from "@/components/AdvertisementPopup";
/* import StreakTracker from "@/components/StreakTracker"; */

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

function DashboardContent() {
  // const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([])
  // const [selectedSubject, setSelectedSubject] = useState("overall")
  // const [showCriteria, setShowCriteria] = useState(false)
  const [username, setUsername] = useState("")
  const searchParams = useSearchParams();
  const router = useRouter()
  // const { toast } = useToast();
  // Remove showCalculatorDialog state
  // const [showCalculatorDialog, setShowCalculatorDialog] = useState(false)

  // const [todayTimetable, setTodayTimetable] = useState<{ period: string; subject: string }[]>([]);
  // const [showPlanTodayNote, setShowPlanTodayNote] = useState(false);
  // const [datewiseAttendance, setDatewiseAttendance] = useState<DatewiseAttendanceEntry[]>([]);
  // const [datewiseFilter, setDatewiseFilter] = useState("last5");
  // const [showFeedback, setShowFeedback] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [showCalcInfo, setShowCalcInfo] = useState(false);

  // const [streak, setStreak] = useState(0);
  // TypeScript interface for datewise attendance
  // interface DatewiseAttendanceEntry {
  //   date: string;
  //   periods: string[];
  // }

  // Add new interface for EventData
  interface EventData {
    id: number;
    eventName: string;
    clubName: string;
    posterUrl: string;
    link: string;
    endDate: string;
  }
  const [popupEvent, setPopupEvent] = useState<EventData | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    // const storedData = localStorage.getItem("attendanceData")
    const storedUsername = localStorage.getItem("bunk_username")
    // const storedTimetable = localStorage.getItem("todayTimetable");
    // const storedDatewiseAttendance = localStorage.getItem("datewiseAttendance");

    if (storedUsername) {
      setUsername(storedUsername)
    }
  }, [])

  // New useEffect for the popup
  useEffect(() => {
    // Check URL for the 'showAd' parameter.
    const showAd = searchParams.get("showAd");

    // Only show the popup once per session, right after logging in.
    if (showAd === "true") {
      // Use router.replace to remove the query parameter from the URL
      // without adding a new entry to the browser's history.
      router.replace('/dashboard', { scroll: false });

      const popupTimer = setTimeout(() => {
        fetch('/events.json')
          .then(res => res.json())
          .then((events: EventData[]) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Compare dates only

            const validEvent = events.find(event => {
              const endDate = new Date(event.endDate);
              return endDate >= today;
            });

            if (validEvent) {
              setPopupEvent(validEvent);
              setIsPopupOpen(true);
            }
          })
          .catch(err => {
            console.error("Error fetching or processing events.json:", err);
            alert("Could not load the event advertisement. Please check the console for errors and ensure 'public/events.json' exists and is valid.");
          });
      }, 1000); // 1 second delay

      return () => clearTimeout(popupTimer);
    }
  }, [searchParams, router]); // Run only once on mount

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Advertisement Popup */}
      {popupEvent && (
        <AdvertisementPopup
          event={popupEvent}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
      )}

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
              {/* Streak Tracker Button */}
              {/* <StreakTracker streak={streak} /> */}
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
                // onClick={() => router.push("/analytics")}
                className="border border-white/30 rounded-lg px-2 py-1 text-sm sm:px-4 sm:py-2 sm:text-base text-white bg-transparent font-semibold flex items-center transition whitespace-nowrap overflow-hidden opacity-50 cursor-not-allowed"
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
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} onLogout={handleLogout} />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="bg-black/40 backdrop-blur-xl border-white/20 rounded-lg p-6 sm:p-8 text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            🚧 Attendance Feature Under Management Review
          </h2>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed text-center">
            Due to ongoing management review, legal maintenance, and compliance updates, the Attendance feature is temporarily disabled.
            <br />
            All other features of the website remain fully accessible.
          </p>
          <p className="mt-4 text-white/80 text-sm sm:text-base leading-relaxed text-center">
            We appreciate your understanding and patience as we work to ensure everything meets the required standards.
            <br />
            We’ll be right back with the feature as soon as possible.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-slate-900 text-white text-xl">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

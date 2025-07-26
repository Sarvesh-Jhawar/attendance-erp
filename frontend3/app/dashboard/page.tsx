"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut, BarChart3, Info, TrendingUp, TrendingDown, Calendar, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

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
  const [showCalculatorTooltip, setShowCalculatorTooltip] = useState(false)
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [todayTimetable, setTodayTimetable] = useState<{ period: string; subject: string }[]>([]);
  const [showPlanTodayNote, setShowPlanTodayNote] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("attendanceData")
    const storedUsername = localStorage.getItem("bunk_username")
    const storedTimetable = localStorage.getItem("todayTimetable");
    
    // Safely parse timetable data
    if (storedTimetable) {
      try {
        const parsedTimetable = JSON.parse(storedTimetable);
        if (Array.isArray(parsedTimetable)) {
          setTodayTimetable(parsedTimetable);
        } else {
          // If it's not an array (e.g., error object), set empty array
          setTodayTimetable([]);
        }
      } catch (error) {
        console.error("Error parsing timetable:", error);
        setTodayTimetable([]);
      }
    }

    if (storedData) {
      setAttendanceData(JSON.parse(storedData))
    }
    if (storedUsername) {
      setUsername(storedUsername)
    }

    // Show login success message
    // const loginSuccess = localStorage.getItem("loginSuccess")
    // if (loginSuccess === "true") {
    //   setTimeout(() => {
    //     localStorage.removeItem("loginSuccess")
    //   }, 3000)
    //   // Show calculator dialog if not already shown
    //   if (!localStorage.getItem("calculatorDialogShown")) {
    //     setShowCalculatorDialog(true)
    //     localStorage.setItem("calculatorDialogShown", "true")
    //   }
    // }

    // Show one-time tooltip for Calculator tab
    if (!localStorage.getItem("calculatorTooltipShown")) {
      setShowCalculatorTooltip(true)
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowCalculatorTooltip(false)
        localStorage.setItem("calculatorTooltipShown", "true")
      }, 12000) // 12 seconds
    }
    return () => {
      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current)
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
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Likely to be condonation</Badge>
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

  const overallPercentage = calculateOverallAttendance()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/analytics")}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
              >
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden">Chart</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-black/80 backdrop-blur-xl border-white/20" align="end">
                  <DropdownMenuItem onClick={handleLogout} className="text-white hover:bg-white/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Themed ERP data note */}
        <div className="mb-4">
          <div className="bg-gradient-to-r from-blue-700/80 via-purple-700/80 to-slate-800/80 text-white text-xs sm:text-sm rounded-lg px-4 py-2 font-semibold shadow-md border border-white/10">
            Note: All calculations are based on the latest data of your ERP portal.
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
          <TabsList className="bg-black/40 backdrop-blur-xl border-white/20 w-full sm:w-auto relative">
            <TabsTrigger
              value="subjects"
              className="data-[state=active]:bg-white/20 text-white flex-1 sm:flex-none text-sm sm:text-base"
            >
              Subjects
            </TabsTrigger>
            <div className="relative flex-1 sm:flex-none">
              <TabsTrigger
                value="calculator"
                className="data-[state=active]:bg-white/20 text-white flex-1 sm:flex-none text-sm sm:text-base flex items-center justify-center gap-2 relative"
              >
                Calculator
                {/* Badge */}
                <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white animate-pulse shadow-lg select-none">
                  Try this
                </span>
              </TabsTrigger>
              {/* Tooltip/Coach Mark */}
              {showCalculatorTooltip && (
                <div
                  className="z-50 w-max max-w-xs text-black text-xs sm:text-sm rounded-lg px-3 py-2 shadow-lg border border-purple-500 animate-fade-in-up"
                  style={{
                    position: 'absolute',
                    left: '100%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#fff'
                  }}
                >
                  <span className="block text-center">Try this feature! 🎯</span>
                  {/* Arrow for desktop */}
                  <div className="hidden sm:block absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 border-t border-l border-purple-500 rotate-45"
                    style={{ background: '#fff' }}></div>
                  {/* Arrow for mobile (below tab) */}
                  <div className="block sm:hidden absolute left-1/2 -translate-x-1/2 -top-2 w-3 h-3 border-l border-t border-purple-500 rotate-45"
                    style={{ background: '#fff' }}></div>
                  <style>{`
                    @media (max-width: 640px) {
                      .z-50.w-max.max-w-xs.text-black {
                        left: 50% !important;
                        top: 100% !important;
                        transform: translateX(-50%) !important;
                        margin-top: 0.5rem !important;
                      }
                    }
                  `}</style>
                </div>
              )}
            </div>
          </TabsList>

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
                  <Table className="min-w-full">
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

          <TabsContent value="calculator">
            <div className="space-y-6">
              <Card className="bg-black/40 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Attendance Calculator</CardTitle>
                  <CardDescription className="text-white/70">
                    Calculate how many classes you can skip or need to attend
                  </CardDescription>
                  <p className="bg-blue-600/80 text-white text-xs mt-2 px-3 py-2 rounded-lg font-semibold shadow-md flex items-center w-fit">
                    Use the
                    <span className="inline-block align-middle mx-1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info w-4 h-4 inline"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="16" y2="12"></line><line x1="12" x2="12.01" y1="8" y2="8"></line></svg></span>icon for more help.
                  </p>
                </CardHeader>
                <CardContent>
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
      </div>
    </div>
  )
}

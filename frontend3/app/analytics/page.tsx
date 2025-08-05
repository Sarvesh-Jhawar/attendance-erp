"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BarChart3, TrendingUp, Target, Award } from "lucide-react"
import { useRouter } from "next/navigation"
import { ChartContainer } from "@/components/ui/chart"

interface AttendanceData {
  sn: number
  subject: string
  faculty: string
  held: number
  attended: number
  percentage: number
  // Additional fields from backend
  subjectCode?: string
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

export default function Analytics() {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([])
  const [isClient, setIsClient] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    const storedData = localStorage.getItem("attendanceData")
    if (storedData) {
      setAttendanceData(JSON.parse(storedData))
    }
    // Responsive check
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Filter out the '-' subject
  const filteredData = attendanceData.filter(item => item.subject !== "-")

  const chartData = filteredData.map((item) => ({
    subject: item.subject,
    subjectCode: item.subjectCode || item.subject.split(':')[0]?.trim() || item.subject,
    percentage: item.held === 0 && item.attended === 0 ? 0 : item.percentage,
    attended: item.attended,
    held: item.held,
  }))

  const getStatusStats = () => {
    const safe = chartData.filter((item) => item.percentage >= 75).length
    const atRisk = chartData.filter((item) => item.percentage < 75).length
    return { safe, atRisk }
  }

  const stats = getStatusStats()
  const overallPercentage =
    filteredData.length > 0
      ? (filteredData.reduce((sum, item) => sum + item.attended, 0) /
         filteredData.reduce((sum, item) => sum + item.held, 0)) * 100
      : 0

  const getStatusBadge = (percentage: number) => {
    if (percentage >= 75) return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Safe</Badge>
    if (percentage >= 65) return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Likely to be condonated</Badge>
    return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Likely to be detained</Badge>
  }

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"]

  function BarChart({ chartData, isMobile }: { chartData: any[]; isMobile: boolean }) {
    const barWidth = isMobile ? 24 : 40;
    const barSpacing = isMobile ? 50 : 100;
    const extraRightPadding = 70;
    const chartWidth = Math.max(400, chartData.length * barSpacing + extraRightPadding);
    return (
      <div className="w-full overflow-x-auto rounded-lg p-2">
        <svg
          viewBox={`0 0 ${chartWidth} 450`}
          style={{
            minWidth: `${chartWidth}px`,
            maxWidth: "none"
          }}
          className="h-full"
        >
          <defs>
            <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y, i) => (
            <line
              key={i}
              x1="50"
              y1={350 - y * 3}
              x2={chartWidth - 20}
              y2={350 - y * 3}
              stroke="#374151"
              strokeDasharray="2,2"
              strokeWidth="1"
            />
          ))}

          {/* Y-axis labels */}
          {[0, 25, 50, 75, 100].map((y, i) => (
            <text key={i} x="40" y={355 - y * 3} fill="#9CA3AF" fontSize="14" textAnchor="end">
              {y}%
            </text>
          ))}

          {/* Bars */}
          {chartData.map((item, index) => {
            const x = 70 + index * barSpacing;
            const barHeight = (item.percentage / 100) * 300;
            const y = 350 - barHeight;

            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="url(#barGradient)"
                  rx="4"
                  ry="4"
                />
                <text 
                  x={x + barWidth / 2} 
                  y="420" 
                  fill="#9CA3AF" 
                  fontSize={isMobile ? "10" : "12"}
                  textAnchor="middle"
                  className="select-none"
                >
                  {item.subjectCode.length > 8 ? 
                    item.subjectCode.substring(0, 8) + '...' : 
                    item.subjectCode
                  }
                </text>
                <text
                  x={x + barWidth / 2}
                  y={y - 10}
                  fill="#FFFFFF"
                  fontSize={isMobile ? "11" : "13"}
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {item.percentage.toFixed(1)}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50 w-full">
        <div className="w-full px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="text-white hover:bg-white/10 px-2 sm:px-3"
              >
                <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Button>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Analytics
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 w-full">
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-white/90">Overall Attendance</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-2xl font-bold text-white mb-2">{overallPercentage.toFixed(1)}%</div>
              {getStatusBadge(overallPercentage)}
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-white/90">Safe Subjects</CardTitle>
              <Target className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-2xl font-bold text-green-400">{stats.safe}</div>
              <p className="text-xs text-white/70">≥75% attendance</p>
            </CardContent>
          </Card>



          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-white/90">Subjects at Risk</CardTitle>
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-2xl font-bold text-red-400">{stats.atRisk}</div>
              <p className="text-xs text-white/70">&lt;75% attendance</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-white/90">Total Subjects</CardTitle>
              <Award className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-2xl font-bold text-purple-400">{filteredData.length}</div>
              <p className="text-xs text-white/70">Enrolled subjects</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 w-full">
          {/* Bar Chart */}
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader className="px-3 sm:px-6 pb-3">
              <CardTitle className="text-white text-lg sm:text-xl">Subject-wise Attendance</CardTitle>
              <CardDescription className="text-white/70 text-sm">Attendance percentage by subject</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-4">
              <BarChart chartData={chartData} isMobile={isMobile} />
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader className="px-3 sm:px-6 pb-3">
              <CardTitle className="text-white text-lg sm:text-xl">Attendance Distribution</CardTitle>
              <CardDescription className="text-white/70 text-sm">Visual breakdown by subject</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-4">
              <div className="h-[250px] sm:h-[350px] flex items-center justify-center w-full">
                <svg viewBox="0 0 400 400" className="w-full h-full max-w-[280px] sm:max-w-[400px]">
                  {chartData.map((item, index) => {
                    const total = chartData.reduce((sum, d) => sum + d.percentage, 0)
                    const percentage = (item.percentage / total) * 100
                    const angle = (percentage / 100) * 360
                    const startAngle = chartData
                      .slice(0, index)
                      .reduce((sum, d) => sum + (d.percentage / total) * 360, 0)

                    const centerX = 200
                    const centerY = 200
                    const radius = 120

                    const startAngleRad = (startAngle * Math.PI) / 180
                    const endAngleRad = ((startAngle + angle) * Math.PI) / 180

                    const x1 = centerX + radius * Math.cos(startAngleRad)
                    const y1 = centerY + radius * Math.sin(startAngleRad)
                    const x2 = centerX + radius * Math.cos(endAngleRad)
                    const y2 = centerY + radius * Math.sin(endAngleRad)

                    const largeArcFlag = angle > 180 ? 1 : 0

                    const pathData = [
                      `M ${centerX} ${centerY}`,
                      `L ${x1} ${y1}`,
                      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                      "Z",
                    ].join(" ")

                    return (
                      <g key={index}>
                        <path d={pathData} fill={COLORS[index % COLORS.length]} opacity="0.8" />
                      </g>
                    )
                  })}

                  {/* Center circle */}
                  <circle cx="200" cy="200" r="40" fill="rgba(0,0,0,0.8)" />
                  <text x="200" y="205" fill="white" fontSize="16" textAnchor="middle" fontWeight="bold">
                    {overallPercentage.toFixed(1)}%
                  </text>
                </svg>
              </div>

              {/* Legend */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-2 w-full">
                {chartData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-white text-xs sm:text-sm">
                      {item.subjectCode}: {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <Card className="mt-6 bg-black/40 backdrop-blur-xl border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-white">Detailed Analysis</CardTitle>
            <CardDescription className="text-white/70">Subject performance breakdown</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="space-y-3">
              {filteredData.map((item, index) => (
                <div key={item.sn} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <div>
                      <h4 className="text-white font-medium">{item.subject}</h4>
                      <p className="text-white/70 text-sm">{item.faculty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      {item.attended}/{item.held} classes
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        item.percentage >= 75
                          ? "text-green-400"
                          : item.percentage >= 65
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {(item.held === 0 && item.attended === 0) ? '0.0%' : item.percentage.toFixed(1) + '%'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

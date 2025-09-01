"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CheckCircle, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

interface AttendanceData {
  sn: number
  subject: string
  faculty: string
  held: number
  attended: number
  percentage: number
}

interface PeriodPlan {
  period: string
  subject: string
  willAttend: boolean
  originalPercentage: number
  newPercentage: number
  change: number
  isLocked: boolean
  attendanceStatus: string | null
}

function periodSortKey(period: string) {
  const match = period.match(/P(\d+)/i)
  return match ? parseInt(match[1], 10) : 999
}

export default function PlanToday() {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([])
  const [periodPlans, setPeriodPlans] = useState<PeriodPlan[]>([])
  const [showResults, setShowResults] = useState(false)
  const [overallBefore, setOverallBefore] = useState(0)
  const [overallAfter, setOverallAfter] = useState(0)
  const [selectAll, setSelectAll] = useState(false);
  const router = useRouter()

  useEffect(() => {
    const storedAttendance = localStorage.getItem("attendanceData")
    const storedTimetable = localStorage.getItem("todayTimetable")
    const storedDatewiseAttendance = localStorage.getItem("datewiseAttendance")

    if (storedAttendance && storedTimetable) {
      try {
        const parsedAttendance = JSON.parse(storedAttendance)
        const parsedTimetable = JSON.parse(storedTimetable)
        
        setAttendanceData(parsedAttendance)
        
        if (Array.isArray(parsedTimetable)) {
          // Get today's datewise attendance if available
          let todayAttendance: string[] = []
          if (storedDatewiseAttendance) {
            try {
              const datewiseData = JSON.parse(storedDatewiseAttendance)
              const today = new Date().toLocaleDateString('en-US', { 
                month: 'numeric', 
                day: 'numeric', 
                year: 'numeric' 
              })
              
              // Find today's attendance record
              const todayRecord = datewiseData.find((record: any) => {
                const recordDate = record.date.split('(')[0].trim()
                return recordDate === today
              })
              
              if (todayRecord && todayRecord.periods) {
                todayAttendance = todayRecord.periods
              }
            } catch (error) {
              console.error("Error parsing datewise attendance:", error)
            }
          }

          // Build period plans from timetable and match with attendance data
          const plans = parsedTimetable
            .filter(item => item.subject.trim().toLowerCase() !== 'free')
            .map((item, index) => {
              // Find matching attendance data
              const code = item.subject.split('(')[0].split(':')[0].trim().toLowerCase()
              const attMatch = parsedAttendance.find((a: any) => 
                a.subject.split(':')[0].trim().toLowerCase() === code
              )
              
              // Check if attendance was already taken for this period today
              const periodIndex = index // Assuming periods are in order P1, P2, P3, etc.
              const alreadyAttended = todayAttendance[periodIndex]
              const isPresent = alreadyAttended === 'P'
              const isAbsent = alreadyAttended === 'A'
              const isLocked = isPresent || isAbsent // Can't change if already marked
              
                             return {
                 period: item.period,
                 subject: attMatch ? attMatch.subject : item.subject,
                 willAttend: isPresent || (!isLocked && false), // Default to false if not locked
                 originalPercentage: attMatch ? attMatch.percentage : 0,
                 newPercentage: attMatch ? attMatch.percentage : 0,
                 change: 0,
                 isLocked: isLocked,
                 attendanceStatus: alreadyAttended || null
               }
            })
            .sort((a, b) => periodSortKey(a.period) - periodSortKey(b.period))

          setPeriodPlans(plans)
        }
      } catch (error) {
        console.error("Error parsing data:", error)
      }
    }
  }, []) // Removed attendanceData dependency

  const calculateNewPercentage = (subject: string, _willAttend: boolean, _isLocked: boolean) => {
  const att = attendanceData.find(a => a.subject === subject)
  if (!att) return 0

  // Count unlocked periods of this subject
  const subjectPeriods = periodPlans.filter(p => p.subject === subject && !p.isLocked)

  // How many of these are marked as attending
  const willAttendCount = subjectPeriods.filter(p => p.willAttend).length
  const totalCount = subjectPeriods.length

  // Base numbers from attendance data
  const { held, attended } = att

  const newAttended = attended + willAttendCount
  const newHeld = held + totalCount

  return newHeld === 0 ? 0 : (newAttended / newHeld) * 100
}


  const handlePeriodToggle = (index: number, willAttend: boolean) => {
    setPeriodPlans(prev => {
      const updated = [...prev]
      const currentPlan = updated[index]
      
      if (currentPlan) {
        // Update current period
        currentPlan.willAttend = willAttend
        
        // Auto-sync all periods of the same subject
        updated.forEach((plan, idx) => {
          if (idx !== index && plan.subject === currentPlan.subject) {
            plan.willAttend = willAttend
          }
        })
      }

      return updated
    })
    
    // Hide results when selection changes
    setShowResults(false)
  }

  const calculateOverall = (plans: PeriodPlan[], after: boolean) => {
    // Use the same approach as dashboard - get total row from attendance data
    const totalRow = attendanceData[attendanceData.length - 1]
    if (!totalRow) return 0
    
    let totalHeld = totalRow.held
    let totalAttended = totalRow.attended
    
    if (after) {
      // Count only unlocked periods for future calculations
      const unlockedPeriods = plans.filter(plan => !plan.isLocked)
      const willAttendCount = unlockedPeriods.filter(plan => plan.willAttend).length
      
      // Add future periods to total
      totalHeld += unlockedPeriods.length
      totalAttended += willAttendCount
    }
    
    const percentage = totalHeld === 0 ? 0 : (totalAttended / totalHeld) * 100
    
    console.log('Overall Calculation Details:')
    console.log('Total Row - Held:', totalRow.held, 'Attended:', totalRow.attended)
    console.log('Unlocked periods count:', plans.filter(p => !p.isLocked).length)
    console.log('Will attend count:', plans.filter(p => !p.isLocked && p.willAttend).length)
    console.log('After calculation - Total Held:', totalHeld, 'Total Attended:', totalAttended)
    console.log('Percentage:', percentage)
    console.log('After flag:', after)
    
    return percentage
  }

  const handleSubmit = () => {
    setPeriodPlans(prev => {
      const updated = prev.map(plan => {
        const newPercentage = calculateNewPercentage(plan.subject, plan.willAttend, plan.isLocked)
        return {
          ...plan,
          newPercentage,
          change: newPercentage - plan.originalPercentage
        }
      })
      
      const beforeOverall = calculateOverall(updated, false)
      const afterOverall = calculateOverall(updated, true)
      
             console.log('Overall Calculation Debug:')
       console.log('Before Overall:', beforeOverall)
       console.log('After Overall:', afterOverall)
       console.log('Change:', afterOverall - beforeOverall)
       console.log('Period Plans:', updated.map(p => ({
         subject: p.subject.split(':')[0].trim(),
         willAttend: p.willAttend,
         isLocked: p.isLocked,
         originalPercentage: p.originalPercentage,
         newPercentage: p.newPercentage
       })))
       
       // Debug attendance data
       console.log('Attendance Data:', attendanceData.map(att => ({
         subject: att.subject.split(':')[0].trim(),
         held: att.held,
         attended: att.attended,
         percentage: att.percentage
       })))
      
      setOverallBefore(beforeOverall)
      setOverallAfter(afterOverall)
      return updated
    })
    setShowResults(true)
    
    // Auto-scroll to results after a short delay
    setTimeout(() => {
      const resultsElement = document.getElementById('results-section')
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  // Check if all periods are locked
  const allPeriodsLocked = periodPlans.length > 0 && periodPlans.every(plan => plan.isLocked)

  // Add this effect after your other hooks
  useEffect(() => {
    // Only consider unlocked periods
    const unlocked = periodPlans.filter(plan => !plan.isLocked);
    if (unlocked.length === 0) {
      setSelectAll(false);
    } else {
      setSelectAll(unlocked.every(plan => plan.willAttend));
    }
  }, [periodPlans]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Plan Your Day
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-8 py-8">
       
        <Card className="bg-black/40 backdrop-blur-xl border-white/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-white text-xl mb-2">Plan Your Attendance Today</CardTitle>
              {/* Highlighted info icon button */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="ml-2 flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg border-0 ring-2 ring-blue-300/60 transition-all focus:outline-none focus:ring-4 focus:ring-blue-400/70 animate-pulse"
                    aria-label="Info"
                    style={{
                      boxShadow: "0 2px 16px 0 #6366f1aa, 0 1.5px 8px 0 #06b6d4aa"
                    }}
                  >
                    <Info className="w-5 h-5" strokeWidth={2.3} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 text-sm">
                  <div className="font-semibold mb-1">How does this work?</div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Select the periods you <b>plan to attend</b> today.</li>
                    <li>Unselected periods will be marked as <b>absent</b>.</li>
                    <li>If a period is already marked <b>Present</b> or <b>Absent</b>, you can't change it.</li>
                    <li>Click <b>Submit</b> to see how your attendance percentage will change.</li>
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
            <CardDescription className="text-white/80 text-sm leading-relaxed">
              Select the periods you plan to attend. Unselected periods will be marked as absent.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
              {/* Select All Checkbox */}
              <div className="flex items-center mb-4">
                <Checkbox
                  id="select-all-checkbox"
                  checked={selectAll}
                  onCheckedChange={checked => {
                    setSelectAll(checked as boolean);
                    setPeriodPlans(prev =>
                      prev.map(plan =>
                        plan.isLocked ? plan : { ...plan, willAttend: checked as boolean }
                      )
                    );
                    setShowResults(false);
                  }}
                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 border-white/60 bg-white/10 hover:bg-white/20 data-[state=unchecked]:bg-white/20 data-[state=unchecked]:border-white/60 disabled:opacity-50 disabled:cursor-not-allowed mr-2"
                  disabled={periodPlans.length === 0 || periodPlans.every(plan => plan.isLocked)}
                />
                <label
                  htmlFor="select-all-checkbox"
                  className="text-base font-medium text-white select-none cursor-pointer"
                  tabIndex={0}
                  style={{ userSelect: "none" }}
                >
                  Select All
                </label>
              </div>
              <div className="mb-6">
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden border border-white/20 rounded-lg">
                      <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/10">
                          <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-white/90 uppercase tracking-wider sticky left-0 bg-white/10 z-10 border-r border-white/10">
                              Select
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-white/90 uppercase tracking-wider border-r border-white/10">
                              Period
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-white/90 uppercase tracking-wider border-r border-white/10">
                              Subject
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-medium text-white/90 uppercase tracking-wider">
                              Current %
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-transparent">
                          {periodPlans.map((plan, idx) => (
                            <tr
                              key={`${plan.period}-${plan.subject}`}
                              className={`hover:bg-white/5 transition-colors cursor-pointer border-b border-white/10 ${idx === periodPlans.length - 1 ? '' : ''}`}
                              onClick={() => !plan.isLocked && handlePeriodToggle(idx, !plan.willAttend)}
                            >
                              <td className="px-3 py-3 whitespace-nowrap sticky left-0 z-10 border-r border-white/10 bg-black/40">
                                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                  <Checkbox
                                    checked={plan.willAttend}
                                    onCheckedChange={checked => handlePeriodToggle(idx, checked as boolean)}
                                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 border-white/60 bg-white/10 hover:bg-white/20 data-[state=unchecked]:bg-white/20 data-[state=unchecked]:border-white/60 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={plan.isLocked}
                                  />
                                  {plan.isLocked && (
                                    <span className="text-xs text-yellow-400 font-medium">
                                      {plan.attendanceStatus === 'P' ? '✓ Present' : '✗ Absent'}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 py-3 whitespace-nowrap border-r border-white/10">
                                <span className="font-semibold text-blue-300 text-sm">{plan.period}</span>
                              </td>
                              <td className="px-3 py-3 whitespace-nowrap border-r border-white/10">
                                <span className="text-white text-sm">{plan.subject}</span>
                              </td>
                              <td className="px-3 py-3 whitespace-nowrap text-center">
                                <span className="text-white text-sm">{plan.originalPercentage.toFixed(1)}%</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                className={`px-8 py-3 text-lg font-semibold w-full mb-6 ${
                  allPeriodsLocked 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                }`}
                disabled={allPeriodsLocked}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {allPeriodsLocked ? 'Attendance Already Complete' : 'Submit'}
              </Button>
            </form>

            {/* Results shown under submit button */}
            {showResults && (
              <div id="results-section" className="mt-6">
                <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                  Attendance Change
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="ml-1 flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 hover:from-blue-600 hover:to-purple-600 text-white shadow border-0 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-label="Info"
                        style={{
                          boxShadow: "0 2px 8px 0 #6366f1aa, 0 1.5px 4px 0 #06b6d4aa"
                        }}
                      >
                        <Info className="w-4 h-4" strokeWidth={2.2} />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 text-sm">
                      <div className="font-semibold mb-1">What does this table show?</div>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><b>Current %</b>: Your attendance percentage before today's plan.</li>
                        <li><b>After %</b>: Your attendance percentage if you follow this plan.</li>
                        <li><b>Change</b>: How much your attendance will increase or decrease.</li>
                        <li>This helps you see the impact of your choices before submitting.</li>
                      </ul>
                    </PopoverContent>
                  </Popover>
                </h2>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden border border-white/20 rounded-lg">
                      <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/10">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-white/90 uppercase tracking-wider border-r border-white/10">
                              Subject
                            </th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-white/90 uppercase tracking-wider border-r border-white/10">
                              Current %
                            </th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-white/90 uppercase tracking-wider border-r border-white/10">
                              After %
                            </th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-white/90 uppercase tracking-wider">
                              Change
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-transparent">
                          {(() => {
                            // Group by subject to show each subject only once
                            const subjectGroups = new Map<string, PeriodPlan[]>()
                            periodPlans.forEach(plan => {
                              const subjectKey = plan.subject
                              if (!subjectGroups.has(subjectKey)) {
                                subjectGroups.set(subjectKey, [])
                              }
                              subjectGroups.get(subjectKey)!.push(plan)
                            })

                            return Array.from(subjectGroups.entries()).map(([subject, plans], idx, arr) => {
                              // Use the first plan's data for display (they should all be the same for the same subject)
                              const firstPlan = plans[0]
                              const shortForm = firstPlan.subject.split(':')[0].trim()

                              return (
                                <tr
                                  key={subject}
                                  className={`hover:bg-white/5 transition-colors border-b border-white/10 ${idx === arr.length - 1 ? '' : ''}`}
                                >
                                  <td className="px-3 py-2 whitespace-nowrap border-r border-white/10">
                                    <span className="text-white text-sm font-medium">{shortForm}</span>
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-center border-r border-white/10">
                                    <span className="text-white text-sm">{firstPlan.originalPercentage.toFixed(1)}%</span>
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-center border-r border-white/10">
                                    <span
                                      className={`text-sm ${
                                        firstPlan.change > 0
                                          ? 'text-green-400 font-semibold'
                                          : firstPlan.change < 0
                                          ? 'text-red-400 font-semibold'
                                          : firstPlan.willAttend && !firstPlan.isLocked
                                          ? 'text-green-400 font-semibold'
                                          : 'text-white'
                                      }`}
                                    >
                                      {firstPlan.newPercentage.toFixed(1)}%
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-center">
                                    <span className={`text-sm font-medium ${firstPlan.change === 0 ? 'text-white' : firstPlan.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                      {firstPlan.change > 0 ? '+' : ''}{firstPlan.change.toFixed(1)}%
                                    </span>
                                  </td>
                                </tr>
                              )
                            })
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
      <div className="text-white text-base font-semibold mb-1">Overall Attendance</div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="text-white/80">Before: <span className="font-bold">{overallBefore.toFixed(2)}%</span></div>
        <div className="text-white/80">After: <span className={`font-bold ${overallAfter > overallBefore ? 'text-green-400' : overallAfter < overallBefore ? 'text-red-400' : 'text-white'}`}>{overallAfter.toFixed(2)}%</span></div>
        <div className={overallAfter - overallBefore === 0 ? 'text-white font-bold' : (overallAfter - overallBefore > 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold')}>
          Change: {overallAfter - overallBefore > 0 ? '+' : ''}{(overallAfter - overallBefore).toFixed(2)}%
        </div>
      </div>
    </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

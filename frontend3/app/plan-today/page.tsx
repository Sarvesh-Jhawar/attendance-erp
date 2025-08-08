"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

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

  const calculateNewPercentage = (subject: string, willAttend: boolean, isLocked: boolean) => {
    const att = attendanceData.find(a => a.subject === subject)
    if (!att) return 0
    
    // If period is locked (already marked), return original percentage
    if (isLocked) {
      return att.percentage
    }
    
    const { held, attended } = att
    
    // Handle case where no classes have been held yet (both held and attended are 0)
    if (held === 0 && attended === 0) {
      // If this is the first class and student will attend, it becomes 100%
      // If student won't attend, it becomes 0%
      const newPercentage = willAttend ? 100 : 0
      
      console.log(`Subject: ${subject.split(':')[0].trim()}`)
      console.log(`Current: ${attended}/${held} = ${att.percentage}% (No classes held yet)`)
      console.log(`Will Attend: ${willAttend}`)
      console.log(`New: ${willAttend ? 1 : 0}/1 = ${newPercentage}%`)
      console.log(`Change: ${newPercentage - att.percentage}%`)
      
      return newPercentage
    }
    
    // For existing subjects with classes already held
    // For absent: attended stays same, held increases by 1
    // For present: both attended and held increase by 1
    const newAttended = willAttend ? attended + 1 : attended
    const newHeld = held + 1
    
    // Calculate new percentage
    const newPercentage = newHeld === 0 ? 0 : (newAttended / newHeld) * 100
    
    console.log(`Subject: ${subject.split(':')[0].trim()}`)
    console.log(`Current: ${attended}/${held} = ${att.percentage}%`)
    console.log(`Will Attend: ${willAttend}`)
    console.log(`New: ${newAttended}/${newHeld} = ${newPercentage}%`)
    console.log(`Change: ${newPercentage - att.percentage}%`)
    
    return newPercentage
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
                Plan Our Today
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-8 py-8">
        {/* Glowing testing note */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-700/80 via-purple-700/80 to-slate-800/80 text-white text-xs sm:text-sm rounded-lg px-4 py-2 font-semibold shadow-md border border-white/10" style={{ boxShadow: '0 0 8px 2px #1e40af55, 0 0 16px 4px #a21caf55' }}>
            ⚠️ This feature is still <span className="font-bold">under testing</span>.
          </div>
        </div>
        <Card className="bg-black/40 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-xl mb-2">Plan Your Attendance Today</CardTitle>
            <CardDescription className="text-white/80 text-sm leading-relaxed">
              Select the periods you plan to attend. Unselected periods will be marked as absent.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
              <div className="mb-6">
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden border border-white/20 rounded-lg">
                      <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/10">
                          <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-white/90 uppercase tracking-wider sticky left-0 bg-white/10 z-10">
                              Select
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-white/90 uppercase tracking-wider">
                              Period
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-white/90 uppercase tracking-wider">
                              Subject
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-medium text-white/90 uppercase tracking-wider">
                              Current %
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-transparent divide-y divide-white/10">
                                                     {periodPlans.map((plan, idx) => (
                             <tr 
                               key={`${plan.period}-${plan.subject}`} 
                               className="hover:bg-white/5 transition-colors cursor-pointer"
                               onClick={() => !plan.isLocked && handlePeriodToggle(idx, !plan.willAttend)}
                             >
                                                               <td className="px-3 py-3 whitespace-nowrap sticky left-0 z-10">
                                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
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
                               <td className="px-3 py-3 whitespace-nowrap">
                                 <span className="font-semibold text-blue-300 text-sm">{plan.period}</span>
                               </td>
                               <td className="px-3 py-3 whitespace-nowrap">
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
                <h2 className="text-white text-lg font-semibold mb-4">Attendance Change</h2>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden border border-white/20 rounded-lg">
                      <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/10">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-white/90 uppercase tracking-wider">
                              Subject
                            </th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-white/90 uppercase tracking-wider">
                              Current %
                            </th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-white/90 uppercase tracking-wider">
                              After %
                            </th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-white/90 uppercase tracking-wider">
                              Change
                            </th>
                          </tr>
                        </thead>
                                                 <tbody className="bg-transparent divide-y divide-white/10">
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
                             
                             return Array.from(subjectGroups.entries()).map(([subject, plans]) => {
                               // Use the first plan's data for display (they should all be the same for the same subject)
                               const firstPlan = plans[0]
                               const shortForm = firstPlan.subject.split(':')[0].trim()
                               
                               return (
                                 <tr key={subject} className="hover:bg-white/5 transition-colors">
                                   <td className="px-3 py-2 whitespace-nowrap">
                                     <span className="text-white text-sm font-medium">{shortForm}</span>
                                   </td>
                                   <td className="px-3 py-2 whitespace-nowrap text-center">
                                     <span className="text-white text-sm">{firstPlan.originalPercentage.toFixed(1)}%</span>
                                   </td>
                                   <td className="px-3 py-2 whitespace-nowrap text-center">
                                     <span className="text-white text-sm">{firstPlan.newPercentage.toFixed(1)}%</span>
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

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox" 
import { GraduationCap, BookOpen, School, Loader2, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [termsModalOpen, setTermsModalOpen] = useState(false)
  const [errorModal, setErrorModal] = useState({ open: false, message: "" })
  const router = useRouter()

  // Load the initial state from localStorage on component mount
  useEffect(() => {
    const savedTermsAccepted = localStorage.getItem("termsAccepted") === "true";
    setTermsAccepted(savedTermsAccepted);
  }, []); // Empty dependency array ensures this runs only once on mount

  // Save the state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("termsAccepted", String(termsAccepted));
  }, [termsAccepted]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!termsAccepted) {
      setErrorModal({
        open: true,
        message: "Please accept the Terms and Conditions to log in.",
      })
      return
    }

    setIsLoading(true)

    try {
      // Create form data for the Java backend
      const formData = new FormData()
      formData.append("rollno", username)
      formData.append("password", password)

      // Make POST request to Java backend
      const response = await fetch("https://attendance-erp.onrender.com/submit", { // Use deployed backend for production
      // const response = await fetch("http://localhost:8084/submit", { // Use local backend for testing
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        
        // Handle different HTTP status codes and error messages
        let errorMessage = "Login failed. Please try again later."
        
        if (response.status === 500) {
          if (errorText.includes("Python script error")) {
            errorMessage = "Invalid credentials or Server is down."
          } else {
            errorMessage = "System error. Please try again later."
          }
        } else if (response.status === 400) {
          if (errorText.includes("No output from Python script")) {
            errorMessage = "Invalid credentials or Server is down."
          } else if (errorText.includes("Invalid data format")) {
            errorMessage = "System error. Please try again later."
          } else {
            errorMessage = "Invalid request. Please try again."
          }
        } else {
          errorMessage = "Server error. Please try again later."
        }
        
        setErrorModal({ open: true, message: errorMessage })
        return
      }

      // Parse the response data
      const rawData = await response.json();
      // console.log("Raw data received:", rawData);
      // console.log("Datewise attendance data:", rawData.datewiseAttendance);
      // console.log("Datewise attendance data (snake_case):", rawData.datewise_attendance);
      
      const attendanceArray = rawData.attendance || [];
      const timetableArray = rawData.todayTimetable || rawData.today_timetable || [];
      const datewiseAttendanceArray = rawData.datewiseAttendance || rawData.datewise_attendance || [];

      // Validate timetable data - ensure it's an array and handle error objects
      let validTimetableArray = [];
      if (Array.isArray(timetableArray)) {
        validTimetableArray = timetableArray;
      //  console.log("Valid timetable array:", validTimetableArray);
      } else if (timetableArray && typeof timetableArray === 'object' && timetableArray.error) {
        // If it's an error object, use empty array
        console.log("Timetable error:", timetableArray.error);
        validTimetableArray = [];
      } else {
        // Fallback to empty array
        console.log("Timetable is null/undefined, using empty array");
        validTimetableArray = [];
      }

      // Validate datewise attendance data - ensure it's an array and handle error objects
      let validDatewiseAttendanceArray = [];
      if (Array.isArray(datewiseAttendanceArray)) {
        validDatewiseAttendanceArray = datewiseAttendanceArray;
      //  console.log("Valid datewise attendance array:", validDatewiseAttendanceArray);
      } else if (datewiseAttendanceArray && typeof datewiseAttendanceArray === 'object' && datewiseAttendanceArray.error) {
        // If it's an error object, use empty array
        console.log("Datewise attendance error:", datewiseAttendanceArray.error);
        validDatewiseAttendanceArray = [];
      } else {
        // Fallback to empty array
        console.log("Datewise attendance is null/undefined, using empty array");
        validDatewiseAttendanceArray = [];
      }

      // Transform attendance data as before
      const attendanceData = attendanceArray.map((item: any, index: number) => ({
        sn: index + 1,
        subject: item.subject || item.subjectCode || '',
        faculty: item.faculty || '',
        held: parseInt(item.held) || 0,
        attended: parseInt(item.attended) || 0,
        percentage: parseFloat(item.percentage) || 0,
        maxBunksAllowed: item.maxBunksAllowed || 0,
        bunk90: item.bunk90 || 0,
        bunk85: item.bunk85 || 0,
        bunk80: item.bunk80 || 0,
        bunk75: item.bunk75 || 0,
        bunk70: item.bunk70 || 0,
        bunk65: item.bunk65 || 0,
        attend90: item.attend90 || 0,
        attend85: item.attend85 || 0,
        attend80: item.attend80 || 0,
        attend75: item.attend75 || 0,
        attend70: item.attend70 || 0,
        attend65: item.attend65 || 0
      }));

      // Validate data
      if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
        throw new Error("No attendance data received from server");
      }

      // Store user data
      localStorage.setItem("bunk_username", username);
      localStorage.setItem("loginSuccess", "true");
      localStorage.setItem("attendanceData", JSON.stringify(attendanceData));
      localStorage.setItem("todayTimetable", JSON.stringify(validTimetableArray));
      localStorage.setItem("datewiseAttendance", JSON.stringify(validDatewiseAttendanceArray));

      // Navigate to dashboard
      router.push("/dashboard");
    } catch (error) {
      
      // Handle network/connection errors
      let errorMessage = "Cannot connect to server. Please try again later."
      
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage = "Cannot connect to server. Please try again later."
        } else {
          errorMessage = "Network error. Please try again later."
        }
      }

      setErrorModal({ open: true, message: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog open={errorModal.open} onOpenChange={open => setErrorModal({ ...errorModal, open })}>
        <DialogContent className="sm:max-w-md bg-slate-900/80 backdrop-blur-lg border-slate-700 text-slate-200">
          <div className="py-4 text-center text-slate-200">{errorModal.message}</div>
          <DialogFooter>
            <Button onClick={() => setErrorModal({ ...errorModal, open: false })}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={termsModalOpen} onOpenChange={setTermsModalOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px] max-h-[80vh] overflow-y-auto bg-slate-900/80 backdrop-blur-lg border-slate-700 text-slate-200">
          <DialogHeader>
            <DialogTitle className="text-blue-400">Terms and Conditions</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3 text-sm text-slate-300">
            <p>By using this attendance tracking application, you agree to the following:</p>
            <h3 className="font-bold text-slate-100 pt-2">1) Educational Purpose Only</h3>
            <p>This tool is developed solely for students to track and analyze their attendance.</p>
            <p>It is not intended for official record-keeping or replacing the ERP system.</p>
            <h3 className="font-bold text-slate-100 pt-2">2) Read-Only Access</h3>
            <p>The application is strictly read-only.</p>
            <p>Users cannot modify, manipulate, or overwrite any ERP records.</p>
            <p>All data shown is fetched directly from the official ERP and displayed as-is.</p>
            <h3 className="font-bold text-slate-100 pt-2">3) Data Confidentiality</h3>
            <p>Users are responsible for keeping their login credentials safe.</p>
            <p>The application does not permanently store, share, or transmit personal data to third parties.</p>
            <h3 className="font-bold text-slate-100 pt-2">4) Accuracy & Responsibility</h3>
            <p>While efforts are made to display accurate data, the ERP remains the only official source of truth.</p>
            <p>Users should always cross-check important information with the official ERP.</p>
            <h3 className="font-bold text-slate-100 pt-2">5) Limitation of Use</h3>
            <p>Use of this tool is entirely at your own risk.</p>
            <p>The developers are not liable for any discrepancies, misuse, or consequences arising from its use.</p>
            <p className="pt-4 text-xs text-slate-400">Last updated: September 2025</p>
          </div>
          <DialogFooter>
            <Button onClick={() => { setTermsAccepted(true); setTermsModalOpen(false); }} className="bg-blue-500 hover:bg-blue-600">I Agree</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Floating icons - hidden on mobile */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
          <GraduationCap className="absolute top-20 left-20 w-16 h-16 text-white/10 animate-float" />
          <School className="absolute bottom-20 right-20 w-20 h-20 text-white/10 animate-float delay-1000" />
          <BookOpen className="absolute top-1/2 left-10 w-14 h-14 text-white/10 animate-float delay-500" />
          <GraduationCap className="absolute top-20 right-10 w-12 h-12 text-white/10 animate-float delay-700" />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-2 sm:p-4">
          <Card className="w-full max-w-md mx-2 bg-black/40 backdrop-blur-xl border-white/20 shadow-2xl">
            <CardHeader className="text-center space-y-4 px-4 sm:px-6">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Attendance Analyzer
              </CardTitle>
              <CardDescription className="text-blue-300 text-base sm:text-lg">
                Track Your Academic Attendance
              </CardDescription>
              
                             {/* Glassmorphism search accessibility note with shimmer effect */}
               <div className="mt-4 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl relative overflow-hidden shadow-2xl">
                 <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-purple-400/20 rounded-xl"></div>
                 <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl"></div>
                 
                 {/* Shimmer effect - diagonal light sweep */}
                 <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full animate-shimmer"></div>
                 
                                   <div className="relative z-10 flex items-center justify-center">
                    <p className="text-white/90 text-xs sm:text-sm font-medium text-center drop-shadow-sm">
                      💡 <span className="font-semibold text-cyan-300">Tip:</span> Search "CBIT Attendance Analyzer" on any browser!
                    </p>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white/90 text-sm sm:text-base">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400/20 h-11 sm:h-12 text-base"
                    placeholder="Enter your ERP username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/90 text-sm sm:text-base">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400/20 h-11 sm:h-12 text-base pr-10"
                      placeholder="Enter your password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-white/60 hover:text-white hover:bg-transparent"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(checked as boolean)} className="border-white/30 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-400"/>
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/80"
                  >
                    I agree to the{" "}
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-blue-400 hover:text-blue-300"
                      onClick={(e) => {
                        e.preventDefault();
                        setTermsModalOpen(true);
                      }}
                    >
                      Terms and Conditions
                    </Button>
                  </label>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 h-12 sm:h-14 text-base sm:text-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
              <div className="mt-6 space-y-2 text-center">
                <p className="text-yellow-400 text-xs sm:text-sm font-medium">
                  * Use your ERP username and password to login
                </p>
                <p className="text-blue-300 text-xs sm:text-sm font-medium">* Only for CBIT students</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

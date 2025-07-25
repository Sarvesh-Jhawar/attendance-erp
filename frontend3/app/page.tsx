"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, BookOpen, School, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorModal, setErrorModal] = useState({ open: false, message: "" })
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create form data for the Java backend
      const formData = new FormData()
      formData.append("rollno", username)
      formData.append("password", password)

      // Make POST request to Java backend
      const response = await fetch("https://attendance-erp.onrender.com/submit", { // Use deployed backend for production
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
            errorMessage = "Invalid username or password. Please try again."
          } else {
            errorMessage = "System error. Please try again later."
          }
        } else if (response.status === 400) {
          if (errorText.includes("No output from Python script")) {
            errorMessage = "Invalid username or password. Please try again."
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
      const attendanceArray = rawData.attendance || [];
      const timetableArray = rawData.todayTimetable || rawData.today_timetable || [];

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
      localStorage.setItem("todayTimetable", JSON.stringify(timetableArray));

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Error</DialogTitle>
          </DialogHeader>
          <div className="py-2">{errorModal.message}</div>
          <DialogFooter>
            <Button onClick={() => setErrorModal({ ...errorModal, open: false })}>
              OK
            </Button>
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
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400/20 h-11 sm:h-12 text-base"
                    placeholder="Enter your password"
                  />
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

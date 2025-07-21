import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Footer from "@/components/footer"
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Attendance Tracker - Modern Dashboard",
  description: "Track your attendance with style",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>CBIT ERP Attendance Analyzer | Track & Analyze CBIT College Attendance Online</title>
        <meta name="description" content="Attendance Analyzer is the ultimate tool for CBIT Hyderabad students and faculty to track, analyze, and manage attendance records directly from the CBIT ERP portal. Simplify your CBIT attendance management and stay updated with real-time analytics." />
        <meta name="keywords" content="CBIT ERP, CBIT College ERP, CBIT Attendance, CBIT Bees Login, CBIT Hyderabad Attendance, CBIT ERP Portal, College Attendance Analyzer, CBIT Students, CBIT Faculty, Attendance Tracker, CBIT Hyderabad, College ERP Attendance, Bees Login, CBIT Portal" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://attendance-erp-frontend.vercel.app/" />
        <meta property="og:title" content="CBIT ERP Attendance Analyzer | Track & Analyze CBIT College Attendance Online" />
        <meta property="og:description" content="Easily track, analyze, and manage your CBIT Hyderabad attendance records with Attendance Analyzer. Designed for CBIT students and faculty using the ERP portal." />
        <meta property="og:image" content="https://attendance-erp-frontend.vercel.app/placeholder-logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://attendance-erp-frontend.vercel.app/" />
        <meta name="twitter:title" content="CBIT ERP Attendance Analyzer | Track & Analyze CBIT College Attendance Online" />
        <meta name="twitter:description" content="Easily track, analyze, and manage your CBIT Hyderabad attendance records with Attendance Analyzer. Designed for CBIT students and faculty using the ERP portal." />
        <meta name="twitter:image" content="https://attendance-erp-frontend.vercel.app/placeholder-logo.png" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}

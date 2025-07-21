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
        <title>CBIT ERP Attendance Analyzer | CBIT Hyderabad College Attendance & Bees Login Tool</title>
        <meta name="description" content="Easily track, analyze, and manage your CBIT Hyderabad attendance with the CBIT ERP Attendance Analyzer. Designed for CBIT students and faculty, this tool simplifies ERP login, attendance tracking, and analytics. Secure, fast, and made for CBIT Hyderabad." />
        <meta name="keywords" content="CBIT ERP, CBIT ERP Login, CBIT Attendance, CBIT Hyderabad, CBIT Bees Login, CBIT College Attendance, CBIT ERP Portal, College Attendance Analyzer, CBIT Students, CBIT Faculty, Attendance Tracker, Hyderabad College ERP, Bees Login, CBIT Portal, CBIT Attendance Analyzer" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cbit-erp-attendance-analyzer.vercel.app/" />
        <meta property="og:title" content="CBIT ERP Attendance Analyzer | CBIT Hyderabad College Attendance & Bees Login Tool" />
        <meta property="og:description" content="Track and analyze your CBIT Hyderabad attendance with the best ERP tool for students and faculty. Fast, secure, and made for CBIT." />
        <meta property="og:image" content="https://cbit-erp-attendance-analyzer.vercel.app/placeholder-logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://cbit-erp-attendance-analyzer.vercel.app/" />
        <meta name="twitter:title" content="CBIT ERP Attendance Analyzer | CBIT Hyderabad College Attendance & Bees Login Tool" />
        <meta name="twitter:description" content="Track and analyze your CBIT Hyderabad attendance with the best ERP tool for students and faculty. Fast, secure, and made for CBIT." />
        <meta name="twitter:image" content="https://cbit-erp-attendance-analyzer.vercel.app/placeholder-logo.png" />
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

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

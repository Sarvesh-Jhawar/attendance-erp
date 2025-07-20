"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Mail, Linkedin, FileText, Shield, Cookie, AlertTriangle } from "lucide-react"

export default function Footer() {
  const [activeDialog, setActiveDialog] = useState<string | null>(null)

  const legalContent = {
    terms: {
      title: "Terms and Conditions",
      content: `
        <h3 className="text-lg font-semibold mb-4">Terms and Conditions</h3>
        <p className="mb-3">By using this attendance tracking application, you agree to the following terms:</p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>This application is for educational purposes only</li>
          <li>All data is retrieved from official ERP sources</li>
          <li>Users are responsible for maintaining the confidentiality of their credentials</li>
          <li>The application does not store or transmit personal data</li>
          <li>Use of this application is at your own risk</li>
        </ul>
        <p className="text-sm text-gray-400">Last updated: July 2025</p>
      `
    },
    policy: {
      title: "Privacy Policy",
      content: `
        <h3 className="text-lg font-semibold mb-4">Privacy Policy</h3>
        <p className="mb-3">Your privacy is important to us. This policy explains how we handle your data:</p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>No personal data is stored on our servers</li>
          <li>All data is processed locally in your browser</li>
          <li>We do not collect, store, or share your ERP credentials</li>
          <li>Attendance data is only displayed and not permanently stored</li>
          <li>We do not use tracking cookies or analytics</li>
        </ul>
        <p className="text-sm text-gray-400">Last updated: July 2025</p>
      `
    },
    cookies: {
      title: "Cookie Policy",
      content: `
        <h3 className="text-lg font-semibold mb-4">Cookie Policy</h3>
        <p className="mb-3">This application uses minimal cookies for essential functionality:</p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Session cookies for temporary data storage</li>
          <li>No tracking or advertising cookies</li>
          <li>All cookies are cleared when you close your browser</li>
          <li>You can disable cookies, but some features may not work</li>
        </ul>
        <p className="text-sm text-gray-400">Last updated: July 2025</p>
      `
    },
    disclaimer: {
      title: "Disclaimer",
      content: `
        <p className="mb-3">Important information about this application:</p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>This is an unofficial attendance tracking tool</li>
          <li>For official records, always refer to your ERP portal</li>
          <li>We are not affiliated with CBIT or the official ERP system</li>
          <li>Data accuracy depends on the official ERP system</li>
          <li>Use this tool at your own discretion</li>
        </ul>
        <p className="text-sm text-gray-400 mt-4">Last updated: July 2025</p>
      `
    }
  }

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 backdrop-blur-xl border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Copyright and Developers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Attendance Tracker</h3>
            <p className="text-white/70 text-sm">
              A modern attendance tracking application for CBIT students.
            </p>
            <div className="text-white/60 text-xs">
              © 2025 Attendance Tracker. All rights reserved.
            </div>
          </div>

          {/* Developers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Developers</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">SJ</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Sarvesh Jhawar</p>
                  <a
                    href="https://www.linkedin.com/in/sarvesh-jhawar-515bb42b2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-xs flex items-center space-x-1"
                  >
                    <Linkedin className="w-3 h-3" />
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">KH</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">K.H. Harsh</p>
                  <a
                    href="https://www.linkedin.com/in/khharsh/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-xs flex items-center space-x-1"
                  >
                    <Linkedin className="w-3 h-3" />
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Connect with Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Connect with Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Email Support</p>
                  <a
                    href="mailto:projectfeedback86@gmail.com"
                    className="text-blue-400 hover:text-blue-300 text-xs flex items-center space-x-1"
                  >
                    <span>projectfeedback86@gmail.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <p className="text-white/60 text-xs">
                Have feedback or need help? We'd love to hear from you!
              </p>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Legal</h3>
            <div className="space-y-2">
              {Object.entries(legalContent).map(([key, content]) => (
                <Dialog key={key} open={activeDialog === key} onOpenChange={(open) => setActiveDialog(open ? key : null)}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/70 hover:text-white hover:bg-white/10 justify-start p-0 h-auto"
                    >
                      {key === 'terms' && <FileText className="w-4 h-4 mr-2" />}
                      {key === 'policy' && <Shield className="w-4 h-4 mr-2" />}
                      {key === 'cookies' && <Cookie className="w-4 h-4 mr-2" />}
                      {key === 'disclaimer' && <AlertTriangle className="w-4 h-4 mr-2" />}
                      {content.title}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{content.title}</DialogTitle>
                    </DialogHeader>
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: content.content }}
                    />
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-6 bg-white/10" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-white/60 text-xs text-center sm:text-left">
            Made with ❤️ for CBIT students
          </div>
          <div className="text-white/60 text-xs text-center sm:text-right">
            Data source:{" "}
            <a
              href="https://erp.cbit.org.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              CBIT ERP Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import ConditionalNavbar from "@/components/layout/ConditionalNavbar"
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "Task Pilot",
  description: "Task Pilot built with Next.js and Appwrite",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ConditionalNavbar />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "white",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              fontSize: "14px",
            },
            className: "toast-custom",
            duration: 4000,
          }}
          theme="light"
        />
      </body>
    </html>
  )
}

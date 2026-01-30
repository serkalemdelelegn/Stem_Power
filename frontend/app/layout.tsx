import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { AppProvider } from "@/lib/app-context"
import { Chatbot } from "@/components/chatbot"
import { ConditionalChatbot } from "@/components/conditional-chatbot"
import "./globals.css"

export const metadata: Metadata = {
  title: "STEMpower Ethiopia - Empowering Youth Through STEM Education",
  description:
    "STEMpower Ethiopia is dedicated to empowering Ethiopian youth through science, technology, engineering, and mathematics education. Discover our STEM centers, programs, and impact across Ethiopia.",
  generator: "v0.app",
  keywords:
    "STEM education, Ethiopia, youth empowerment, science, technology, engineering, mathematics, education, FabLab, entrepreneurship",
  icons: {
    icon: "/STEMpower_s_logo.png",
    apple: "/STEMpower_s_logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
        <AppProvider>
         
          <Suspense fallback={null}>{children}</Suspense>
          <ConditionalChatbot />
        </AppProvider>
        <Analytics />
      </body>
    </html>
  )
}

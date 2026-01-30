"use client"

import { usePathname } from "next/navigation"
import { Chatbot } from "@/components/chatbot"

export function ConditionalChatbot() {
  const pathname = usePathname()
  
  // Don't show chatbot on admin pages
  if (pathname?.startsWith("/admin")) {
    return null
  }
  
  return <Chatbot />
}


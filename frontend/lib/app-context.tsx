"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "am"

interface AppContextType {
  selectedLanguage: Language
  setSelectedLanguage: (lang: Language) => void
  isSpeaking: boolean
  setIsSpeaking: (speaking: boolean) => void
  speechSynthesis: SpeechSynthesis | null
  handleVoiceReader: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedLanguage, setSelectedLanguageState] = useState<Language>("en")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null)

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis)
    }
  }, [])

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("stempower-language") as Language | null
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "am")) {
      setSelectedLanguageState(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage when it changes
  const setSelectedLanguage = (lang: Language) => {
    setSelectedLanguageState(lang)
    localStorage.setItem("stempower-language", lang)
    console.log("[v0] Language changed globally to:", lang)
  }

  // Voice reader handler that can be called from anywhere
  const handleVoiceReader = () => {
    if (!speechSynthesis) {
      console.log("[v0] Speech synthesis not supported")
      return
    }

    if (isSpeaking) {
      // Stop speaking
      speechSynthesis.cancel()
      setIsSpeaking(false)
      console.log("[v0] Speech stopped")
    } else {
      // Start speaking - read the main content of the page
      const mainContent = document.querySelector("main")
      if (mainContent) {
        const textContent = mainContent.innerText
        const utterance = new SpeechSynthesisUtterance(textContent)

        // Set language based on selected language
        utterance.lang = selectedLanguage === "am" ? "am-ET" : "en-US"
        utterance.rate = 0.9 // Slightly slower for better comprehension
        utterance.pitch = 1

        // Handle speech end
        utterance.onend = () => {
          setIsSpeaking(false)
          console.log("[v0] Speech ended")
        }

        // Handle speech error
        utterance.onerror = (event) => {
          console.log("[v0] Speech error:", event.error)
          setIsSpeaking(false)
        }

        speechSynthesis.speak(utterance)
        setIsSpeaking(true)
        console.log("[v0] Speech started")
      }
    }
  }

  return (
    <AppContext.Provider
      value={{
        selectedLanguage,
        setSelectedLanguage,
        isSpeaking,
        setIsSpeaking,
        speechSynthesis,
        handleVoiceReader,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}

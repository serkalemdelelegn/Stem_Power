"use client"

import Link from "next/link"
import { AdminHeader } from "@/components/ui/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const sections = [
  {
    title: "Hero Section",
    description: "Manage homepage hero carousel slides with images, titles, and CTAs",
    href: "/admin/home/hero",
    icon: "🎬",
  },
  {
    title: "Impact Dashboard",
    description: "Configure impact statistics and metrics showcasing STEMpower's reach",
    href: "/admin/home/impact",
    icon: "📊",
  },
  {
    title: "Student Gallery",
    description: "Showcase student projects and activities across STEM centers",
    href: "/admin/home/gallery",
    icon: "🖼️",
  },
  {
    title: "Partners Showcase",
    description: "Manage partner organizations and logos",
    href: "/admin/home/partners",
    icon: "🤝",
  },
]

export default function HomePage() {
  return (
    <div>
      <AdminHeader title="Home Page" description="Manage all homepage sections and content" />
      <div className="p-6 max-w-6xl">
        <div className="mb-8">
          <p className="text-muted-foreground mb-6">Select a section below to manage homepage content and appearance</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <Link key={section.href} href={section.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="text-4xl mb-2">{section.icon}</div>
                  </div>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group bg-transparent">
                    Manage Section
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

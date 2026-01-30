"use client"

import { AdminHeader } from "@/components/ui/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Bell, Calendar, Newspaper, Share2, Tv } from "lucide-react"
import { LatestDynamicPages } from "@/components/admin/latest-dynamic-pages"

const subSections = [
  {
    name: "Announcements",
    href: "/admin/latest/announcements",
    description: "Official updates, opportunities, and events",
    icon: Bell,
  },
  {
    name: "Events",
    href: "/admin/latest/events",
    description: "Manage workshops, competitions, and activities",
    icon: Calendar,
  },
  {
    name: "Newsletter",
    href: "/admin/latest/newsletter",
    description: "Email newsletters and communications",
    icon: Newspaper,
  },
  {
    name: "Media Coverage",
    href: "/admin/latest/media-coverage",
    description: "Press releases and media mentions",
    icon: Share2,
  },
  {
    name: "Social Media",
    href: "/admin/latest/social-media",
    description: "Social media posts and campaigns",
    icon: Tv,
  },
]

export default function LatestPage() {
  return (
    <div>
      <AdminHeader title="Latest News" description="Manage news, announcements, and communications" />
      <div className="p-6 max-w-6xl">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subSections.map((section) => (
            <Card key={section.href} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00BFA6]/10">
                      <section.icon className="h-5 w-5 text-[#00BFA6]" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{section.name}</CardTitle>
                      <CardDescription className="text-xs">{section.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={section.href}>
                  <Button className="w-full bg-[#00BFA6] hover:bg-[#00A693]">
                    Manage
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dynamic Pages Section */}
        <div className="mt-12">
          <LatestDynamicPages />
        </div>
      </div>
    </div>
  )
}

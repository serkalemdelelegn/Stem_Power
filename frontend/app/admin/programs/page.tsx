"use client"

import { AdminHeader } from "@/components/ui/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Wrench, Lightbulb, Cog } from "lucide-react"

const programs = [
  {
    name: "FabLab",
    href: "/admin/programs/fablab",
    description: "Maker spaces, training, science kits, and fabrication equipment",
    icon: Wrench,
    color: "bg-blue-500",
  },
  {
    name: "Entrepreneurship & Incubation",
    href: "/admin/programs/entrepreneurship",
    description: "Business development, incubation, digital and soft skills training",
    icon: Lightbulb,
    color: "bg-amber-500",
  },
  {
    name: "STEM Operations",
    href: "/admin/programs/stem-operations",
    description: "STEM centers, science fairs, university outreach, and STEM TV",
    icon: Cog,
    color: "bg-purple-500",
  },
]

export default function ProgramsPage() {
  return (
    <div>
      <AdminHeader title="Programs" description="Manage all STEM programs and initiatives" />
      <div className="p-6 max-w-6xl">
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {programs.map((program) => (
            <Card key={program.href} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${program.color}/10`}>
                      <program.icon className={`h-6 w-6 ${program.color.replace("bg-", "text-")}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{program.name}</CardTitle>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm">{program.description}</CardDescription>
                <Link href={program.href} className="block">
                  <Button className="w-full bg-[#00BFA6] hover:bg-[#00A693]">
                    Manage Program
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

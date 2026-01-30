"use client"

import { AdminHeader } from "@/components/ui/admin-header"
import { BackButton } from "@/components/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Building2, Users, ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <div>
      <AdminHeader title="About Us Management" description="Manage all content for the About Us section" />

      <div className="p-6 max-w-7xl">
        <BackButton />

        <div className="grid gap-6 md:grid-cols-2 mt-8">
          {/* STEM Center Card */}
          <Link href="/admin/about/stem-center">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#00BFA6]/10 rounded-lg">
                      <Building2 className="h-6 w-6 text-[#00BFA6]" />
                    </div>
                    <div>
                      <CardTitle>About STEM Center</CardTitle>
                      <CardDescription>Manage STEM center information</CardDescription>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Manage hero section, vision, mission, core values, board members, and testimonials for the About STEM
                  Center page.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* STEMpower Members Card */}
          <Link href="/admin/about/stempower-members">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#00BFA6]/10 rounded-lg">
                      <Users className="h-6 w-6 text-[#00BFA6]" />
                    </div>
                    <div>
                      <CardTitle>STEMpower Members</CardTitle>
                      <CardDescription>Manage team members</CardDescription>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Manage board members and staff members profiles, including images, bios, and positions.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}

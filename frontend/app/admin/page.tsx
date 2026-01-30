"use client"

import { AdminHeader } from "@/components/ui/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Newspaper, Lightbulb, Users } from "lucide-react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

const stats = [
  {
    name: "About Sections",
    value: "2",
    icon: FileText,
    color: "bg-blue-500",
  },
  {
    name: "Programs",
    value: "13",
    icon: Lightbulb,
    color: "bg-[#00BFA6]",
  },
  {
    name: "News Articles",
    value: "5",
    icon: Newspaper,
    color: "bg-purple-500",
  },
  {
    name: "Staff Members",
    value: "12",
    icon: Users,
    color: "bg-green-500",
  },
]

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    // Client-side authentication check as backup
    if (!isAuthenticated()) {
      router.push("/admin/login")
    }
  }, [router])

  return (
    <div>
      <AdminHeader title="Home" description="Welcome to STEMpower Ethiopia Admin Dashboard" />
      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href="/admin/latest/newsletter"
                className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Add Newsletter</div>
                <div className="text-sm text-muted-foreground">Create a new newsletter post</div>
              </a>
              <a
                href="/admin/about/stempower"
                className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Update About</div>
                <div className="text-sm text-muted-foreground">Edit organization information</div>
              </a>
              <a
                href="/admin/programs/stem-operations"
                className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Manage Programs</div>
                <div className="text-sm text-muted-foreground">Update program details</div>
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and changes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-[#00BFA6] mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Dashboard initialized</div>
                  <div className="text-xs text-muted-foreground">Just now</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-gray-300 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium">System ready</div>
                  <div className="text-xs text-muted-foreground">All sections available for editing</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

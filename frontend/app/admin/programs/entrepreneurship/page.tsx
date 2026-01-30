"use client";

import { AdminHeader } from "@/components/ui/admin-header";
import { BackButton } from "@/components/ui/back-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Briefcase, Lightbulb, Code, Users } from "lucide-react";
import { ProgramDynamicPages } from "@/components/admin/program-dynamic-pages";

const subSections = [
  {
    name: "Business Development Services",
    href: "/admin/programs/entrepreneurship/business-development",
    description: "Startup support and mentorship programs",
    icon: Briefcase,
  },
  {
    name: "Incubation",
    href: "/admin/programs/entrepreneurship/incubation",
    description: "Early-stage business incubation and resources",
    icon: Lightbulb,
  },
  {
    name: "Digital Skills",
    href: "/admin/programs/entrepreneurship/digital-skills",
    description: "Technology and digital literacy training",
    icon: Code,
  },
  {
    name: "Soft Skills",
    href: "/admin/programs/entrepreneurship/soft-skills",
    description: "Leadership and communication training",
    icon: Users,
  },
];

export default function EntrepreneurshipPage() {
  return (
    <div>
      <AdminHeader
        title="Entrepreneurship & Incubation"
        description="Manage entrepreneurship program content and offerings"
      />
      <div className="p-6 max-w-6xl">
        <BackButton />

        {/* Main Subsections */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Subsections</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subSections.map((section) => (
              <Card
                key={section.href}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00BFA6]/10">
                        <section.icon className="h-5 w-5 text-[#00BFA6]" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {section.name}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {section.description}
                        </CardDescription>
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
        </div>

        {/* Dynamic Pages Section */}
        <div className="mt-12">
          <ProgramDynamicPages
            program="entrepreneurship"
            programLabel="Entrepreneurship"
          />
        </div>
      </div>
    </div>
  );
}

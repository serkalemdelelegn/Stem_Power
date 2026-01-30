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
import { ArrowRight, Wrench, GraduationCap, Zap } from "lucide-react";
import { ProgramDynamicPages } from "@/components/admin/program-dynamic-pages";

const subSections = [
  {
    name: "Maker Space",
    href: "/admin/programs/fablab/maker-space",
    description: "Creative fabrication labs and workspace management",
    icon: Wrench,
  },
  {
    name: "Training & Consultancy",
    href: "/admin/programs/fablab/training-consultancy",
    description: "Professional development and consulting services",
    icon: GraduationCap,
  },
  {
    name: "Services",
    href: "/admin/programs/fablab/services",
    description: "State of machineries and equipment",
    icon: Zap,
  },
  {
    name: "Products",
    href: "/admin/programs/fablab/products",
    description: "FabLab products and innovations",
    icon: Zap,
  },
];

export default function FabLabPage() {
  return (
    <div>
      <AdminHeader
        title="FabLab"
        description="Manage FabLab programs and facilities"
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
          <ProgramDynamicPages program="fablab" programLabel="FabLab" />
        </div>
      </div>
    </div>
  );
}

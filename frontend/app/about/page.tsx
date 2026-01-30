"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  Globe,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const defaultValues = [
  {
    icon: Target,
    title: "Excellence",
    description:
      "We strive for the highest standards in STEM education and innovation, ensuring quality in everything we do.",
  },
  {
    icon: Users,
    title: "Inclusivity",
    description:
      "We believe every Ethiopian child deserves access to quality STEM education, regardless of background or location.",
  },
  {
    icon: Heart,
    title: "Empowerment",
    description:
      "We empower students, educators, and communities to become agents of positive change through STEM.",
  },
  {
    icon: Globe,
    title: "Innovation",
    description:
      "We foster creativity and innovative thinking to solve local and global challenges through science and technology.",
  },
];

interface StemCenterData {
  id?: number;
  badge?: string;
  title?: string;
  description?: string;
  mission?: string;
  vision?: string;
  statistic?: string;
  values?: Array<{ title: string; description: string }>;
}

interface Member {
  name: string;
  position: string;
  image: string;
  bio: string;
  expertise?: string;
  department?: string;
}

interface MembersData {
  boardMembers: Member[];
  staffMembers: Member[];
}

export default function AboutPage() {
  const [stemCenterData, setStemCenterData] = useState<StemCenterData | null>(
    null
  );
  const [membersData, setMembersData] = useState<MembersData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stemRes = await fetch("/api/about/stem-centers");
        const stemData = await stemRes.json();

        const membersRes = await fetch("/api/about/members");
        const membersData = await membersRes.json();

        console.log("[v0] Loaded stem center data:", stemData);
        console.log("[v0] Loaded members data:", membersData);

        // Handle stem center data - it's an array, get first item
        if (Array.isArray(stemData) && stemData.length > 0) {
          setStemCenterData(stemData[0]);
        } else if (stemData && stemData.id) {
          setStemCenterData(stemData);
        }

        // Transform members array to expected structure
        if (Array.isArray(membersData) && membersData.length > 0) {
          const transformed = {
            boardMembers: membersData
              .filter((m: any) => m.type === "board" && m.is_active !== false)
              .map((m: any) => ({
                name: m.name || "",
                position: m.role || "", // Backend uses 'role', user expects 'position'
                image: m.photo_url || "/placeholder.svg", // Backend uses 'photo_url', user expects 'image'
                bio: m.bio || "",
                expertise: "", // Not in backend, set empty
              })),
            staffMembers: membersData
              .filter((m: any) => m.type === "staff" && m.is_active !== false)
              .map((m: any) => ({
                name: m.name || "",
                position: m.role || "", // Backend uses 'role', user expects 'position'
                image: m.photo_url || "/placeholder.svg", // Backend uses 'photo_url', user expects 'image'
                bio: m.bio || "",
                department: "", // Not in backend, set empty
              })),
          };
          setMembersData(transformed);
        }
      } catch (err) {
        console.error("[v0] Error fetching about page data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const boardMembers = membersData?.boardMembers || [];

  const staffMembers = membersData?.staffMembers || [];

  const values = stemCenterData?.values || [];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-24">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        {stemCenterData && (
          <section className="py-24 bg-linear-to-br from-primary/5 via-background to-accent/5">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                  <Sparkles className="h-4 w-4" />
                  {stemCenterData.badge}
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-balance">
                  {stemCenterData.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-8 text-pretty">
                  {stemCenterData.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-linear-to-r from-primary to-primary/80 hover:scale-105 transition-all"
                    asChild
                  >
                    <Link href="/programs">Explore Our Programs</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="hover:scale-105 transition-all bg-transparent"
                    asChild
                  >
                    <Link href="/contact">Get Involved</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Mission, Vision & Values */}
        {stemCenterData && (
          <section className="py-24">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-3 gap-12 mb-20">
                {/* Mission */}
                <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-linear-to-br from-card to-card/50">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {stemCenterData.mission ||
                      "No mission statement added yet."}
                  </p>
                </Card>

                {/* Vision */}
                <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-linear-to-br from-primary/5 to-accent/5 border-primary/20">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Eye className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {stemCenterData.vision || "No vision statement added yet."}
                  </p>
                </Card>

                {/* Impact */}
                <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-linear-to-br from-card to-card/50">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Our Impact</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {stemCenterData.statistic ||
                      "No impact statement added yet."}
                  </p>
                </Card>
              </div>

              {/* Values */}
              {values.length > 0 && (
                <>
                  <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                      Our Core Values
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                      These fundamental principles guide everything we do and
                      shape our approach to STEM education.
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map(
                      (
                        value: { title: string; description: string },
                        index: number
                      ) => (
                        <Card
                          key={index}
                          className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="h-6 w-6 text-primary" />
                          </div>
                          <h4 className="text-lg font-bold mb-3">
                            {value.title}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {value.description}
                          </p>
                        </Card>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* Board Members */}
        {boardMembers.length > 0 && (
          <section className="py-24 bg-linear-to-br from-muted/30 via-background to-muted/20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Board of Directors
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Our distinguished board members bring decades of experience in
                  education, technology, and leadership.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {boardMembers.map((member: Member, index: number) => (
                  <Card
                    key={index}
                    className="text-center overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="relative">
                      <img
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                      <Badge variant="secondary" className="mb-3">
                        {member.position}
                      </Badge>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {member.bio}
                      </p>
                      <p className="text-xs text-primary font-medium">
                        {member.expertise}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Staff Members */}
        {staffMembers.length > 0 && (
          <section className="py-24">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Our Team
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Meet the dedicated professionals who work tirelessly to
                  deliver exceptional STEM education programs.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {staffMembers.map((member: Member, index: number) => (
                  <Card
                    key={index}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="relative">
                      <img
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-4 right-4 bg-primary/90 text-white">
                        {member.department}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                      <p className="text-primary font-medium mb-3">
                        {member.position}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {member.bio}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="py-24 bg-linear-to-r from-primary/5 to-accent/5">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto text-center bg-linear-to-br from-card to-card/50 border-primary/20">
              <CardContent className="p-12">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Join Our Mission
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Whether you're an educator, student, parent, or community
                  leader, there are many ways to support STEM education in
                  Ethiopia.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-linear-to-r from-primary to-primary/80 hover:scale-105 transition-all"
                    asChild
                  >
                    <Link href="/programs">
                      Explore Programs
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="hover:scale-105 transition-all bg-transparent"
                    asChild
                  >
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

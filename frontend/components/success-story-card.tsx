import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Phone, Mail, Tag, DollarSign } from "lucide-react";

interface SuccessStory {
  name: string;
  owner: string;
  phone: string;
  email: string;
  sector: string;
  status: string;
  donor: string;
  fundingDate: string;
}

const sectorColors: Record<string, string> = {
  Manufacturing: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  "Engineering/Agriculture":
    "bg-green-500/10 text-green-700 border-green-500/20",
  "Technology/Agriculture": "bg-teal-500/10 text-teal-700 border-teal-500/20",
  "Engineering/Service":
    "bg-purple-500/10 text-purple-700 border-purple-500/20",
  "Agriculture/Food":
    "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  "Engineering/Manufacturing":
    "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
  Food: "bg-orange-500/10 text-orange-700 border-orange-500/20",
  "Health/Social Enterprise": "bg-red-500/10 text-red-700 border-red-500/20",
  "Technology/Service": "bg-cyan-500/10 text-cyan-700 border-cyan-500/20",
  Engineering: "bg-slate-500/10 text-slate-700 border-slate-500/20",
  "Service/Food": "bg-amber-500/10 text-amber-700 border-amber-500/20",
  Service: "bg-violet-500/10 text-violet-700 border-violet-500/20",
  "Manufacturing/Product": "bg-sky-500/10 text-sky-700 border-sky-500/20",
  "Manufacturing/Food": "bg-lime-500/10 text-lime-700 border-lime-500/20",
  "Technology/Education":
    "bg-fuchsia-500/10 text-fuchsia-700 border-fuchsia-500/20",
  "Health/Service": "bg-rose-500/10 text-rose-700 border-rose-500/20",
  "Service/Tourism": "bg-pink-500/10 text-pink-700 border-pink-500/20",
  "Food/Agriculture": "bg-green-500/10 text-green-700 border-green-500/20",
  "Manufacturing/product": "bg-blue-500/10 text-blue-700 border-blue-500/20",
  "Engineering/Product":
    "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
};

export function SuccessStoryCard({ story }: { story: SuccessStory }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border overflow-hidden">
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-1.5">
          <div className="w-7 h-7 bg-linear-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <Building2 className="h-3.5 w-3.5 text-white" />
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 text-[9px] px-1.5 py-0">
            {story.status}
          </Badge>
        </div>

        <h3 className="text-xs font-bold text-gray-900 mb-1.5 line-clamp-2 leading-tight min-h-[2rem]">
          {story.name}
        </h3>

        <Badge
          className={`${
            sectorColors[story.sector] || "bg-gray-100 text-gray-700"
          } mb-1 text-[9px] font-medium px-1.5 py-0`}
        >
          <Tag className="h-2 w-2 mr-0.5" />
          {story.sector}
        </Badge>

        <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/20 mb-1.5 text-[9px] font-medium px-1.5 py-0">
          <DollarSign className="h-2 w-2 mr-0.5" />
          {story.donor}
        </Badge>

        <div className="space-y-1 mb-1.5 pt-1.5 border-t">
          <div className="flex items-start gap-1">
            <Users className="h-2.5 w-2.5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[9px] text-muted-foreground line-clamp-2 leading-snug">
                {story.owner}
              </p>
            </div>
          </div>

          {story.phone && (
            <div className="flex items-start gap-1">
              <Phone className="h-2.5 w-2.5 text-emerald-600 shrink-0 mt-0.5" />
              <a
                href={`tel:${story.phone}`}
                className="text-[9px] text-muted-foreground hover:text-emerald-600 transition-colors line-clamp-1"
              >
                {story.phone}
              </a>
            </div>
          )}

          {story.email && (
            <div className="flex items-start gap-1">
              <Mail className="h-2.5 w-2.5 text-emerald-600 shrink-0 mt-0.5" />
              <a
                href={`mailto:${story.email}`}
                className="text-[9px] text-muted-foreground hover:text-emerald-600 transition-colors line-clamp-1 break-all"
              >
                {story.email}
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

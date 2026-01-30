import Header from "@/components/header";
import Footer from "@/components/footer";
import { notFound } from "next/navigation";

type SectionType = "text" | "image" | "cards" | "stats";

interface ContentSection {
  id: string;
  type: SectionType;
  title?: string;
  content?: string;
  imageUrl?: string;
  items?: Array<{ title: string; description: string; icon?: string }>;
}

interface DynamicPage {
  id: string;
  title: string;
  slug: string;
  program?: string;
  description?: string;
  heroImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  ctaText?: string;
  ctaLink?: string;
  sections: ContentSection[];
  status: "draft" | "published";
}

import { BACKEND_URL } from "@/lib/backend-url";

async function fetchPage(slug: string): Promise<DynamicPage | null> {
  const url = `${BACKEND_URL}/api/pages?slug=${encodeURIComponent(
    slug
  )}&status=published&program=${encodeURIComponent("latest")}`;

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return null;

  const data = await response.json();
  if (!data || data.status !== "published") return null;

  return data as DynamicPage;
}

const Section = ({ section }: { section: ContentSection }) => {
  if (section.type === "text") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {section.title && (
          <h3 className="text-xl font-semibold text-slate-900">
            {section.title}
          </h3>
        )}
        {section.content && (
          <p className="mt-3 text-base leading-relaxed text-slate-600 whitespace-pre-line">
            {section.content}
          </p>
        )}
      </div>
    );
  }

  if (section.type === "image") {
    return (
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
        {section.imageUrl ? (
          <img
            src={section.imageUrl}
            alt={section.title || "Dynamic section image"}
            className="h-80 w-full object-cover"
          />
        ) : (
          <div className="flex h-80 w-full items-center justify-center bg-slate-100 text-slate-500">
            Image not provided
          </div>
        )}
        {section.title && (
          <div className="border-t border-slate-100 bg-white px-4 py-3 text-sm text-slate-700">
            {section.title}
          </div>
        )}
      </div>
    );
  }

  if (section.type === "cards") {
    const items = section.items || [];
    return (
      <div className="space-y-3">
        {section.title && (
          <div>
            <h3 className="text-xl font-semibold text-slate-900">
              {section.title}
            </h3>
            {section.content && (
              <p className="text-sm text-slate-600">{section.content}</p>
            )}
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <div
              key={`${section.id}-card-${idx}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">
                    {item.title || "Card"}
                  </h4>
                  {item.description && (
                    <p className="mt-2 text-sm text-slate-600">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section.type === "stats") {
    const items = section.items || [];
    return (
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-cyan-50 p-6 shadow-sm">
        {section.title && (
          <h3 className="text-xl font-semibold text-slate-900">
            {section.title}
          </h3>
        )}
        {section.content && (
          <p className="mt-2 text-sm text-slate-700">{section.content}</p>
        )}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, idx) => (
            <div
              key={`${section.id}-stat-${idx}`}
              className="rounded-xl border border-emerald-100 bg-white/80 p-4 text-center shadow-sm"
            >
              <div className="text-2xl font-bold text-emerald-700">
                {item.title || "—"}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                {item.description || ""}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

async function resolveParams(
  params: { slug: string } | Promise<{ slug: string }>
): Promise<{ slug: string }> {
  if (params instanceof Promise) return params;
  return params;
}

export default async function LatestDynamicPage({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const { slug } = await resolveParams(params);
  const page = await fetchPage(slug);

  if (!page) {
    return notFound();
  }

  const sections = Array.isArray(page.sections)
    ? page.sections
    : typeof page.sections === "string"
    ? (() => {
        try {
          const parsed = JSON.parse(page.sections as unknown as string);
          return Array.isArray(parsed) ? parsed : [];
        } catch (err) {
          console.error("Failed to parse sections", err);
          return [];
        }
      })()
    : [];

  const heroTitle = page.heroTitle || page.title;
  const heroSubtitle = page.heroSubtitle || page.description;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="pb-16">
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
            <div className="absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />
          </div>

          <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-center lg:py-20">
            <div className="flex-1 space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Latest / {page.slug}
              </p>
              <h1 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
                {heroTitle}
              </h1>
              {heroSubtitle && (
                <p className="text-lg text-slate-700">{heroSubtitle}</p>
              )}
              {page.heroDescription && (
                <p className="max-w-3xl text-base leading-relaxed text-slate-600">
                  {page.heroDescription}
                </p>
              )}
              <div className="flex flex-wrap gap-3 pt-4">
                {page.ctaText && page.ctaLink && (
                  <a
                    href={page.ctaLink}
                    className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-700"
                  >
                    {page.ctaText}
                  </a>
                )}
                <a
                  href="#content"
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
                >
                  Explore sections
                </a>
              </div>
            </div>

            <div className="flex-1">
              <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-xl">
                {page.heroImage ? (
                  <img
                    src={page.heroImage}
                    alt={heroTitle}
                    className="h-80 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-80 w-full items-center justify-center bg-slate-100 text-slate-500">
                    Hero image not provided
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/15 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        <section
          id="content"
          className="mx-auto mt-10 flex max-w-6xl flex-col gap-6 px-6"
        >
          {sections.length > 0 ? (
            sections.map((section) => (
              <Section key={section.id} section={section} />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-600">
              Content coming soon.
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}


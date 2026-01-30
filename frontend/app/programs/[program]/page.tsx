import { notFound, redirect } from "next/navigation";

import { BACKEND_URL } from "@/lib/backend-url";

interface DynamicPage {
  id: string;
  title: string;
  slug: string;
  program?: string;
  status: "draft" | "published";
}

async function fetchPage(slug: string): Promise<DynamicPage | null> {
  const url = `${BACKEND_URL}/api/pages?slug=${encodeURIComponent(
    slug
  )}&status=published`;

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return null;

  const data = await response.json();
  if (!data || data.status !== "published") return null;

  return data as DynamicPage;
}

async function resolveParams(
  params: { program: string } | Promise<{ program: string }>
): Promise<{ program: string }> {
  if (params instanceof Promise) return params;
  return params;
}

export default async function ProgramSingleSegmentRedirect({
  params,
}: {
  params: { program: string } | Promise<{ program: string }>;
}) {
  const { program } = await resolveParams(params);
  const page = await fetchPage(program);

  if (!page) {
    return notFound();
  }

  if (page.program) {
    return redirect(`/programs/${page.program}/${page.slug}`);
  }

  return redirect(`/${page.slug}`);
}

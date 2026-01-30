import { getStore } from "@/lib/data-store-v2";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Await params if it's a Promise (Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;
    const data = await req.json();
    const store = getStore();
    const index = store.footer.findIndex((item) => item.id === id);
    if (index === -1)
      return Response.json({ error: "Not found" }, { status: 404 });

    store.footer[index] = { ...store.footer[index], ...data };
    return Response.json(store.footer[index]);
  } catch (error) {
    return Response.json({ error: "Failed to update" }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  // Await params if it's a Promise (Next.js 15+)
  const resolvedParams = params instanceof Promise ? await params : params;
  const id = resolvedParams.id;
  const store = getStore();
  const index = store.footer.findIndex((item) => item.id === id);
  if (index === -1)
    return Response.json({ error: "Not found" }, { status: 404 });

  store.footer.splice(index, 1);
  return Response.json({ success: true });
}

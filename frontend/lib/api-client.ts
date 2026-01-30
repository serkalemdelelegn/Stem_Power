// API client helper functions for making requests to the programs API

export async function fetchPageData(category: string, page: string) {
  const response = await fetch(`/api/programs/${category}/${page}`)
  if (!response.ok) {
    throw new Error("Failed to fetch page data")
  }
  return response.json()
}

export async function updatePageData(category: string, page: string, data: any) {
  const response = await fetch(`/api/programs/${category}/${page}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  })
  if (!response.ok) {
    throw new Error("Failed to update page data")
  }
  return response.json()
}

export async function addSectionItem(category: string, page: string, section: string, data: any) {
  const response = await fetch(`/api/programs/${category}/${page}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ section, data }),
  })
  if (!response.ok) {
    throw new Error("Failed to add item")
  }
  return response.json()
}

export async function updateSectionItem(category: string, page: string, section: string, id: string, data: any) {
  const response = await fetch(`/api/programs/${category}/${page}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ section, id, data }),
  })
  if (!response.ok) {
    throw new Error("Failed to update item")
  }
  return response.json()
}

export async function deleteSectionItem(category: string, page: string, section: string, id: string) {
  const response = await fetch(`/api/programs/${category}/${page}?section=${section}&id=${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete item")
  }
  return response.json()
}

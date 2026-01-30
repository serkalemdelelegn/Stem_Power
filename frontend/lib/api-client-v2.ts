// Client-side API methods for all content sections
// Use this in components and pages to fetch/manage content

const API_BASE = "/api"

export const apiClient = {
  // About Section
  about: {
    stemCenters: {
      getAll: () => fetch(`${API_BASE}/about/stem-centers`).then((r) => r.json()),
      create: (data: any) =>
        fetch(`${API_BASE}/about/stem-centers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      update: (id: string, data: any) =>
        fetch(`${API_BASE}/about/stem-centers/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      delete: (id: string) => fetch(`${API_BASE}/about/stem-centers/${id}`, { method: "DELETE" }).then((r) => r.json()),
    },
    members: {
      getAll: () => fetch(`${API_BASE}/about/members`).then((r) => r.json()),
      create: (data: any) =>
        fetch(`${API_BASE}/about/members`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      update: (id: string, data: any) =>
        fetch(`${API_BASE}/about/members/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      delete: (id: string) => fetch(`${API_BASE}/about/members/${id}`, { method: "DELETE" }).then((r) => r.json()),
    },
  },

  // Contact
  contact: {
    get: () => fetch(`${API_BASE}/contact`).then((r) => r.json()),
    update: (data: any) =>
      fetch(`${API_BASE}/contact`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
  },

  // Footer
  footer: {
    getLinks: () => fetch(`${API_BASE}/footer`).then((r) => r.json()),
    createLink: (data: any) =>
      fetch(`${API_BASE}/footer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    updateLink: (id: string, data: any) =>
      fetch(`${API_BASE}/footer/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    deleteLink: (id: string) => fetch(`${API_BASE}/footer/${id}`, { method: "DELETE" }).then((r) => r.json()),
  },

  // Header
  header: {
    getLinks: () => fetch(`${API_BASE}/header`).then((r) => r.json()),
    createLink: (data: any) =>
      fetch(`${API_BASE}/header`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    updateLink: (id: string, data: any) =>
      fetch(`${API_BASE}/header/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    deleteLink: (id: string) => fetch(`${API_BASE}/header/${id}`, { method: "DELETE" }).then((r) => r.json()),
  },

  // Home
  home: {
    hero: {
      get: () => fetch(`${API_BASE}/home/hero`).then((r) => r.json()),
      create: (data: any) =>
        fetch(`${API_BASE}/home/hero`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      update: (id: string, data: any) =>
        fetch(`${API_BASE}/home/hero/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      delete: (id: string) => fetch(`${API_BASE}/home/hero/${id}`, { method: "DELETE" }).then((r) => r.json()),
    },
    gallery: {
      getAll: () => fetch(`${API_BASE}/home/gallery`).then((r) => r.json()),
      create: (data: any) =>
        fetch(`${API_BASE}/home/gallery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      update: (id: string, data: any) =>
        fetch(`${API_BASE}/home/gallery/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      delete: (id: string) => fetch(`${API_BASE}/home/gallery/${id}`, { method: "DELETE" }).then((r) => r.json()),
    },
    impact: {
      getAll: () => fetch(`${API_BASE}/home/impact`).then((r) => r.json()),
      create: (data: any) =>
        fetch(`${API_BASE}/home/impact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      update: (id: string, data: any) =>
        fetch(`${API_BASE}/home/impact/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      delete: (id: string) => fetch(`${API_BASE}/home/impact/${id}`, { method: "DELETE" }).then((r) => r.json()),
    },
    partners: {
      getAll: () => fetch(`${API_BASE}/home/partners`).then((r) => r.json()),
      create: (data: any) =>
        fetch(`${API_BASE}/home/partners`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      update: (id: string, data: any) =>
        fetch(`${API_BASE}/home/partners/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      delete: (id: string) => fetch(`${API_BASE}/home/partners/${id}`, { method: "DELETE" }).then((r) => r.json()),
    },
  },

  // Latest
  latest: {
    announcements: {
      getAll: () => fetch(`${API_BASE}/latest/announcements`).then((r) => r.json()),
      create: (data: any) =>
        fetch(`${API_BASE}/latest/announcements`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      update: (id: string, data: any) =>
        fetch(`${API_BASE}/latest/announcements/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      delete: (id: string) =>
        fetch(`${API_BASE}/latest/announcements/${id}`, { method: "DELETE" }).then((r) => r.json()),
    },
    events: {
      getAll: () => fetch(`${API_BASE}/latest/events`).then((r) => r.json()),
      create: (data: any) =>
        fetch(`${API_BASE}/latest/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      update: (id: string, data: any) =>
        fetch(`${API_BASE}/latest/events/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      delete: (id: string) => fetch(`${API_BASE}/latest/events/${id}`, { method: "DELETE" }).then((r) => r.json()),
    },
    newsletter: {
      getAll: () => fetch(`${API_BASE}/latest/newsletter`).then((r) => r.json()),
      create: (data: any) =>
        fetch(`${API_BASE}/latest/newsletter`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      update: (id: string, data: any) =>
        fetch(`${API_BASE}/latest/newsletter/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      delete: (id: string) => fetch(`${API_BASE}/latest/newsletter/${id}`, { method: "DELETE" }).then((r) => r.json()),
    },
    socialMedia: {
      getAll: () => fetch(`${API_BASE}/latest/social-media`).then((r) => r.json()),
      create: (data: any) =>
        fetch(`${API_BASE}/latest/social-media`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      update: (id: string, data: any) =>
        fetch(`${API_BASE}/latest/social-media/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      delete: (id: string) =>
        fetch(`${API_BASE}/latest/social-media/${id}`, { method: "DELETE" }).then((r) => r.json()),
    },
  },

  // Location
  location: {
    getAll: () => fetch(`${API_BASE}/location`).then((r) => r.json()),
    create: (data: any) =>
      fetch(`${API_BASE}/location`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: any) =>
      fetch(`${API_BASE}/location/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: string) => fetch(`${API_BASE}/location/${id}`, { method: "DELETE" }).then((r) => r.json()),
  },

  // Pages
  pages: {
    getAll: () => fetch(`${API_BASE}/pages`).then((r) => r.json()),
    getBySlug: (slug: string) => fetch(`${API_BASE}/pages?slug=${slug}`).then((r) => r.json()),
    create: (data: any) =>
      fetch(`${API_BASE}/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: any) =>
      fetch(`${API_BASE}/pages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: string) => fetch(`${API_BASE}/pages/${id}`, { method: "DELETE" }).then((r) => r.json()),
  },

  // Programs
  programs: {
    entrepreneurship: {
      businessDevelopment: {
        getAll: () => fetch(`${API_BASE}/programs/entrepreneurship/business-development`).then((r) => r.json()),
        create: (data: any) =>
          fetch(`${API_BASE}/programs/entrepreneurship/business-development`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        update: (id: string, data: any) =>
          fetch(`${API_BASE}/programs/entrepreneurship/business-development/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        delete: (id: string) =>
          fetch(`${API_BASE}/programs/entrepreneurship/business-development/${id}`, { method: "DELETE" }).then((r) =>
            r.json(),
          ),
      },
      incubation: {
        getAll: () => fetch(`${API_BASE}/programs/entrepreneurship/incubation`).then((r) => r.json()),
        create: (data: any) =>
          fetch(`${API_BASE}/programs/entrepreneurship/incubation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        update: (id: string, data: any) =>
          fetch(`${API_BASE}/programs/entrepreneurship/incubation/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        delete: (id: string) =>
          fetch(`${API_BASE}/programs/entrepreneurship/incubation/${id}`, { method: "DELETE" }).then((r) => r.json()),
      },
      digitalSkills: {
        getAll: () => fetch(`${API_BASE}/programs/entrepreneurship/digital-skills`).then((r) => r.json()),
        create: (data: any) =>
          fetch(`${API_BASE}/programs/entrepreneurship/digital-skills`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        update: (id: string, data: any) =>
          fetch(`${API_BASE}/programs/entrepreneurship/digital-skills/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        delete: (id: string) =>
          fetch(`${API_BASE}/programs/entrepreneurship/digital-skills/${id}`, { method: "DELETE" }).then((r) =>
            r.json(),
          ),
      },
      softSkills: {
        getAll: () => fetch(`${API_BASE}/programs/entrepreneurship/soft-skills`).then((r) => r.json()),
        create: (data: any) =>
          fetch(`${API_BASE}/programs/entrepreneurship/soft-skills`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        update: (id: string, data: any) =>
          fetch(`${API_BASE}/programs/entrepreneurship/soft-skills/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        delete: (id: string) =>
          fetch(`${API_BASE}/programs/entrepreneurship/soft-skills/${id}`, { method: "DELETE" }).then((r) => r.json()),
      },
    },
    fablab: {
      makerSpace: {
        getAll: () => fetch(`${API_BASE}/programs/fablab/maker-space`).then((r) => r.json()),
        create: (data: any) =>
          fetch(`${API_BASE}/programs/fablab/maker-space`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        update: (id: string, data: any) =>
          fetch(`${API_BASE}/programs/fablab/maker-space/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        delete: (id: string) =>
          fetch(`${API_BASE}/programs/fablab/maker-space/${id}`, { method: "DELETE" }).then((r) => r.json()),
      },
      products: {
        getAll: () => fetch(`${API_BASE}/programs/fablab/products`).then((r) => r.json()),
        create: (data: any) =>
          fetch(`${API_BASE}/programs/fablab/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        update: (id: string, data: any) =>
          fetch(`${API_BASE}/programs/fablab/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        delete: (id: string) =>
          fetch(`${API_BASE}/programs/fablab/products/${id}`, { method: "DELETE" }).then((r) => r.json()),
      },
      services: {
        getAll: () => fetch(`${API_BASE}/programs/fablab/services`).then((r) => r.json()),
        create: (data: any) =>
          fetch(`${API_BASE}/programs/fablab/services`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        update: (id: string, data: any) =>
          fetch(`${API_BASE}/programs/fablab/services/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        delete: (id: string) =>
          fetch(`${API_BASE}/programs/fablab/services/${id}`, { method: "DELETE" }).then((r) => r.json()),
      },
      trainingConsultancy: {
        getAll: () => fetch(`${API_BASE}/programs/fablab/training-consultancy`).then((r) => r.json()),
        create: (data: any) =>
          fetch(`${API_BASE}/programs/fablab/training-consultancy`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        update: (id: string, data: any) =>
          fetch(`${API_BASE}/programs/fablab/training-consultancy/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        delete: (id: string) =>
          fetch(`${API_BASE}/programs/fablab/training-consultancy/${id}`, { method: "DELETE" }).then((r) => r.json()),
      },
    },
    stemOperations: {
      scienceFairs: {
        getAll: () => fetch(`${API_BASE}/programs/stem-operations/science-fairs`).then((r) => r.json()),
        create: (data: any) =>
          fetch(`${API_BASE}/programs/stem-operations/science-fairs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        update: (id: string, data: any) =>
          fetch(`${API_BASE}/programs/stem-operations/science-fairs/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        delete: (id: string) =>
          fetch(`${API_BASE}/programs/stem-operations/science-fairs/${id}`, { method: "DELETE" }).then((r) => r.json()),
      },
      stemCenters: {
        getAll: () => fetch(`${API_BASE}/programs/stem-operations/stem-centers`).then((r) => r.json()),
        create: (data: any) =>
          fetch(`${API_BASE}/programs/stem-operations/stem-centers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        update: (id: string, data: any) =>
          fetch(`${API_BASE}/programs/stem-operations/stem-centers/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        delete: (id: string) =>
          fetch(`${API_BASE}/programs/stem-operations/stem-centers/${id}`, { method: "DELETE" }).then((r) => r.json()),
      },
      universityOutreach: {
        getAll: () => fetch(`${API_BASE}/programs/stem-operations/university-outreach`).then((r) => r.json()),
        create: (data: any) =>
          fetch(`${API_BASE}/programs/stem-operations/university-outreach`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        update: (id: string, data: any) =>
          fetch(`${API_BASE}/programs/stem-operations/university-outreach/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        delete: (id: string) =>
          fetch(`${API_BASE}/programs/stem-operations/university-outreach/${id}`, { method: "DELETE" }).then((r) =>
            r.json(),
          ),
      },
      stemTv: {
        getAll: () => fetch(`${API_BASE}/programs/stem-operations/stem-tv`).then((r) => r.json()),
        create: (data: any) =>
          fetch(`${API_BASE}/programs/stem-operations/stem-tv`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        update: (id: string, data: any) =>
          fetch(`${API_BASE}/programs/stem-operations/stem-tv/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        delete: (id: string) =>
          fetch(`${API_BASE}/programs/stem-operations/stem-tv/${id}`, { method: "DELETE" }).then((r) => r.json()),
      },
    },
  },
}

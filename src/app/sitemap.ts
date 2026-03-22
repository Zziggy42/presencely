import type { MetadataRoute } from "next"

const BASE = "https://presencely-production.up.railway.app"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  return [
    // Public / marketing pages — highest priority
    { url: BASE,                                    lastModified: now, changeFrequency: "weekly",  priority: 1.0  },
    { url: `${BASE}/analyze`,                       lastModified: now, changeFrequency: "weekly",  priority: 0.9  },
    { url: `${BASE}/pricing`,                       lastModified: now, changeFrequency: "monthly", priority: 0.8  },

    // Auth
    { url: `${BASE}/auth/login`,                    lastModified: now, changeFrequency: "monthly", priority: 0.5  },
    { url: `${BASE}/auth/signup`,                   lastModified: now, changeFrequency: "monthly", priority: 0.6  },

    // Onboarding
    { url: `${BASE}/onboarding`,                    lastModified: now, changeFrequency: "monthly", priority: 0.5  },

    // Dashboard pages
    { url: `${BASE}/dashboard`,                     lastModified: now, changeFrequency: "weekly",  priority: 0.7  },
    { url: `${BASE}/dashboard/visibility`,          lastModified: now, changeFrequency: "weekly",  priority: 0.7  },
    { url: `${BASE}/dashboard/traffic`,             lastModified: now, changeFrequency: "weekly",  priority: 0.7  },
    { url: `${BASE}/dashboard/reputation`,          lastModified: now, changeFrequency: "weekly",  priority: 0.6  },
    { url: `${BASE}/dashboard/insights`,            lastModified: now, changeFrequency: "weekly",  priority: 0.6  },
    { url: `${BASE}/dashboard/forecast`,            lastModified: now, changeFrequency: "weekly",  priority: 0.6  },
    { url: `${BASE}/dashboard/seo`,                 lastModified: now, changeFrequency: "weekly",  priority: 0.6  },
    { url: `${BASE}/dashboard/brand-gravity`,       lastModified: now, changeFrequency: "weekly",  priority: 0.6  },
    { url: `${BASE}/dashboard/customers`,           lastModified: now, changeFrequency: "weekly",  priority: 0.6  },
    { url: `${BASE}/dashboard/staffing`,            lastModified: now, changeFrequency: "weekly",  priority: 0.5  },
    { url: `${BASE}/dashboard/settings`,            lastModified: now, changeFrequency: "monthly", priority: 0.4  },

    // Audit
    { url: `${BASE}/audit`,                         lastModified: now, changeFrequency: "weekly",  priority: 0.7  },
  ]
}

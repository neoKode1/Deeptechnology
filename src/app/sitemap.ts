import type { MetadataRoute } from 'next';
import { VENDORS } from '@/data/vendors';
import { COMPARISONS } from '@/data/comparisons';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://deeptechnologies.dev';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl,                    lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${baseUrl}/software`,      lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/robotics`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/pilot`,         lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`,       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/privacy`,       lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${baseUrl}/terms`,         lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];

  // One SEO page per vendor — high commercial intent
  const vendorRoutes: MetadataRoute.Sitemap = VENDORS.map((v) => ({
    url: `${baseUrl}/robotics/${v.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Gated comparison pages — high buyer-intent search traffic
  const compareRoutes: MetadataRoute.Sitemap = COMPARISONS.map((c) => ({
    url: `${baseUrl}/compare/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...vendorRoutes, ...compareRoutes];
}


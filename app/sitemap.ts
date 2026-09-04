import type { MetadataRoute } from 'next';
import { siteConfig } from './site-data';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.canonicalUrl,
      lastModified: new Date('2026-08-28'),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}

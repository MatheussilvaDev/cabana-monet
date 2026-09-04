import type { MetadataRoute } from 'next';
import { siteConfig } from './site-data';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteConfig.canonicalUrl}/sitemap.xml`,
  };
}


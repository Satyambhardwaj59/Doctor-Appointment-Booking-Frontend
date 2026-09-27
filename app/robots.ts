import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://docify-health.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/my-profile', '/my-appointments'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

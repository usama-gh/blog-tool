import { headers } from 'next/headers'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const headersList = headers()
  const domain = headersList.get('host') || 'example.com'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'

  return {
    rules: {
      userAgent: '*',
      allow: '/'
    },
    sitemap: `${protocol}://${domain}/sitemap.xml`,
    host: `${protocol}://${domain}`,
  }
}
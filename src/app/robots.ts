import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/playground/',
          '/_next/',
          '/static/',
          '/*.json',
          '/*.map',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/playground/',
        ],
      },
      {
        userAgent: 'Googlebot-News',
        allow: [
          '/nieuws/',
          '/news-sitemap.xml',
        ],
      },
    ],
    sitemap: [
      'https://politie-forum.nl/sitemap.xml',
      'https://politie-forum.nl/news-sitemap.xml',
      'https://politie-forum.nl/feed.xml',
      'https://politie-forum.nl/atom.xml',
    ],
  }
}

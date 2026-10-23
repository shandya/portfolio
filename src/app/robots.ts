export default function robots(): import('next').MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: ['/cms', '/api'] } };
}

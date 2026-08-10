import { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/constants';
import connectToDatabase from '@/lib/mongodb';
import SiteContent from '@/models/Content';

export default async function robots(): Promise<MetadataRoute.Robots> {
  let isNoIndex = false;
  try {
    await connectToDatabase();
    const content = await SiteContent.findOne({ key: 'complete_data' }).lean() as any;
    if (content?.data?.settings?.noIndexNoFollow || content?.data?.settings?.globalNoIndex) {
      isNoIndex = true;
    }
  } catch (e) {
    console.error("Failed to fetch settings for robots.txt", e);
  }

  if (isNoIndex) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
      sitemap: `${BASE_URL}/sitemap.xml`,
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

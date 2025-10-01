import { getTopicIds } from '@/lib/serverFunctions/forum/sitemapHelpers'
import type { MetadataRoute } from 'next'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const topicEntries: MetadataRoute.Sitemap = (await getTopicIds()).map((id) => ({
    url: `https://www.novel-november.com/forum/${id}`,
    changeFrequency: 'daily',
    priority: 0.8
  }))

  return [
    {
      url: 'https://www.novel-november.com/',
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://www.novel-november.com/forum',
      changeFrequency: 'monthly',
      priority: 1,
    },
   ...topicEntries
  ]
}
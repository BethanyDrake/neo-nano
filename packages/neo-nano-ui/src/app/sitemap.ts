import { getHotProfiles, getHotThreads, getTopicIds } from '@/lib/serverFunctions/forum/sitemapHelpers'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const topicEntries: MetadataRoute.Sitemap = (await getTopicIds()).map((id) => ({
    url: `https://www.novel-november.com/forum/${id}`,
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  const threadEntries: MetadataRoute.Sitemap = (await getHotThreads()).map(({ threadId, topicId }) => ({
    url: `https://www.novel-november.com/forum/${topicId}/${threadId}`,
  }))

  const profileEntries = (await getHotProfiles()).map(({profileId}) => ({
    url: `https://www.novel-november.com/profiles/${profileId}`,
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
    {
      url: 'https://www.novel-november.com/tools',
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://www.novel-november.com/moderation/code-of-conduct',
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: 'https://www.novel-november.com/about',
      changeFrequency: 'yearly',
      priority: 0.5,
    },

    {
      url: 'https://www.novel-november.com/analytics',
      changeFrequency: 'daily',
      priority: 0.5,
    },
    ...profileEntries,
    ...topicEntries,
    ...threadEntries,
    
  ]
}

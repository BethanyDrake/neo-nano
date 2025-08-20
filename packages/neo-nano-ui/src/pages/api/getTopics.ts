import { Category } from '@/lib/forum.types'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{categories: Category[]}>
) {
    const categories: Category[] = [{
        id: 'general',
        title: "General", 
        topics: [{
          id: 'generalDiscussion',
          title: 'General Discussion',
          description: 'For anything without a dedicated topic... or when your brain is too fried to find the right place.',
          icon: 'faShield'
        },
        {
          id: 'introductions',
          title: 'Introductions',
          description: 'Introduce yourself, your project, and your cat (optional).',
          icon: 'faBoltLightning'
        }
      ],

    }, {
      id: 'craftOfWriting',
      title: 'Craft of Writing',
      topics: [{
        id: 'appelationStation',
        title: 'Appelation Station',
        description: 'Character names, novel titles, and all other proper nouns.',
        icon: 'faPerson'
      }, {
        id: 'planning',
        title: 'Planning',
        description: 'World building, character sheets, save-the-cat, all planning progress and problems go here.',
        icon: 'faPenFancy'
      }]
    }]
  res.status(200).json({ categories })
}
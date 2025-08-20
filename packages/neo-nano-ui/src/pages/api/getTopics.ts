import { Category } from '@/lib/forum.types'
import type { NextApiRequest, NextApiResponse } from 'next'

import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) throw Error('DATABASE_URL not defined.')
const sql = neon(process.env.DATABASE_URL);

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<{categories: Category[]}>
)  => {


  const _categories = await sql`SELECT * FROM categories`;
  const _topics = await sql`SELECT * FROM topics`;

  const categories = _categories.map((category) => ({
    ...category, 
    topics: _topics.filter(({category: topicCategory}) => topicCategory === category.id)
  })) as Category[]

  res.status(200).json({ categories })
}

export default handler;
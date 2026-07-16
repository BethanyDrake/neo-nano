'use server'
import { Project } from '@/lib/projects/Project.type'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getSingle } from '../_utils/getSingle'
import { rawProjectToProject } from './rawProjectMapper'
import { Profile } from '@/lib/types/forum.types'

export type FeaturedProjectResponse = { user: Pick<Profile, 'id' | 'displayName'>; project: Project }
export const getFeaturedProject = async (): Promise<FeaturedProjectResponse | null> => {
  console.log('getFeaturedProject')
  const sql = getQueryFunction()
  const { count } = await getSingle(
    'count public projects',
    getQueryFunction()`SELECT count(*)
    FROM projects
    WHERE visibility='public'`,
  )
  if (count === 0) return null
  const offset = Math.floor(Math.random() * count)
  const row = await getSingle(
    'project',
    sql`SELECT projects.*, users.display_name
    FROM projects join users on projects.user_id=users.id
    WHERE visibility='public'
    LIMIT 1
    OFFSET ${offset}
    `,
  )
  return {
    project: rawProjectToProject(row),
    user: {
      id: row.user_id,
      displayName: row.display_name,
    },
  }
}

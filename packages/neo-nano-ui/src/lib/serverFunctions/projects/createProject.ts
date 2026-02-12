'use server'

import { Project } from '@/lib/projects/Project.type'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getUserId } from '../_utils/getUserIdFromSession'
import camelcaseKeys from 'camelcase-keys'
export const createProject = async ({title, blurb, visibility, status}: Omit<Project, 'id' | 'userId'>): Promise<Project> => {
  console.log('createProject')
  const user_id = await getUserId()
  const sql = getQueryFunction()

  const [createdProject] = await sql`INSERT INTO projects (user_id, title, blurb, visibility, status) 
        VALUES (${user_id}, ${title}, ${blurb}, ${visibility}, ${status})
        RETURNING *`

  return camelcaseKeys(createdProject) as Project
}

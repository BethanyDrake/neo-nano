'use server'

import { Project } from '@/lib/projects/Project.type'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getUserId } from '../_utils/getUserIdFromSession'
import camelcaseKeys from 'camelcase-keys'

export const updateProject = async ({id, title, blurb, visibility, status, wordCount, excerpt}: Omit<Project, 'userId' >): Promise<Project> => {
  console.log('updateProject')
  const user_id = await getUserId()
  const sql = getQueryFunction()

  const [updatedProject] = await sql`
  UPDATE projects
  SET 
    title=${title}, 
    blurb=${blurb}, 
    visibility=${visibility},
    status=${status},
    word_count=${wordCount ?? null},
    excerpt=${excerpt}
  WHERE user_id=${user_id} AND id=${id}
  RETURNING *
  `


  return camelcaseKeys(updatedProject) as Project
}

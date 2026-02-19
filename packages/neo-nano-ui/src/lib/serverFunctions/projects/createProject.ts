'use server'

import { Project } from '@/lib/projects/Project.type'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getUserId } from '../_utils/getUserIdFromSession'
import { rawProjectToProject } from './rawProjectMapper'
export const createProject = async ({title, blurb, visibility, status, wordCount, excerpt, aspects}: Omit<Project, 'id' | 'userId'>): Promise<Project> => {
  console.log('createProject')
  const user_id = await getUserId()
  const sql = getQueryFunction()

  const [createdProject] = await sql`INSERT INTO projects 
        (user_id, title, blurb, visibility, status, word_count, excerpt, romance_aspect, mystery_aspect, thrill_aspect, complexity_aspect, fantasy_aspect) 
        VALUES (${user_id}, ${title}, ${blurb}, ${visibility}, ${status}, ${wordCount}, ${excerpt}, ${aspects.romance}, ${aspects.mystery}, ${aspects.thrill}, ${aspects.complexity}, ${aspects.fantasy})
        RETURNING *`

  return rawProjectToProject(createdProject)
}

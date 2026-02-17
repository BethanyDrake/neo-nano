'use server'

import { Project } from '@/lib/projects/Project.type'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getUserId } from '../_utils/getUserIdFromSession'
import { rawProjectToProject } from './rawProjectMapper'

export const updateProject = async ({id, title, blurb, visibility, status, wordCount, excerpt, aspects}: Omit<Project, 'userId' >): Promise<Project> => {
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
    excerpt=${excerpt},
    thrill_aspect=${aspects.thrill},
    romance_aspect=${aspects.romance},
    complexity_aspect=${aspects.complexity},
    mystery_aspect=${aspects.mystery},
    fantasy_aspect=${aspects.fantasy}
  WHERE user_id=${user_id} AND id=${id}
  RETURNING *
  `


  return rawProjectToProject(updatedProject)
}

'use server'
import camelcaseKeys from 'camelcase-keys'
import { getQueryFunction } from '../_utils/getQueryFunction'
import {getUserId } from '../_utils/getUserIdFromSession'
import { Project } from '@/lib/projects/Project.type'
import { getIsModerator } from '../moderation/getIsModerator'

export const getMyProjects = async (): Promise<Project[]> => {
  if (!await getIsModerator()) return []
  console.log('getMyProjects')
  const sql = getQueryFunction()
  const user_id = await getUserId()
  const projects = await sql`SELECT * from projects
    WHERE projects.user_id=${user_id}`

  return camelcaseKeys(projects) as Project[]
}

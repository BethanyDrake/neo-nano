'use server'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { Project } from '@/lib/projects/Project.type'
import { rawProjectToProject } from './rawProjectMapper'

export const getPublicProjects = async (userId: string): Promise<Project[]> => {
  console.log('getPublicProjects')
  const sql = getQueryFunction()
  const projects = await sql`SELECT *
    FROM projects
    WHERE user_id=${userId}
    AND visibility='public'`

  return projects.map(rawProjectToProject)
}

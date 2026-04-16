'use server'
import { getQueryFunction } from '../_utils/getQueryFunction'
import {getUserId } from '../_utils/getUserIdFromSession'
import { Project } from '@/lib/projects/Project.type'
import { rawProjectToProject } from './rawProjectMapper'

export const getMyProjects = async (): Promise<Project[]> => {
  console.log('getMyProjects')
  const sql = getQueryFunction()
  const user_id = await getUserId()
  const projects = await sql`SELECT * from projects
    WHERE projects.user_id=${user_id}`

  return projects.map(rawProjectToProject)
}

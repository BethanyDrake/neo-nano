'use server'
import camelcaseKeys from 'camelcase-keys'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { Project } from '@/lib/projects/Project.type'

export const getPublicProjects = async (userId: string) => {
  console.log('getPublicProjects')
  const sql = getQueryFunction()
  const projects = await sql`SELECT *
    FROM projects
    WHERE user_id=${userId}
    AND visibility='public'`

  return camelcaseKeys(projects) as Project[]
}

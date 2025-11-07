'use server'
import { Goal } from '@/lib/forum.types'
import camelcaseKeys from 'camelcase-keys'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getExternalId } from '../_utils/getUserIdFromSession'

export const getMyGoals = async () => {
  const sql = getQueryFunction()
  const external_id = await getExternalId()
  const goals = await sql`SELECT goals.*
    FROM goals join users on users.id=goals.user_id
    WHERE users.external_id=${external_id}
    ORDER BY start_date DESC, id ASC`
  return camelcaseKeys(goals) as Goal[]
}
